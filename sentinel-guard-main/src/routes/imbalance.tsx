import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { PageHeader, Panel, Pill, chartTheme } from "@/components/site/bits";
import { imbalanceExperiments } from "@/lib/fraud-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/imbalance")({
  head: () => ({
    meta: [
      { title: "Class Imbalance Experiments — Fraud Detection Benchmark" },
      {
        name: "description",
        content:
          "Baseline vs class weighting vs random undersampling vs SMOTE on a 3.5% positive class, compared by precision, recall, F1 and PR-AUC.",
      },
      { property: "og:title", content: "Class Imbalance Experiments — Fraud Detection Benchmark" },
      {
        property: "og:description",
        content:
          "Four imbalance strategies benchmarked on the IEEE-CIS dataset, with the precision-recall trade-off made explicit.",
      },
    ],
  }),
  component: ImbalancePage,
});

const chartData = imbalanceExperiments.map((e) => ({
  name: "Exp " + e.id,
  precision: e.precision,
  recall: e.recall,
  f1: e.f1,
  prAuc: e.prAuc,
}));

const scatterData = imbalanceExperiments.map((e) => ({
  x: e.recall,
  y: e.precision,
  z: e.f1 * 100,
  name: "Exp " + e.id,
}));

const radarData = ["precision", "recall", "f1", "prAuc", "rocAuc"].map((metric) => {
  const row: Record<string, number | string> = { metric: metric.toUpperCase() };
  imbalanceExperiments.forEach((e) => {
    row["Exp " + e.id] = (e as unknown as Record<string, number>)[metric] ?? 0;
  });
  return row;
});

function ImbalancePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Class Imbalance Experiments"
        title="Four ways to handle a 1 : 27.6 class ratio"
        description="All four experiments use the same XGBoost configuration, the same stratified split and the same sealed test set. Only the treatment of the training partition changes."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {imbalanceExperiments.map((e) => (
          <div
            key={e.id}
            className={cn(
              "card-glow rounded-2xl border p-5",
              e.best ? "border-success/50 bg-success/5" : "border-border bg-card/80",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                Experiment {e.id}
              </span>
              {e.best && <Pill tone="success">Selected</Pill>}
            </div>
            <h3 className="mt-2 font-display text-base font-semibold text-foreground">{e.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{e.detail}</p>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ["Precision", e.precision],
                ["Recall", e.recall],
                ["F1", e.f1],
                ["PR-AUC", e.prAuc],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="flex justify-between font-mono text-xs">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-foreground">{(value as number).toFixed(3)}</dd>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", e.best ? "bg-success" : "bg-primary")}
                      style={{ width: `${(value as number) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <Panel title="Benchmark table" subtitle="All metrics measured on the untouched 118,108-row test split at threshold 0.42.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Experiment</th>
                <th className="py-2 text-right">Precision</th>
                <th className="py-2 text-right">Recall</th>
                <th className="py-2 text-right">F1</th>
                <th className="py-2 text-right">PR-AUC</th>
                <th className="py-2 text-right">ROC-AUC</th>
                <th className="py-2 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {imbalanceExperiments.map((e) => (
                <tr
                  key={e.id}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    e.best && "bg-success/5",
                  )}
                >
                  <td className="py-3">
                    <span className="font-display text-sm text-foreground">
                      {e.id} — {e.name}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-foreground">{e.precision.toFixed(3)}</td>
                  <td className="py-3 text-right font-mono text-foreground">{e.recall.toFixed(3)}</td>
                  <td className={cn("py-3 text-right font-mono", e.best ? "text-success" : "text-foreground")}>
                    {e.f1.toFixed(3)}
                  </td>
                  <td className={cn("py-3 text-right font-mono", e.best ? "text-success" : "text-foreground")}>
                    {e.prAuc.toFixed(3)}
                  </td>
                  <td className="py-3 text-right font-mono text-muted-foreground">{e.rocAuc.toFixed(3)}</td>
                  <td className="py-3 text-right font-mono text-muted-foreground">
                    {(e.accuracy * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Note how accuracy barely moves across all four rows while F1 swings from 0.559 to 0.782 — another
          demonstration that accuracy carries no information on this problem.
        </p>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Precision / recall / F1 by experiment" subtitle="Undersampling buys recall and destroys precision.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis domain={[0, 1]} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="precision" name="Precision" fill="oklch(0.79 0.14 200)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" name="Recall" fill="oklch(0.63 0.22 25)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1" name="F1" fill="oklch(0.74 0.15 160)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Precision–recall trade-off map" subtitle="Bubble size encodes F1. Top-right is better.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: -14, bottom: 4 }}>
                <CartesianGrid stroke={chartTheme.grid} />
                <XAxis type="number" dataKey="x" name="Recall" domain={[0.3, 1]} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="Precision" domain={[0.3, 1]} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <ZAxis type="number" dataKey="z" range={[120, 600]} />
                <Tooltip contentStyle={chartTheme.tooltip} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={scatterData} fill="oklch(0.66 0.16 250)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Experiment B (class weighting) dominates: it reaches undersampling-like recall without paying the
            precision penalty, and needs no synthetic data.
          </p>
        </Panel>
      </div>

      <Panel title="Metric profile across all five measures" subtitle="Radar view of the same four experiments.">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke={chartTheme.grid} />
              <PolarAngleAxis dataKey="metric" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
              <Tooltip contentStyle={chartTheme.tooltip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Radar name="Exp A" dataKey="Exp A" stroke="oklch(0.7 0.024 258)" fill="oklch(0.7 0.024 258)" fillOpacity={0.08} />
              <Radar name="Exp B" dataKey="Exp B" stroke="oklch(0.74 0.15 160)" fill="oklch(0.74 0.15 160)" fillOpacity={0.22} />
              <Radar name="Exp C" dataKey="Exp C" stroke="oklch(0.63 0.22 25)" fill="oklch(0.63 0.22 25)" fillOpacity={0.1} />
              <Radar name="Exp D" dataKey="Exp D" stroke="oklch(0.79 0.14 200)" fill="oklch(0.79 0.14 200)" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
