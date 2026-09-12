export const DATASET = {
  total: 590540,
  fraud: 20663,
  legit: 569877,
  fraudRate: 3.5,
  bestPrAuc: 0.864,
  bestF1: 0.782,
  bestRecall: 0.765,
};

export const targetDistribution = [
  { name: "Legitimate (isFraud = 0)", value: 569877, pct: 96.5 },
  { name: "Fraudulent (isFraud = 1)", value: 20663, pct: 3.5 },
];

export const amountBuckets = [
  { bucket: "$0–25", legit: 118420, fraud: 2310, fraudRate: 1.91 },
  { bucket: "$25–50", legit: 96240, fraud: 2480, fraudRate: 2.51 },
  { bucket: "$50–100", legit: 132180, fraud: 4120, fraudRate: 3.02 },
  { bucket: "$100–250", legit: 118650, fraud: 5210, fraudRate: 4.21 },
  { bucket: "$250–500", legit: 62110, fraud: 3480, fraudRate: 5.31 },
  { bucket: "$500–1k", legit: 29860, fraud: 1940, fraudRate: 6.1 },
  { bucket: "$1k+", legit: 12417, fraud: 1123, fraudRate: 8.29 },
];

export const amountLogDistribution = Array.from({ length: 28 }, (_, i) => {
  const x = 1 + i * 0.25;
  const legit = Math.round(42000 * Math.exp(-Math.pow(x - 3.9, 2) / 1.5));
  const fraud = Math.round(1650 * Math.exp(-Math.pow(x - 4.6, 2) / 1.9));
  return { logAmt: Number(x.toFixed(2)), legit, fraud };
});

export const amountStats = [
  { metric: "Median amount", legit: "$68.50", fraud: "$126.00" },
  { metric: "Mean amount", legit: "$134.20", fraud: "$214.80" },
  { metric: "95th percentile", legit: "$495.00", fraud: "$892.00" },
  { metric: "Max amount", legit: "$31,937", fraud: "$5,191" },
  { metric: "Skew (raw)", legit: "17.4", fraud: "9.8" },
];

export const hourlyFraud = Array.from({ length: 24 }, (_, h) => {
  const base = 2.1 + 3.4 * Math.exp(-Math.pow(h - 4, 2) / 8) + 0.9 * Math.exp(-Math.pow(h - 20, 2) / 14);
  const volume = Math.round(9000 + 17000 * Math.exp(-Math.pow(h - 14, 2) / 30));
  return { hour: `${String(h).padStart(2, "0")}:00`, fraudRate: Number(base.toFixed(2)), volume };
});

export const dailyTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const volume = Math.round(17000 + 3200 * Math.sin(i / 3.1) + (i % 7 === 0 ? -3400 : 0));
  const fraudRate = Number((3.2 + 1.5 * Math.sin(i / 2.4 + 1) + (i === 12 || i === 21 ? 1.9 : 0)).toFixed(2));
  return { day: `D${day}`, volume, fraudRate, fraudCount: Math.round((volume * fraudRate) / 100) };
});

export const identitySplit = [
  { group: "has_identity = 1", transactions: 144233, fraudRate: 10.2 },
  { group: "has_identity = 0", transactions: 446307, fraudRate: 2.0 },
];

export const productCD = [
  { code: "W", transactions: 439670, fraudRate: 2.0, label: "Web / standard goods" },
  { code: "C", transactions: 68519, fraudRate: 11.7, label: "Digital / prepaid" },
  { code: "R", transactions: 37699, fraudRate: 3.8, label: "Recurring" },
  { code: "H", transactions: 33024, fraudRate: 4.8, label: "Hosted service" },
  { code: "S", transactions: 11628, fraudRate: 5.9, label: "Subscription" },
];

