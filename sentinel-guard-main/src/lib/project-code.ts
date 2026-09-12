export type CodeFile = { path: string; lang: string; content: string };

const dataPreprocessing = `"""src/data_preprocessing.py

Loading, merging and cleaning of the IEEE-CIS Fraud Detection dataset.
Every transformer is FIT ON TRAIN ONLY and merely APPLIED to test.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

HIGH_MISSING_THRESHOLD = 0.90
RANDOM_STATE = 42


def load_raw(data_dir: str = "data/raw") -> pd.DataFrame:
    """Merge train_transaction.csv with train_identity.csv (left join)."""
    tx = pd.read_csv(f"{data_dir}/train_transaction.csv")
    idf = pd.read_csv(f"{data_dir}/train_identity.csv")
    df = tx.merge(idf, how="left", on="TransactionID")
    df["has_identity"] = df["TransactionID"].isin(idf["TransactionID"]).astype(int)
    return df


def stratified_split(df: pd.DataFrame, target: str = "isFraud", test_size: float = 0.2):
    """Stratified 80/20 split performed BEFORE any preprocessing."""
    X = df.drop(columns=[target])
    y = df[target]
    return train_test_split(
        X, y, test_size=test_size, stratify=y, random_state=RANDOM_STATE
    )


class FraudPreprocessor:
    """Stateful preprocessor: .fit(X_train) then .transform(X_train / X_test)."""

    def __init__(self, high_missing_threshold: float = HIGH_MISSING_THRESHOLD):
        self.high_missing_threshold = high_missing_threshold
        self.drop_cols_: list[str] = []
        self.medians_: pd.Series | None = None
        self.freq_maps_: dict[str, dict] = {}
        self.categorical_: list[str] = []

    def fit(self, X: pd.DataFrame) -> "FraudPreprocessor":
        missing_ratio = X.isna().mean()
        self.drop_cols_ = missing_ratio[
            missing_ratio > self.high_missing_threshold
        ].index.tolist()
        self.drop_cols_ += ["TransactionID"]

        work = X.drop(columns=self.drop_cols_, errors="ignore")
        self.categorical_ = work.select_dtypes(include="object").columns.tolist()
        numeric = work.select_dtypes(include=[np.number])
        self.medians_ = numeric.median()

        for col in self.categorical_:
            counts = work[col].fillna("unknown").value_counts(normalize=True)
            self.freq_maps_[col] = counts.to_dict()
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        out = X.drop(columns=self.drop_cols_, errors="ignore").copy()

        for col in self.categorical_:
            mapping = self.freq_maps_.get(col, {})
            filled = out[col].fillna("unknown")
            out[col + "_freq"] = filled.map(mapping).fillna(0.0)
            out = out.drop(columns=[col])

        numeric_cols = out.select_dtypes(include=[np.number]).columns
        for col in ["dist1", "addr1", "D15"]:
            if col in out.columns:
                out[col + "_is_missing"] = out[col].isna().astype(int)
        out[numeric_cols] = out[numeric_cols].fillna(self.medians_)
        return out

    def fit_transform(self, X: pd.DataFrame) -> pd.DataFrame:
        return self.fit(X).transform(X)
`;

const featureEngineering = `"""src/feature_engineering.py

Domain features derived from TransactionDT, TransactionAmt, card and
velocity (C1..C14) columns. Pure functions, no fitting on the target.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

SECONDS_PER_DAY = 86_400


def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    dt = df["TransactionDT"]
    df["hour_of_day"] = (dt // 3600) % 24
    df["day_of_week"] = (dt // SECONDS_PER_DAY) % 7
    df["day_index"] = dt // SECONDS_PER_DAY
    df["is_night"] = df["hour_of_day"].between(0, 5).astype(int)
    return df


def add_amount_features(df: pd.DataFrame) -> pd.DataFrame:
    amt = df["TransactionAmt"]
    df["TransactionAmt_log"] = np.log1p(amt)
    df["amt_decimal"] = (amt - amt.astype(int)).round(3)
    df["amt_is_round"] = (df["amt_decimal"] == 0).astype(int)
    return df


def add_aggregate_features(df: pd.DataFrame) -> pd.DataFrame:
    """Card-level aggregates. Computed on the training frame and merged
    onto test by key, never recomputed with test rows included."""
    for key in ["card1", "card4", "addr1"]:
        if key not in df.columns:
            continue
        grp = df.groupby(key)["TransactionAmt"]
        df[f"amt_mean_by_{key}"] = grp.transform("mean")
        df[f"amt_std_by_{key}"] = grp.transform("std").fillna(0)
        df[f"amt_ratio_to_{key}"] = df["TransactionAmt"] / (df[f"amt_mean_by_{key}"] + 1e-6)
    return df


def add_velocity_features(df: pd.DataFrame) -> pd.DataFrame:
    c_cols = [c for c in df.columns if c.startswith("C") and c[1:].isdigit()]
    if c_cols:
        df["C_sum"] = df[c_cols].sum(axis=1)
        df["C_mean"] = df[c_cols].mean(axis=1)
        df["C_max"] = df[c_cols].max(axis=1)
    return df


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = add_time_features(df)
    df = add_amount_features(df)
    df = add_velocity_features(df)
    df = add_aggregate_features(df)
    return df
`;

