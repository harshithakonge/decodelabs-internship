import { createFileRoute } from "@tanstack/react-router";
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader, Panel, Pill, chartTheme } from "@/components/site/bits";
import {
  amountBuckets,
  amountLogDistribution,
  amountStats,
  cardCategory,
  hourlyFraud,
  identitySplit,
  missingValues,
  productCD,
  targetDistribution,
} from "@/lib/fraud-data";

export const Route = createFileRoute("/eda")({
  head: () => ({
    meta: [
      { title: "Exploratory Data Analysis — IEEE-CIS Fraud Detection" },
      {
        name: "description",
        content:
          "Target balance, transaction amount distributions, temporal fraud spikes, identity availability, ProductCD/card breakdowns and missing-value profiling.",
      },
      { property: "og:title", content: "Exploratory Data Analysis — IEEE-CIS Fraud Detection" },
      {
        property: "og:description",
        content:
          "Interactive EDA charts covering amount, time, identity, product category and missingness signals in the IEEE-CIS dataset.",
      },
    ],
  }),
  component: EdaPage,
});

function EdaPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Exploratory Data Analysis"
        title="What the IEEE-CIS data actually says about fraud"
        description="Every chart below is built from the merged train_transaction / train_identity frame (590,540 rows, 434 columns). These distributions drive the feature engineering and the imbalance strategy."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="1. Target distribution" subtitle="3.5% fraud vs 96.5% legitimate — a 1 : 27.6 ratio.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetDistribution} margin={{ top: 8, right: 8, left: 6, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis scale="log" domain={[100, "auto"]} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => v.toLocaleString()} />
                <Bar dataKey="value" name="Transactions (log scale)" radius={[6, 6, 0, 0]}>
                  <Cell fill="oklch(0.66 0.16 250)" />
                  <Cell fill="oklch(0.63 0.22 25)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A log y-axis is required just to make the fraud bar visible — the clearest possible argument
            against optimising raw accuracy.
          </p>
        </Panel>

        <Panel title="2a. log1p(TransactionAmt) density" subtitle="Fraud sits to the right of the legitimate mass.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={amountLogDistribution} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="logAmt" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="legit" name="Legitimate" stroke="oklch(0.66 0.16 250)" fill="oklch(0.66 0.16 250)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="fraud" name="Fraud (scaled)" stroke="oklch(0.63 0.22 25)" fill="oklch(0.63 0.22 25)" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Panel title="2b. Fraud rate by amount band" subtitle="Fraud rate climbs monotonically with ticket size.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={amountBuckets} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="bucket" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="fraudRate" name="Fraud rate %" radius={[6, 6, 0, 0]} fill="oklch(0.77 0.16 70)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Amount statistics" subtitle="Outlier behaviour differs sharply by class.">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Metric</th>
                <th className="py-2 text-right">Legit</th>
                <th className="py-2 text-right">Fraud</th>
              </tr>
            </thead>
            <tbody>
              {amountStats.map((r) => (
                <tr key={r.metric} className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-muted-foreground">{r.metric}</td>
                  <td className="py-2 text-right font-mono text-foreground">{r.legit}</td>
                  <td className="py-2 text-right font-mono text-danger">{r.fraud}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            Raw amounts are extremely right-skewed, so the model uses{" "}
            <span className="font-mono text-foreground">log1p(TransactionAmt)</span> plus a round-amount flag.
          </p>
        </Panel>
      </div>

      <Panel
        title="3. Temporal patterns over TransactionDT"
        subtitle="TransactionDT is a second offset from a fixed reference; hour-of-day and day-index are derived from it."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyFraud} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: chartTheme.axis, fontSize: 11 }} interval={1} />
              <YAxis yAxisId="l" unit="%" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
              <YAxis yAxisId="r" orientation="right" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
              <Tooltip contentStyle={chartTheme.tooltip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="l" type="monotone" dataKey="fraudRate" name="Fraud rate %" stroke="oklch(0.63 0.22 25)" strokeWidth={2.5} dot={false} />
              <Line yAxisId="r" type="monotone" dataKey="volume" name="Transaction volume" stroke="oklch(0.79 0.14 200)" strokeWidth={1.6} dot={false} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Volume peaks mid-afternoon while the fraud <em>rate</em> peaks around 04:00 (≈5.5% vs ≈2.1% at
          midday) — attackers operate when review desks are thin.
        </p>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="4. Identity availability (has_identity)" subtitle="Only 144,233 of 590,540 transactions join to train_identity.csv.">
          <div className="space-y-4">
            {identitySplit.map((g) => (
              <div key={g.group} className="rounded-xl border border-border bg-surface/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">{g.group}</span>
                  <Pill tone={g.fraudRate > 5 ? "danger" : "cyan"}>{g.fraudRate.toFixed(1)}% fraud</Pill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.transactions.toLocaleString()} transactions
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={g.fraudRate > 5 ? "h-full bg-danger" : "h-full bg-cyan"}
                    style={{ width: `${(g.fraudRate / 12) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              The presence of an identity record is itself a 5× signal, so a binary{" "}
              <span className="font-mono text-foreground">has_identity</span> feature is created before any
              imputation.
            </p>
          </div>
        </Panel>

        <Panel title="5. ProductCD & card category" subtitle="Fraud concentrates in digital/prepaid products and credit cards.">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productCD} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={chartTheme.grid} horizontal={false} />
                <XAxis type="number" unit="%" tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis type="category" dataKey="code" width={24} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="fraudRate" name="Fraud rate %" radius={[0, 6, 6, 0]}>
                  {productCD.map((p) => (
                    <Cell key={p.code} fill={p.fraudRate > 5 ? "oklch(0.63 0.22 25)" : "oklch(0.66 0.16 250)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-1.5">
            {cardCategory.map((c) => (
              <div key={c.name} className="flex items-center gap-3 text-xs">
                <span className="w-40 truncate font-mono text-muted-foreground">{c.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={c.fraudRate > 6 ? "h-full bg-danger" : "h-full bg-primary"}
                    style={{ width: `${(c.fraudRate / 10) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-foreground">{c.fraudRate}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="6. Missing value profiling & cleaning strategy"
        subtitle="Columns above 90% missingness are dropped; the rest are imputed with an explicit missing-indicator."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Column</th>
                <th className="py-2">Missing</th>
                <th className="py-2">Handling</th>
              </tr>
            </thead>
            <tbody>
              {missingValues.map((m) => (
                <tr key={m.column} className="border-b border-border/50 last:border-0">
                  <td className="py-2 font-mono text-foreground">{m.column}</td>
                  <td className="w-1/3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-36 overflow-hidden rounded-full bg-muted">
                        <div
                          className={m.missing > 90 ? "h-full bg-danger" : "h-full bg-warning"}
                          style={{ width: `${m.missing}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{m.missing}%</span>
                    </div>
                  </td>
                  <td className="py-2 text-muted-foreground">{m.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Missingness is not random in this dataset — the fact that a field is absent is predictive, so every
          imputed column keeps an <span className="font-mono text-foreground">_is_missing</span> companion
          feature. XGBoost additionally consumes NaNs natively.
        </p>
      </Panel>
    </div>
  );
}
