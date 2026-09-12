import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowRight, Gauge, TrendingUp } from "lucide-react";

import { PageHeader, Panel, Pill, StatCard, chartTheme } from "@/components/site/bits";
import { DATASET, dailyTrend, hourlyFraud, modelList, targetDistribution } from "@/lib/fraud-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fraud Detection Overview — IEEE-CIS ML Benchmark" },
      {
        name: "description",
        content:
          "590,540 transactions analysed, 20,663 fraudulent. XGBoost reaches 0.864 PR-AUC and 0.782 F1 on the IEEE-CIS Fraud Detection dataset.",
      },
      { property: "og:title", content: "Fraud Detection Overview — IEEE-CIS ML Benchmark" },
      {
        property: "og:description",
        content:
          "Dashboard of fraud rate, activity trends and champion model metrics for an IEEE-CIS fraud detection project.",
      },
    ],
  }),
  component: Overview,
});

const PIE_COLORS = ["oklch(0.66 0.16 250)", "oklch(0.63 0.22 25)"];

function Overview() {
  return (
    <div className="space-y-8">
      <div className="grid-noise -mx-4 rounded-3xl px-4 py-10 sm:-mx-6 sm:px-8">
        <PageHeader
          eyebrow="Overview Dashboard"
          title="Intelligent Fraud Detection Using Machine Learning"
          description="A leakage-safe benchmark on the IEEE-CIS Fraud Detection dataset (train_transaction.csv + train_identity.csv). Logistic Regression, Random Forest and XGBoost are compared on precision-recall metrics, not accuracy."
        />
        <div className="flex flex-wrap gap-2">
          <Pill tone="cyan">590,540 transactions</Pill>
          <Pill tone="danger">3.50% fraud rate</Pill>
          <Pill tone="success">Champion: XGBoost · PR-AUC 0.864</Pill>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total analyzed" value="590,540" hint="Merged transaction + identity rows" />
        <StatCard label="Fraudulent" value="20,663" hint="isFraud = 1" tone="danger" />
        <StatCard label="Legitimate" value="569,877" hint="isFraud = 0" tone="cyan" />
        <StatCard label="Fraud rate" value="3.50%" hint="Severe class imbalance (1 : 27.6)" />
        <StatCard label="Best model PR-AUC" value="0.864" hint="XGBoost + class weighting" tone="success" />
        <StatCard label="Best F1-score" value="0.782" hint="Threshold 0.42" tone="success" />
        <StatCard label="Recall" value="0.765" hint="3,161 of 4,132 test frauds caught" tone="success" />
        <StatCard label="Precision" value="0.801" hint="785 false alarms on the test split" />
      </div>

      <Panel
        title="Why accuracy is the wrong metric here"
        subtitle="The single most important framing for an imbalanced fraud problem."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
            <div className="flex items-center gap-2 text-danger">
              <AlertTriangle className="size-4" />
              <span className="font-mono text-xs uppercase tracking-wider">The accuracy trap</span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold text-foreground">96.50%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              accuracy from a model that predicts <span className="font-mono">0</span> for every single
              transaction — and catches <span className="text-danger">zero</span> of the 20,663 frauds.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface/60 p-4">
            <div className="flex items-center gap-2 text-cyan">
              <Gauge className="size-4" />
              <span className="font-mono text-xs uppercase tracking-wider">What we optimise</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="text-foreground">PR-AUC</span> — the only ranking metric that stays honest
                at a 3.5% positive rate.
              </li>
              <li>
                <span className="text-foreground">Recall</span> — the share of real fraud intercepted.
              </li>
              <li>
                <span className="text-foreground">F1</span> — balance against analyst review capacity.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface/60 p-4">
            <div className="flex items-center gap-2 text-warning">
              <TrendingUp className="size-4" />
              <span className="font-mono text-xs uppercase tracking-wider">Business cost</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              A missed fraud costs the full transaction value plus chargeback fees; a false alarm costs a few
              minutes of manual review. That asymmetry is why the decision threshold is tuned to{" "}
              <span className="font-mono text-foreground">0.42</span> rather than left at 0.50.
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Daily activity and fraud rate" subtitle="Transaction volume with the fraud rate overlaid across a 30-day window.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.66 0.16 250)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.66 0.16 250)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: chartTheme.axis, fontSize: 11 }} interval={3} />
                <YAxis yAxisId="l" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis yAxisId="r" orientation="right" unit="%" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Area yAxisId="l" type="monotone" dataKey="volume" name="Transactions" stroke="oklch(0.66 0.16 250)" fill="url(#vol)" />
                <Line yAxisId="r" type="monotone" dataKey="fraudRate" name="Fraud rate %" stroke="oklch(0.63 0.22 25)" strokeWidth={2} dot={false} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Fraud distribution" subtitle="20,663 fraudulent vs 569,877 legitimate transactions.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={targetDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {targetDistribution.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => v.toLocaleString()} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Fraud rate by hour of day" subtitle="Derived from TransactionDT — fraud peaks between 02:00 and 05:00.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyFraud} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: chartTheme.axis, fontSize: 10 }} interval={2} />
                <YAxis unit="%" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="fraudRate" name="Fraud rate %" radius={[4, 4, 0, 0]}>
                  {hourlyFraud.map((d) => (
                    <Cell
                      key={d.hour}
                      fill={d.fraudRate > 4 ? "oklch(0.63 0.22 25)" : "oklch(0.66 0.16 250)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Model leaderboard" subtitle="Evaluated on the untouched stratified 20% test split.">
          <div className="space-y-3">
            {modelList.map((m) => (
              <div
                key={m.key}
                className="rounded-xl border border-border bg-surface/50 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.tagline}</p>
                  </div>
                  {m.key === "xgb" ? <Pill tone="success">Champion</Pill> : <Pill>Benchmark</Pill>}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 font-mono text-xs">
                  {[
                    ["PR-AUC", m.prAuc],
                    ["Recall", m.recall],
                    ["Precision", m.precision],
                    ["F1", m.f1],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <p className="text-muted-foreground">{label}</p>
                      <p className="text-sm text-foreground">{(value as number).toFixed(3)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${m.prAuc * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <Link
              to="/models"
              className="inline-flex items-center gap-2 text-sm text-cyan transition-colors hover:text-foreground"
            >
              Open full model comparison <ArrowRight className="size-4" />
            </Link>
          </div>
        </Panel>
      </div>

      <Panel title="Explore the project" subtitle="Each stage of the workflow has its own view.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/eda", title: "Exploratory data analysis", body: "Amount, temporal, identity, product and missingness insights." },
            { to: "/pipeline", title: "Preprocessing & leakage prevention", body: "Split first, fit on train only, evaluate once." },
            { to: "/imbalance", title: "Class imbalance experiments", body: "Baseline vs class weights vs undersampling vs SMOTE." },
            { to: "/models", title: "Model benchmark", body: "PR/ROC curves, confusion matrices, threshold tuning." },
            { to: "/predict", title: "Live prediction studio", body: "Score realistic transactions and read the risk factors." },
            { to: "/code", title: "Codebase & submission hub", body: "Full modular Python project ready for GitHub." },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-xl border border-border bg-surface/50 p-4 transition-colors hover:border-cyan/50 hover:bg-surface"
            >
              <p className="font-display text-sm font-semibold text-foreground">{c.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-cyan opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="size-3" />
              </span>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