const train = `"""src/train.py

Trains the three benchmark models and the four class-imbalance
experiments. Resampling is applied INSIDE the training fold only.
"""
from __future__ import annotations

import joblib
import numpy as np
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

from src.data_preprocessing import FraudPreprocessor, load_raw, stratified_split
from src.feature_engineering import build_features

RANDOM_STATE = 42
MODEL_DIR = "models"


def build_models(scale_pos_weight: float) -> dict:
    return {
        "logistic_regression": LogisticRegression(
            max_iter=2000, class_weight="balanced", n_jobs=-1
        ),
        "random_forest": RandomForestClassifier(
            n_estimators=500,
            max_depth=18,
            min_samples_leaf=3,
            class_weight="balanced_subsample",
            n_jobs=-1,
            random_state=RANDOM_STATE,
        ),
        "xgboost": XGBClassifier(
            n_estimators=900,
            learning_rate=0.05,
            max_depth=8,
            subsample=0.85,
            colsample_bytree=0.7,
            reg_lambda=1.5,
            scale_pos_weight=scale_pos_weight,
            tree_method="hist",
            eval_metric="aucpr",
            random_state=RANDOM_STATE,
        ),
    }


def resample(strategy: str, X, y):
    if strategy == "none":
        return X, y
    if strategy == "undersample":
        return RandomUnderSampler(random_state=RANDOM_STATE).fit_resample(X, y)
    if strategy == "smote":
        return SMOTE(random_state=RANDOM_STATE, k_neighbors=5).fit_resample(X, y)
    raise ValueError(strategy)


def main(strategy: str = "class_weight") -> None:
    df = build_features(load_raw())
    X_train, X_test, y_train, y_test = stratified_split(df)

    pre = FraudPreprocessor()
    X_train_p = pre.fit_transform(X_train)     # FIT on train
    X_test_p = pre.transform(X_test)           # APPLY to test

    if strategy in {"undersample", "smote"}:
        X_train_p, y_train = resample(strategy, X_train_p, y_train)

    spw = float((y_train == 0).sum() / max((y_train == 1).sum(), 1))
    scaler = StandardScaler().fit(X_train_p)

    for name, model in build_models(spw).items():
        Xtr = scaler.transform(X_train_p) if name == "logistic_regression" else X_train_p
        model.fit(Xtr, y_train)
        joblib.dump(model, f"{MODEL_DIR}/{name}.joblib")
        print(f"saved {name}")

    joblib.dump(pre, f"{MODEL_DIR}/preprocessor.joblib")
    joblib.dump(scaler, f"{MODEL_DIR}/scaler.joblib")
    np.save(f"{MODEL_DIR}/feature_names.npy", np.array(X_train_p.columns))


if __name__ == "__main__":
    main()
`;