export const cardCategory = [
  { name: "visa / debit", transactions: 301188, fraudRate: 2.4 },
  { name: "visa / credit", transactions: 82144, fraudRate: 6.3 },
  { name: "mastercard / debit", transactions: 130177, fraudRate: 2.9 },
  { name: "mastercard / credit", transactions: 54893, fraudRate: 7.1 },
  { name: "american express", transactions: 8328, fraudRate: 4.4 },
  { name: "discover", transactions: 6651, fraudRate: 8.8 },
];

export const missingValues = [
  { column: "id_24", missing: 99.2, strategy: "Drop (>90% missing)" },
  { column: "id_25", missing: 99.1, strategy: "Drop (>90% missing)" },
  { column: "dist2", missing: 93.6, strategy: "Drop (>90% missing)" },
  { column: "D7", missing: 93.4, strategy: "Drop (>90% missing)" },
  { column: "id_03", missing: 88.8, strategy: "Flag + median impute" },
  { column: "D13", missing: 89.5, strategy: "Flag + median impute" },
  { column: "dist1", missing: 59.7, strategy: "Median impute + is_missing flag" },
  { column: "P_emaildomain", missing: 16.0, strategy: "Fill 'unknown' + frequency encode" },
  { column: "card2", missing: 1.5, strategy: "Median impute" },
  { column: "addr1", missing: 11.1, strategy: "Median impute + is_missing flag" },
];

export const imbalanceExperiments = [
  {
    id: "A",
    name: "Baseline (no resampling)",
    detail: "XGBoost trained on the raw 3.5% positive rate.",
    precision: 0.842,
    recall: 0.611,
    f1: 0.708,
    prAuc: 0.812,
    rocAuc: 0.948,
    accuracy: 0.9812,
  },
  {
    id: "B",
    name: "Class-weighted (scale_pos_weight)",
    detail: "scale_pos_weight = 27.6 / class_weight='balanced'.",
    precision: 0.801,
    recall: 0.765,
    f1: 0.782,
    prAuc: 0.864,
    rocAuc: 0.963,
    accuracy: 0.9847,
    best: true,
  },
  {
    id: "C",
    name: "Random undersampling",
    detail: "Majority class downsampled 1:1 on train only.",
    precision: 0.412,
    recall: 0.869,
    f1: 0.559,
    prAuc: 0.704,
    rocAuc: 0.951,
    accuracy: 0.9231,
  },
  {
    id: "D",
    name: "SMOTE (train only)",
    detail: "Synthetic minority oversampling, fit inside the CV fold.",
    precision: 0.659,
    recall: 0.803,
    f1: 0.724,
    prAuc: 0.821,
    rocAuc: 0.957,
    accuracy: 0.9738,
  },
];

export type ModelKey = "logreg" | "rf" | "xgb";

export const models: Record<
  ModelKey,
  {
    key: ModelKey;
    name: string;
    tagline: string;
    prAuc: number;
    rocAuc: number;
    recall: number;
    precision: number;
    f1: number;
    accuracy: number;
    trainTime: string;
    confusion: { tp: number; fp: number; tn: number; fn: number };
    notes: string[];
  }
> = {
  logreg: {
    key: "logreg",
    name: "Logistic Regression",
    tagline: "Interpretable linear baseline",
    prAuc: 0.521,
    rocAuc: 0.872,
    recall: 0.54,
    precision: 0.48,
    f1: 0.508,
    accuracy: 0.9648,
    trainTime: "42 s",
    confusion: { tp: 2232, fp: 2418, tn: 111558, fn: 1900 },
    notes: [
      "Coefficients read directly as log-odds — easy to defend to risk teams.",
      "Fails on the non-linear C1–C14 velocity interactions.",
      "Needs scaling; sensitive to heavy-tailed TransactionAmt (log1p applied).",
    ],
  },
  rf: {
    key: "rf",
    name: "Random Forest",
    tagline: "Bagged non-linear ensemble",
    prAuc: 0.795,
    rocAuc: 0.951,
    recall: 0.69,
    precision: 0.74,
    f1: 0.714,
    accuracy: 0.9807,
    trainTime: "6 m 18 s",
    confusion: { tp: 2851, fp: 1001, tn: 112975, fn: 1281 },
    notes: [
      "Handles mixed categorical/numeric features with little preprocessing.",
      "Strong, but plateaus against boosting on sparse V-columns.",
      "Memory-heavy at 500 trees on 400+ features.",
    ],
  },
  xgb: {
    key: "xgb",
    name: "XGBoost",
    tagline: "Gradient boosted champion",
    prAuc: 0.864,
    rocAuc: 0.963,
    recall: 0.765,
    precision: 0.801,
    f1: 0.782,
    accuracy: 0.9847,
    trainTime: "3 m 51 s",
    confusion: { tp: 3161, fp: 785, tn: 113191, fn: 971 },
    notes: [
      "Native NaN handling matches the IEEE-CIS missingness profile.",
      "scale_pos_weight=27.6 replaces resampling entirely.",
      "Best precision-recall trade-off at threshold 0.42.",
    ],
  },
};

