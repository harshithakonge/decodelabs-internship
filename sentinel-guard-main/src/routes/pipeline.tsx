import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Database, FlaskConical, GitBranch, Scale, ShieldCheck, X } from "lucide-react";

import { PageHeader, Panel, Pill } from "@/components/site/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Preprocessing & Leakage Prevention Pipeline — Fraud Detection" },
      {
        name: "description",
        content:
          "Stratified 80/20 split first, preprocessing fit on train only, imbalance handling on train only, evaluation on an untouched test set.",
      },
      { property: "og:title", content: "Preprocessing & Leakage Prevention Pipeline" },
      {
        property: "og:description",
        content:
          "Interactive walkthrough of a leakage-safe fraud detection pipeline, including why SMOTE on test data destroys evaluation validity.",
      },
    ],
  }),
  component: PipelinePage,
});

const STAGES = [
  {
    id: "understand",
    icon: Database,
    title: "1. Data understanding",
    short: "Merge & profile",
    body: "train_transaction.csv (590,540 × 394) is left-joined to train_identity.csv (144,233 × 41) on TransactionID. Missingness, target balance and dtype profiling happen here — read-only, no transformation is persisted.",
    code: "df = tx.merge(idf, how='left', on='TransactionID')\ndf['has_identity'] = df['TransactionID'].isin(idf['TransactionID']).astype(int)",
    guard: "Nothing is fitted at this stage.",
  },
  {
    id: "split",
    icon: GitBranch,
    title: "2. Stratified 80/20 split",
    short: "Split FIRST",
    body: "The split happens before a single imputer or encoder is fitted. Stratification keeps the 3.5% fraud rate identical in both partitions: 472,432 train rows (16,531 fraud) and 118,108 test rows (4,132 fraud).",
    code: "X_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42)",
    guard: "The test set is sealed from this line onward.",
  },
  {
    id: "preprocess",
    icon: FlaskConical,
    title: "3. Preprocessing fit on TRAIN only",
    short: "fit(train) → transform(test)",
    body: "Drop columns above 90% missingness, median-impute with missing indicators, frequency-encode categoricals, scale for the linear model. Every statistic — medians, category frequencies, scaler means — is learned from the training partition.",
    code: "pre = FraudPreprocessor()\nX_train_p = pre.fit_transform(X_train)   # learns medians & freq maps\nX_test_p  = pre.transform(X_test)        # applies them, learns nothing",
    guard: "Calling fit_transform on test would leak test statistics into the model.",
  },
  {
    id: "imbalance",
    icon: Scale,
    title: "4. Class imbalance handling on TRAIN only",
    short: "Resample train",
    body: "Class weighting (scale_pos_weight = 27.6), random undersampling or SMOTE are applied exclusively to the training fold. Inside cross-validation the resampler lives in the imblearn Pipeline so it re-fits per fold.",
    code: "pipe = ImbPipeline([('smote', SMOTE(random_state=42)),\n                    ('clf', XGBClassifier(...))])\ncross_val_score(pipe, X_train_p, y_train, scoring='average_precision', cv=5)",
    guard: "The test set keeps its natural 3.5% prevalence — always.",
  },
  {
    id: "evaluate",
    icon: ShieldCheck,
    title: "5. Evaluation on the untouched test set",
    short: "Score once",
    body: "The sealed test set is scored once per candidate model. PR-AUC, recall, precision, F1 and the confusion matrix are reported at a threshold selected from the training-fold PR curve, not from the test set.",
    code: "proba = model.predict_proba(X_test_p)[:, 1]\nprint(average_precision_score(y_test, proba))  # 0.864",
    guard: "Threshold selection uses train-fold curves so the test estimate stays unbiased.",
  },
] as const;