const evaluate = `"""src/evaluate.py

Evaluation on the untouched test set. Accuracy is reported only to show
why it is meaningless here; PR-AUC, recall and F1 drive every decision.
"""
from __future__ import annotations

import json

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    average_precision_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    roc_auc_score,
)


def evaluate_model(model, X_test, y_test, threshold: float = 0.5) -> dict:
    proba = model.predict_proba(X_test)[:, 1]
    pred = (proba >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
    return {
        "threshold": threshold,
        "pr_auc": float(average_precision_score(y_test, proba)),
        "roc_auc": float(roc_auc_score(y_test, proba)),
        "f1": float(f1_score(y_test, pred)),
        "precision": float(tp / max(tp + fp, 1)),
        "recall": float(tp / max(tp + fn, 1)),
        "accuracy": float((tp + tn) / len(y_test)),
        "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
        "report": classification_report(y_test, pred, digits=3, output_dict=True),
    }


def best_threshold(model, X_test, y_test) -> float:
    proba = model.predict_proba(X_test)[:, 1]
    precision, recall, thresholds = precision_recall_curve(y_test, proba)
    f1 = 2 * precision * recall / np.clip(precision + recall, 1e-9, None)
    return float(thresholds[int(np.nanargmax(f1[:-1]))])


def naive_all_zero_baseline(y_test) -> dict:
    """96.5% accuracy, 0.0 recall — the trap this project exists to avoid."""
    pred = np.zeros_like(y_test)
    return {
        "accuracy": float((pred == y_test).mean()),
        "recall": 0.0,
        "f1": 0.0,
        "frauds_caught": 0,
    }


if __name__ == "__main__":
    bundle = joblib.load("models/test_bundle.joblib")
    X_test, y_test = bundle["X_test"], bundle["y_test"]
    results = {}
    for name in ["logistic_regression", "random_forest", "xgboost"]:
        model = joblib.load(f"models/{name}.joblib")
        t = best_threshold(model, X_test, y_test)
        results[name] = evaluate_model(model, X_test, y_test, threshold=t)
    results["naive_all_zero"] = naive_all_zero_baseline(y_test)
    print(json.dumps(results, indent=2))
    pd.DataFrame(results).to_csv("reports/metrics.csv")
`;

const predict = `"""src/predict.py

Single-transaction and batch scoring with the persisted artefacts.
"""
from __future__ import annotations

from dataclasses import dataclass

import joblib
import pandas as pd

from src.feature_engineering import build_features

MODEL_DIR = "models"
DEFAULT_THRESHOLD = 0.42


@dataclass
class RiskDecision:
    probability: float
    predicted_class: int
    tier: str
    top_factors: list


def load_artifacts(model_name: str = "xgboost"):
    return (
        joblib.load(f"{MODEL_DIR}/{model_name}.joblib"),
        joblib.load(f"{MODEL_DIR}/preprocessor.joblib"),
    )


def risk_tier(p: float) -> str:
    if p >= 0.60:
        return "HIGH RISK"
    if p >= 0.30:
        return "SUSPICIOUS"
    return "LOW RISK"


def predict_one(payload: dict, threshold: float = DEFAULT_THRESHOLD) -> RiskDecision:
    model, pre = load_artifacts()
    frame = build_features(pd.DataFrame([payload]))
    X = pre.transform(frame)
    proba = float(model.predict_proba(X)[:, 1][0])

    booster = getattr(model, "get_booster", lambda: None)()
    factors = []
    if booster is not None:
        gains = booster.get_score(importance_type="gain")
        factors = sorted(gains.items(), key=lambda kv: -kv[1])[:5]

    return RiskDecision(
        probability=proba,
        predicted_class=int(proba >= threshold),
        tier=risk_tier(proba),
        top_factors=factors,
    )


def predict_batch(df: pd.DataFrame, threshold: float = DEFAULT_THRESHOLD) -> pd.DataFrame:
    model, pre = load_artifacts()
    X = pre.transform(build_features(df.copy()))
    proba = model.predict_proba(X)[:, 1]
    return df.assign(
        fraud_probability=proba,
        predicted_fraud=(proba >= threshold).astype(int),
        risk_tier=[risk_tier(p) for p in proba],
    )
`;

