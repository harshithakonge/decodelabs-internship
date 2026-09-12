import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader, Panel, Pill, chartTheme } from "@/components/site/bits";
import {
  featureImportance,
  modelList,
  models,
  prCurves,
  rocCurves,
  thresholdMetrics,
  thresholdSweep,
  type ModelKey,
} from "@/lib/fraud-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "Model Comparison — Logistic Regression vs Random Forest vs XGBoost" },
      {
        name: "description",
        content:
          "Side-by-side benchmark with precision-recall curves, ROC curves, confusion matrices and an interactive decision-threshold slider.",
      },
      { property: "og:title", content: "Model Comparison — Fraud Detection Benchmark" },
      {
        property: "og:description",
        content:
          "XGBoost reaches 0.864 PR-AUC against 0.795 for Random Forest and 0.521 for Logistic Regression on the IEEE-CIS test split.",
      },
    ],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  const [selected, setSelected] = useState<ModelKey>("xgb");
  const [threshold, setThreshold] = useState(0.42);
  const m = models[selected];
  const tuned = thresholdMetrics(selected, threshold);
  const sweep = thresholdSweep(selected);

  const cells = [
    { label: "True Negatives", value: tuned.tn, tone: "text-cyan", desc: "Legit correctly cleared" },
    { label: "False Positives", value: tuned.fp, tone: "text-warning", desc: "Legit flagged for review" },
    { label: "False Negatives", value: tuned.fn, tone: "text-danger", desc: "Fraud that slipped through" },
    { label: "True Positives", value: tuned.tp, tone: "text-success", desc: "Fraud intercepted" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Model Comparison Benchmark"
        title="Three models, one sealed test set"
        description="118,108 test transactions containing 4,132 real frauds. Every model is trained with class weighting on the training partition only."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {modelList.map((model) => (
          <button
            key={model.key}
            onClick={() => setSelected(model.key)}
            className={cn(
              "card-glow rounded-2xl border p-5 text-left transition-all",
              selected === model.key
                ? "border-primary/60 bg-primary/10"
                : "border-border bg-card/80 hover:border-cyan/40",
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-foreground">{model.name}</h3>
              {model.key === "xgb" && <Pill tone="success">Champion</Pill>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{model.tagline}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
              {[
                ["PR-AUC", model.prAuc],
                ["ROC-AUC", model.rocAuc],
                ["Recall", model.recall],
                ["Precision", model.precision],
                ["F1", model.f1],
                ["Accuracy", model.accuracy],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground">{(value as number).toFixed(3)}</span>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              {model.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="text-cyan">·</span>
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              train time {model.trainTime}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Precision–Recall curves" subtitle="The decisive comparison on a 3.5% positive class.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prCurves} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis dataKey="recall" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis domain={[0, 1]} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="xgb" name="XGBoost (0.864)" stroke="oklch(0.74 0.15 160)" strokeWidth={2.4} dot={false} />
                <Line type="monotone" dataKey="rf" name="Random Forest (0.795)" stroke="oklch(0.79 0.14 200)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="logreg" name="Logistic Regression (0.521)" stroke="oklch(0.7 0.024 258)" strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="ROC curves" subtitle="Optimistic by design on imbalanced data — shown for completeness.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurves} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis dataKey="fpr" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis domain={[0, 1]} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="xgb" name="XGBoost (0.963)" stroke="oklch(0.74 0.15 160)" strokeWidth={2.4} dot={false} />
                <Line type="monotone" dataKey="rf" name="Random Forest (0.951)" stroke="oklch(0.79 0.14 200)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="logreg" name="Logistic Regression (0.872)" stroke="oklch(0.7 0.024 258)" strokeWidth={1.8} dot={false} />
                <Line type="monotone" dataKey="baseline" name="Random" stroke="oklch(0.63 0.22 25)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title={`Threshold tuning — ${m.name}`}
        subtitle="Move the decision threshold to trade fraud recall against false alarms. The confusion matrix updates live."
      >
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="h-2 w-full max-w-xl cursor-pointer appearance-none rounded-full bg-muted accent-[oklch(0.66_0.16_250)]"
            aria-label="Decision threshold"
          />
          <span className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-sm text-foreground">
            threshold = {threshold.toFixed(2)}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="grid grid-cols-2 gap-3">
              {cells.map((c) => (
                <div key={c.label} className="rounded-xl border border-border bg-surface/50 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </p>
                  <p className={cn("mt-1.5 font-display text-2xl font-semibold tabular-nums", c.tone)}>
                    {c.value.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 rounded-xl border border-border bg-surface/50 p-4 font-mono text-xs">
              {[
                ["Precision", tuned.precision],
                ["Recall", tuned.recall],
                ["F1", tuned.f1],
                ["Accuracy", tuned.accuracy],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-muted-foreground">{label}</p>
                  <p className="text-sm text-foreground">{(value as number).toFixed(3)}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              At <span className="font-mono text-foreground">{threshold.toFixed(2)}</span> the model misses{" "}
              <span className="text-danger">{tuned.fn.toLocaleString()}</span> frauds and sends{" "}
              <span className="text-warning">{tuned.fp.toLocaleString()}</span> legitimate transactions to
              manual review.
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sweep} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis dataKey="threshold" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis domain={[0, 1]} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="precision" name="Precision" stroke="oklch(0.79 0.14 200)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="recall" name="Recall" stroke="oklch(0.63 0.22 25)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="f1" name="F1" stroke="oklch(0.74 0.15 160)" strokeWidth={2.4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>

      <Panel title="Top feature importances (XGBoost, gain)" subtitle="Velocity counts, amount and identity availability dominate.">
        <div className="space-y-2">
          {featureImportance.map((f) => (
            <div key={f.feature} className="flex items-center gap-3 text-xs">
              <span className="w-56 truncate font-mono text-muted-foreground">{f.feature}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${f.importance}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-foreground">{f.importance}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
