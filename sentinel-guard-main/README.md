# Sentinel Guard

Build "Intelligent Fraud Detection Using Machine Learning" based on the IEEE-CIS Fraud Detection dataset (train_transaction.csv and train_identity.csv).

Design a high-fidelity, polished, dark financial/cybersecurity theme (near-black background #0b0f19, slate/charcoal cards #111827, crisp white typography, subtle blue/cyan accents, and red/orange reserved for fraud alerts).

Include the following comprehensive sections and views:
1. OVERVIEW DASHBOARD:
   - Key stats: Total Analyzed (590,540), Fraudulent (20,663), Legitimate (569,877), Fraud Rate (3.50%), Best Model PR-AUC (0.864), Best F1-Score (0.782), Recall (0.765).
   - Real-world motivation highlighting why accuracy (e.g. 96.5% baseline by predicting all 0s) is useless for fraud detection.
   - High-level activity trends, fraud distribution, and summary cards.

2. EXPLORATORY DATA ANALYSIS (EDA) & DATA INSIGHTS:
   - Interactive charts based on IEEE-CIS insights:
     * Target distribution (3.5% fraud vs 96.5% legitimate)
     * Transaction Amount analysis (log distribution, higher median for fraudulent transactions, outlier patterns)
     * Temporal patterns over TransactionDT (hourly and daily fraud rate spikes)
     * Identity availability: has_identity indicator (transactions with identity data have ~10.2% fraud rate vs 2% without)
     * ProductCD and Card category fraud breakdown
     * Missing value profiling (showing high-missingness columns and cleaning strategy)

3. DATA PREPROCESSING & LEAKAGE PREVENTION PIPELINE:
   - Visual interactive pipeline showing the strict separation: Data Understanding -> Train/Test Split (Stratified 80/20) -> Preprocessing fit ONLY on Train -> Class Imbalance Handling on Train Only -> Evaluation on untouched Test set.
   - Documentation of leakage prevention rules (why SMOTE on test data causes catastrophic overfitting).

4. CLASS IMBALANCE EXPERIMENTS:
   - Benchmark table comparing:
     * Experiment A: Baseline (No resampling)
     * Experiment B: Class-Weighted learning (scale_pos_weight / class_weight='balanced')
     * Experiment C: Random Undersampling
     * Experiment D: SMOTE (applied strictly on train set)
   - Visual comparison of Precision-Recall trade-offs and F1 scores.

5. MODEL COMPARISON BENCHMARK:
   - Detailed side-by-side comparison of the 3 required models:
     * Model 1: Logistic Regression (Interpretable baseline, PR-AUC ~0.521, Recall 0.54, Precision 0.48)
     * Model 2: Random Forest (Non-linear ensemble, PR-AUC ~0.795, Recall 0.69, Precision 0.74)
     * Model 3: XGBoost (Gradient boosted trees champion, PR-AUC ~0.864, Recall 0.765, Precision 0.801)
   - Interactive Precision-Recall curves and ROC curves.
   - Interactive Confusion Matrices for each model showing True Positives, False Positives, True Negatives, False Negatives.
   - Interactive Threshold Tuning Slider (0.10 to 0.90) demonstrating how threshold optimization controls fraud recall vs false alarms.

6. LIVE TRANSACTION PREDICTION STUDIO:
   - Educational interactive predictor allowing user to input or choose realistic preset transactions (e.g., "Normal Domestic Purchase", "High-Velocity Digital Product", "Suspicious Foreign IP / Unknown Card", "Midnight Large Wire"):
     * TransactionAmt, ProductCD, card1-card4, addr1, dist1, P_emaildomain, C1-C14 transaction counts, DeviceType.
   - Displays real-time prediction:
     * Predicted Class: Legitimate vs Fraudulent
     * Calibrated Fraud Probability % (e.g. 87.4%)
     * Risk Tier: LOW RISK (Green), SUSPICIOUS (Amber), HIGH RISK (Red)
     * Key contributing risk factors.
     * Disclaimer badge: "Educational ML Prototype — Benchmarked on IEEE-CIS Dataset".

7. CODEBASE & INTERNSHIP SUBMISSION HUB:
   - A dedicated tab displaying the complete, clean, modular Python codebase ready for GitHub / resume review:
     * Directory tree viewer matching the exact requested structure (data/, notebooks/, src/, models/, app/, requirements.txt, README.md, main.py).
     * File viewer with full syntax-highlighted code for:
       - `src/data_preprocessing.py`
       - `src/feature_engineering.py`
       - `src/train.py`
       - `src/evaluate.py`
       - `src/predict.py`
       - `notebooks/fraud_detection_eda.ipynb` (interactive notebook preview)
       - `app/app.py` (complete Streamlit implementation)
       - `requirements.txt`
       - `README.md` (comprehensive internship documentation with problem statement, methodology, evaluation, limitations)
     * "Download Project ZIP" or "Copy Code" functionality for seamless export.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a9a458b-e14b-4e82-bb27-30b158936ecb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