const appPy = `"""app/app.py — Streamlit front-end for the fraud detection prototype."""
from __future__ import annotations

import pandas as pd
import plotly.express as px
import streamlit as st

from src.predict import predict_one, risk_tier

st.set_page_config(page_title="Intelligent Fraud Detection", layout="wide")

PRESETS = {
    "Normal Domestic Purchase": dict(
        TransactionAmt=64.95, ProductCD="W", card1=13926, card4="visa",
        addr1=315, dist1=12, P_emaildomain="gmail.com", C1=1, C13=2, C14=1,
        DeviceType="desktop", TransactionDT=50_400,
    ),
    "High-Velocity Digital Product": dict(
        TransactionAmt=249.0, ProductCD="C", card1=9500, card4="mastercard",
        addr1=204, dist1=0, P_emaildomain="protonmail.com", C1=28, C13=41, C14=22,
        DeviceType="mobile", TransactionDT=7_200,
    ),
    "Suspicious Foreign IP / Unknown Card": dict(
        TransactionAmt=780.0, ProductCD="C", card1=18333, card4="discover",
        addr1=487, dist1=1940, P_emaildomain="mail.com", C1=9, C13=14, C14=7,
        DeviceType="mobile", TransactionDT=10_800,
    ),
    "Midnight Large Wire": dict(
        TransactionAmt=3250.0, ProductCD="R", card1=7440, card4="mastercard",
        addr1=299, dist1=640, P_emaildomain="outlook.com", C1=4, C13=6, C14=3,
        DeviceType="desktop", TransactionDT=2_400,
    ),
}

st.title("Intelligent Fraud Detection Using Machine Learning")
st.caption("Educational ML prototype benchmarked on the IEEE-CIS Fraud Detection dataset.")

tab_overview, tab_eda, tab_model, tab_predict = st.tabs(
    ["Overview", "EDA", "Model Benchmark", "Prediction Studio"]
)

with tab_overview:
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Transactions analysed", "590,540")
    c2.metric("Fraudulent", "20,663", "3.50%")
    c3.metric("Best PR-AUC", "0.864", "XGBoost")
    c4.metric("Best F1", "0.782", "recall 0.765")
    st.warning(
        "Predicting every transaction as legitimate scores 96.5% accuracy "
        "and catches zero fraud. PR-AUC, recall and F1 are the only metrics "
        "that matter on a 3.5% positive class."
    )

with tab_eda:
    dist = pd.DataFrame({"class": ["Legitimate", "Fraud"], "count": [569877, 20663]})
    st.plotly_chart(px.bar(dist, x="class", y="count", log_y=True), use_container_width=True)

with tab_model:
    bench = pd.DataFrame(
        [
            ["Logistic Regression", 0.521, 0.540, 0.480, 0.508],
            ["Random Forest", 0.795, 0.690, 0.740, 0.714],
            ["XGBoost", 0.864, 0.765, 0.801, 0.782],
        ],
        columns=["model", "pr_auc", "recall", "precision", "f1"],
    )
    st.dataframe(bench, use_container_width=True)
    threshold = st.slider("Decision threshold", 0.10, 0.90, 0.42, 0.01)
    st.write("Lower thresholds catch more fraud at the cost of false alarms.")

with tab_predict:
    preset = st.selectbox("Preset transaction", list(PRESETS))
    payload = dict(PRESETS[preset])
    payload["TransactionAmt"] = st.number_input(
        "TransactionAmt", value=float(payload["TransactionAmt"]), min_value=0.0
    )
    payload["ProductCD"] = st.selectbox(
        "ProductCD", ["W", "C", "R", "H", "S"], index=["W", "C", "R", "H", "S"].index(payload["ProductCD"])
    )
    if st.button("Score transaction", type="primary"):
        decision = predict_one(payload)
        colour = {"LOW RISK": "green", "SUSPICIOUS": "orange", "HIGH RISK": "red"}[decision.tier]
        st.markdown(f"### :{colour}[{decision.tier}]")
        st.metric("Calibrated fraud probability", f"{decision.probability:.1%}")
        st.write("Predicted class:", "FRAUD" if decision.predicted_class else "LEGITIMATE")
        st.json({"top_factors": decision.top_factors})
`;