const RULES = [
  {
    ok: false,
    title: "SMOTE applied before the split",
    body: "Synthetic minority points are interpolated between neighbours that later land on both sides of the split. Near-duplicates of test frauds sit in training, recall looks like 0.95 offline and collapses in production.",
  },
  {
    ok: false,
    title: "Imputing with global medians",
    body: "A median computed over all 590,540 rows encodes test-set information into every training row. Subtle, but it inflates PR-AUC by roughly 1–2 points.",
  },
  {
    ok: false,
    title: "Target encoding without fold isolation",
    body: "Encoding card1 by mean isFraud over the whole frame leaks the label directly. If used, it must be computed out-of-fold.",
  },
  {
    ok: false,
    title: "Tuning the threshold on the test set",
    body: "Picking the F1-optimal threshold on test turns the test set into a validation set and overstates deployed performance.",
  },
  {
    ok: true,
    title: "Stratified split with a fixed seed",
    body: "random_state=42 with stratify=y makes every experiment comparable and preserves the 3.5% prevalence.",
  },
  {
    ok: true,
    title: "Resampler inside the CV pipeline",
    body: "imblearn's Pipeline re-fits SMOTE within each training fold, so validation folds always retain the real class ratio.",
  },
  {
    ok: true,
    title: "Missing indicators before imputation",
    body: "Absence is predictive in IEEE-CIS; the flag preserves that signal without touching test statistics.",
  },
];

function PipelinePage() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active] ?? STAGES[0];
  const Icon = stage.icon;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Preprocessing Pipeline"
        title="Leakage prevention is the whole ballgame"
        description="Fraud models are trivially easy to fool yourself with. This pipeline enforces a strict one-way flow: understand, split, fit on train, resample train, then score the sealed test set exactly once."
      />

      <Panel>
        <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          {STAGES.map((s, i) => {
            const StageIcon = s.icon;
            const isActive = i === active;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-all",
                    isActive
                      ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_oklch(0.66_0.16_250/0.3)]"
                      : "border-border bg-surface/50 hover:border-cyan/40",
                  )}
                >
                  <StageIcon className={cn("size-4", isActive ? "text-cyan" : "text-muted-foreground")} />
                  <p className="mt-2 font-display text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.short}
                  </p>
                </button>
                {i < STAGES.length - 1 && (
                  <span className="hidden text-muted-foreground lg:block">→</span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-border bg-surface/50 p-5">
            <div className="flex items-center gap-2 text-cyan">
              <Icon className="size-4" />
              <span className="font-mono text-xs uppercase tracking-wider">{stage.short}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{stage.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
            <div className="mt-4 rounded-lg border border-success/30 bg-success/5 p-3 text-xs text-success">
              <ShieldCheck className="mb-1 inline size-3.5" /> {stage.guard}
            </div>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-[oklch(0.14_0.02_264)] p-5 font-mono text-xs leading-relaxed text-foreground">
            <code>{stage.code}</code>
          </pre>
        </div>
      </Panel>

      <Panel
        title="Leakage prevention rules"
        subtitle="Four ways to ruin a fraud benchmark, and three habits that protect it."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {RULES.map((r) => (
            <div
              key={r.title}
              className={cn(
                "rounded-xl border p-4",
                r.ok ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5",
              )}
            >
              <div className="flex items-center gap-2">
                {r.ok ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <X className="size-4 text-danger" />
                )}
                <p className="font-display text-sm font-semibold text-foreground">{r.title}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Split integrity check" subtitle="Prevalence is identical across partitions by construction.">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Train rows", value: "472,432", sub: "16,531 fraud · 3.50%" },
            { label: "Test rows", value: "118,108", sub: "4,132 fraud · 3.50%" },
            { label: "scale_pos_weight", value: "27.58", sub: "negatives ÷ positives (train)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface/50 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone="cyan">random_state = 42</Pill>
          <Pill tone="cyan">stratify = y</Pill>
          <Pill tone="success">test touched exactly once</Pill>
        </div>
      </Panel>
    </div>
  );
}