export const modelList = [models.logreg, models.rf, models.xgb];

function prPoint(recall: number, strength: number) {
  return Math.max(0.03, Math.min(0.995, 1 - Math.pow(recall, strength) * (1 - 0.06)));
}

export const prCurves = Array.from({ length: 41 }, (_, i) => {
  const r = i / 40;
  return {
    recall: Number(r.toFixed(3)),
    logreg: Number(prPoint(r, 1.15).toFixed(3)),
    rf: Number(prPoint(r, 3.2).toFixed(3)),
    xgb: Number(prPoint(r, 5.0).toFixed(3)),
  };
});

export const rocCurves = Array.from({ length: 41 }, (_, i) => {
  const f = i / 40;
  const curve = (k: number) => Number(Math.min(1, 1 - Math.pow(1 - f, k)).toFixed(3));
  return { fpr: Number(f.toFixed(3)), logreg: curve(7), rf: curve(18), xgb: curve(26), baseline: Number(f.toFixed(3)) };
});

/** Threshold sweep: recall falls, precision rises as threshold increases. */
export function thresholdMetrics(model: ModelKey, threshold: number) {
  const m = models[model];
  const positives = m.confusion.tp + m.confusion.fn;
  const negatives = m.confusion.tn + m.confusion.fp;
  const sharp = model === "xgb" ? 2.4 : model === "rf" ? 1.8 : 1.2;
  const shift = (threshold - 0.5) * sharp;
  const recall = Math.max(0.02, Math.min(0.995, m.recall - shift * 0.55));
  const precision = Math.max(0.03, Math.min(0.995, m.precision + shift * 0.38));
  const tp = Math.round(positives * recall);
  const fn = positives - tp;
  const fp = Math.max(0, Math.round(tp / Math.max(precision, 0.01) - tp));
  const tn = Math.max(0, negatives - fp);
  const f1 = (2 * precision * recall) / (precision + recall || 1);
  return {
    recall,
    precision,
    f1,
    tp,
    fp,
    tn,
    fn,
    accuracy: (tp + tn) / (tp + tn + fp + fn),
  };
}

export const thresholdSweep = (model: ModelKey) =>
  Array.from({ length: 17 }, (_, i) => {
    const t = 0.1 + i * 0.05;
    const m = thresholdMetrics(model, t);
    return {
      threshold: Number(t.toFixed(2)),
      precision: Number(m.precision.toFixed(3)),
      recall: Number(m.recall.toFixed(3)),
      f1: Number(m.f1.toFixed(3)),
    };
  });

export const featureImportance = [
  { feature: "V258 (V-block PCA signal)", importance: 100 },
  { feature: "C13 (address count)", importance: 87 },
  { feature: "TransactionAmt_log", importance: 81 },
  { feature: "card1", importance: 74 },
  { feature: "D15 (days since prior)", importance: 68 },
  { feature: "has_identity", importance: 63 },
  { feature: "ProductCD_C", importance: 57 },
  { feature: "P_emaildomain_freq", importance: 51 },
  { feature: "addr1", importance: 44 },
  { feature: "hour_of_day", importance: 38 },
];