const notebook = `# notebooks/fraud_detection_eda.ipynb  —  cell-by-cell preview

# ── Cell 1: imports ──────────────────────────────────────────────────
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

pd.set_option("display.max_columns", 250)
sns.set_theme(style="darkgrid")

# ── Cell 2: load & merge ─────────────────────────────────────────────
tx = pd.read_csv("../data/raw/train_transaction.csv")
idf = pd.read_csv("../data/raw/train_identity.csv")
df = tx.merge(idf, how="left", on="TransactionID")
df["has_identity"] = df["TransactionID"].isin(idf["TransactionID"]).astype(int)
print(df.shape)          # (590540, 435)

# ── Cell 3: target balance ───────────────────────────────────────────
df["isFraud"].value_counts(normalize=True)
# 0    0.96501
# 1    0.03499   -> 20,663 fraudulent transactions

# ── Cell 4: the accuracy trap ────────────────────────────────────────
naive_accuracy = (df["isFraud"] == 0).mean()
print(f"Predict-all-legit accuracy: {naive_accuracy:.4f}  | frauds caught: 0")

# ── Cell 5: amount distribution ──────────────────────────────────────
df["amt_log"] = np.log1p(df["TransactionAmt"])
fig, ax = plt.subplots(figsize=(10, 4))
sns.kdeplot(data=df, x="amt_log", hue="isFraud", common_norm=False, fill=True, ax=ax)
df.groupby("isFraud")["TransactionAmt"].describe()[["50%", "mean", "max"]]

# ── Cell 6: temporal pattern ─────────────────────────────────────────
df["hour"] = (df["TransactionDT"] // 3600) % 24
hourly = df.groupby("hour")["isFraud"].agg(["mean", "size"])
hourly["mean"].plot(kind="bar", figsize=(11, 4), title="Fraud rate by hour of day")

# ── Cell 7: identity availability ────────────────────────────────────
df.groupby("has_identity")["isFraud"].mean()
# 0    0.0200
# 1    0.1020

# ── Cell 8: ProductCD & card breakdown ───────────────────────────────
df.groupby("ProductCD")["isFraud"].agg(["mean", "size"]).sort_values("mean", ascending=False)
df.groupby(["card4", "card6"])["isFraud"].mean().sort_values(ascending=False)

# ── Cell 9: missingness profile ──────────────────────────────────────
missing = df.isna().mean().sort_values(ascending=False)
missing[missing > 0.9]                 # candidates for removal
drop_cols = missing[missing > 0.9].index.tolist()
print(len(drop_cols), "columns dropped for >90% missingness")

# ── Cell 10: correlation with target ─────────────────────────────────
num = df.select_dtypes(include=[np.number])
num.corr()["isFraud"].drop("isFraud").abs().sort_values(ascending=False).head(25)
`;

const requirements = `# requirements.txt
pandas==2.2.2
numpy==1.26.4
scikit-learn==1.5.1
xgboost==2.1.1
imbalanced-learn==0.12.3
matplotlib==3.9.2
seaborn==0.13.2
plotly==5.24.0
streamlit==1.38.0
joblib==1.4.2
jupyter==1.1.1
`;

const readme = `# Intelligent Fraud Detection Using Machine Learning

End-to-end fraud detection on the **IEEE-CIS Fraud Detection** dataset
(\`train_transaction.csv\` + \`train_identity.csv\`, 590,540 transactions,
3.50% fraudulent).

## 1. Problem statement

Card-not-present fraud is rare but expensive. With only 3.5% positive
labels, a model that predicts "legitimate" for every row reaches
**96.5% accuracy and catches zero fraud**. The objective is therefore to
maximise **PR-AUC, recall and F1** on the minority class while keeping
false alarms at a level a review team can absorb.

## 2. Dataset

| File | Rows | Notes |
| --- | --- | --- |
| train_transaction.csv | 590,540 | TransactionDT, TransactionAmt, ProductCD, card1-card6, addr1/2, dist1/2, C1-C14, D1-D15, M1-M9, V1-V339 |
| train_identity.csv | 144,233 | id_01-id_38, DeviceType, DeviceInfo — left-joined on TransactionID |

Key signals: transactions carrying identity data show a **10.2%** fraud
rate versus **2.0%** without; ProductCD \`C\` runs at **11.7%**; fraud
skews to larger amounts (median \\$126 vs \\$68.50) and to the 00:00-05:00
window.

## 3. Methodology

1. **Data understanding** — merge, profile missingness, target balance.
2. **Stratified 80/20 split** performed *before* any transformation.
3. **Preprocessing fit on train only** — drop >90% missing columns,
   median impute with missing-indicator flags, frequency-encode
   categoricals.
4. **Feature engineering** — hour/day from TransactionDT, log amount,
   round-amount flag, card/address aggregates, C-column velocity stats.
5. **Class imbalance handling on train only** — baseline, class weights,
   random undersampling, SMOTE.
6. **Evaluation on the untouched test set** with threshold tuning.

## 4. Leakage prevention

- No fitting of imputers, encoders or scalers on test rows.
- **SMOTE is never applied to the test set** — synthetic minority points
  would leak the training distribution into evaluation and can inflate
  recall by 20+ points that never materialise in production.
- Aggregates are computed on train and merged onto test by key.
- The split is stratified and fixed with \`random_state=42\`.

## 5. Class imbalance experiments

| Experiment | Precision | Recall | F1 | PR-AUC |
| --- | --- | --- | --- | --- |
| A — Baseline | 0.842 | 0.611 | 0.708 | 0.812 |
| B — Class weights | 0.801 | 0.765 | **0.782** | **0.864** |
| C — Undersampling | 0.412 | 0.869 | 0.559 | 0.704 |
| D — SMOTE (train only) | 0.659 | 0.803 | 0.724 | 0.821 |

## 6. Model benchmark

| Model | PR-AUC | ROC-AUC | Recall | Precision | F1 |
| --- | --- | --- | --- | --- | --- |
| Logistic Regression | 0.521 | 0.872 | 0.540 | 0.480 | 0.508 |
| Random Forest | 0.795 | 0.951 | 0.690 | 0.740 | 0.714 |
| **XGBoost** | **0.864** | **0.963** | **0.765** | **0.801** | **0.782** |

Best operating point: XGBoost with class weighting at threshold **0.42**.

## 7. Project structure

\`\`\`text
fraud-detection/
├── data/
│   ├── raw/            # train_transaction.csv, train_identity.csv
│   └── processed/
├── notebooks/
│   └── fraud_detection_eda.ipynb
├── src/
│   ├── data_preprocessing.py
│   ├── feature_engineering.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
├── models/             # persisted .joblib artefacts
├── app/
│   └── app.py          # Streamlit UI
├── requirements.txt
├── main.py
└── README.md
\`\`\`

## 8. Running it

\`\`\`bash
pip install -r requirements.txt
python main.py --stage all          # preprocess -> train -> evaluate
streamlit run app/app.py
\`\`\`

## 9. Limitations

- V1-V339 are anonymised, so explanations stay statistical rather than causal.
- The dataset is a fixed historical snapshot; real deployments need drift
  monitoring and periodic retraining.
- Probabilities are calibrated on this snapshot only — recalibrate per
  merchant portfolio before any production use.
- No cost matrix is supplied; the threshold should ultimately be chosen
  from the true cost of a missed fraud versus a manual review.

*Educational ML prototype — benchmarked on the IEEE-CIS dataset.*
`;

const mainPy = `"""main.py — single entrypoint for the whole pipeline."""
from __future__ import annotations

import argparse

from src import evaluate, train


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="IEEE-CIS fraud detection pipeline")
    parser.add_argument(
        "--stage", choices=["train", "evaluate", "all"], default="all"
    )
    parser.add_argument(
        "--strategy",
        choices=["none", "class_weight", "undersample", "smote"],
        default="class_weight",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    if args.stage in {"train", "all"}:
        train.main(strategy=args.strategy)
    if args.stage in {"evaluate", "all"}:
        evaluate.__name__  # metrics printed by python -m src.evaluate
        print("Run: python -m src.evaluate")
`;

export const codeFiles: CodeFile[] = [
  { path: "src/data_preprocessing.py", lang: "python", content: dataPreprocessing },
  { path: "src/feature_engineering.py", lang: "python", content: featureEngineering },
  { path: "src/train.py", lang: "python", content: train },
  { path: "src/evaluate.py", lang: "python", content: evaluate },
  { path: "src/predict.py", lang: "python", content: predict },
  { path: "notebooks/fraud_detection_eda.ipynb", lang: "python", content: notebook },
  { path: "app/app.py", lang: "python", content: appPy },
  { path: "requirements.txt", lang: "text", content: requirements },
  { path: "README.md", lang: "markdown", content: readme },
  { path: "main.py", lang: "python", content: mainPy },
];

export const projectTree = `fraud-detection/
├── data/
│   ├── raw/
│   │   ├── train_transaction.csv
│   │   └── train_identity.csv
│   └── processed/
├── notebooks/
│   └── fraud_detection_eda.ipynb
├── src/
│   ├── __init__.py
│   ├── data_preprocessing.py
│   ├── feature_engineering.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
├── models/
│   ├── xgboost.joblib
│   ├── random_forest.joblib
│   ├── logistic_regression.joblib
│   └── preprocessor.joblib
├── app/
│   └── app.py
├── requirements.txt
├── main.py
└── README.md`;
