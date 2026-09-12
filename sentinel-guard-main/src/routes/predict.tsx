import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";

import { PageHeader, Panel, Pill } from "@/components/site/bits";
import { presets, scoreTransaction, type TxInput } from "@/lib/predictor";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Live Transaction Prediction Studio — Fraud Detection" },
      {
        name: "description",
        content:
          "Score realistic transactions against the benchmarked fraud model and see the calibrated probability, risk tier and contributing risk factors.",
      },
      { property: "og:title", content: "Live Transaction Prediction Studio" },
      {
        property: "og:description",
        content:
          "Interactive educational fraud scoring with presets for normal purchases, high-velocity digital orders, foreign IP cards and midnight wires.",
      },
    ],
  }),
  component: PredictPage,
});

const PRODUCTS = ["W", "C", "R", "H", "S"];
const CARDS = ["visa", "mastercard", "american express", "discover"];
const EMAILS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com", "mail.com", "anonymous.com"];
const DEVICES = ["desktop", "mobile"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-surface/60 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary/60";

function PredictPage() {
  const [tx, setTx] = useState<TxInput>(presets[0]!.tx);
  const [activePreset, setActivePreset] = useState(presets[0]!.id);

  const result = useMemo(() => scoreTransaction(tx), [tx]);
  const pct = result.probability * 100;

  const tierStyle = {
    "LOW RISK": { ring: "border-success/50 bg-success/5", text: "text-success", Icon: ShieldCheck },
    SUSPICIOUS: { ring: "border-warning/50 bg-warning/5", text: "text-warning", Icon: TriangleAlert },
    "HIGH RISK": { ring: "border-danger/50 bg-danger/5", text: "text-danger", Icon: ShieldAlert },
  }[result.tier];
  const TierIcon = tierStyle.Icon;

  const set = <K extends keyof TxInput>(key: K, value: TxInput[K]) =>
    setTx((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Live Prediction Studio"
        title="Score a transaction and read the reasoning"
        description="The scoring function mirrors the trained XGBoost decision surface using the dataset's strongest published signals: amount, product code, velocity counts, distance, timing, identity availability and email domain."
      />

      <Panel title="Preset transactions" subtitle="Start from a realistic scenario, then edit any field.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setTx(p.tx);
                setActivePreset(p.id);
              }}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                activePreset === p.id
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-surface/50 hover:border-cyan/40",
              )}
            >
              <p className="font-display text-sm font-semibold text-foreground">{p.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.blurb}</p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel title="Transaction features" subtitle="Fields mirror the IEEE-CIS schema.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="TransactionAmt ($)">
              <input
                type="number"
                className={inputClass}
                value={tx.TransactionAmt}
                min={0}
                step="0.01"
                onChange={(e) => set("TransactionAmt", Number(e.target.value))}
              />
            </Field>
            <Field label="ProductCD">
              <select className={inputClass} value={tx.ProductCD} onChange={(e) => set("ProductCD", e.target.value)}>
                {PRODUCTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="card1">
              <input type="number" className={inputClass} value={tx.card1} onChange={(e) => set("card1", Number(e.target.value))} />
            </Field>
            <Field label="card2">
              <input type="number" className={inputClass} value={tx.card2} onChange={(e) => set("card2", Number(e.target.value))} />
            </Field>
            <Field label="card3">
              <input type="number" className={inputClass} value={tx.card3} onChange={(e) => set("card3", Number(e.target.value))} />
            </Field>
            <Field label="card4 (network)">
              <select className={inputClass} value={tx.card4} onChange={(e) => set("card4", e.target.value)}>
                {CARDS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="addr1">
              <input type="number" className={inputClass} value={tx.addr1} onChange={(e) => set("addr1", Number(e.target.value))} />
            </Field>
            <Field label="dist1">
              <input type="number" className={inputClass} value={tx.dist1} onChange={(e) => set("dist1", Number(e.target.value))} />
            </Field>
            <Field label="P_emaildomain">
              <select className={inputClass} value={tx.P_emaildomain} onChange={(e) => set("P_emaildomain", e.target.value)}>
                {EMAILS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="DeviceType">
              <select className={inputClass} value={tx.DeviceType} onChange={(e) => set("DeviceType", e.target.value)}>
                {DEVICES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={`C1 — card count (${tx.C1})`}>
              <input type="range" min={0} max={60} value={tx.C1} onChange={(e) => set("C1", Number(e.target.value))} className="w-full accent-[oklch(0.66_0.16_250)]" />
            </Field>
            <Field label={`C13 — address count (${tx.C13})`}>
              <input type="range" min={0} max={60} value={tx.C13} onChange={(e) => set("C13", Number(e.target.value))} className="w-full accent-[oklch(0.66_0.16_250)]" />
            </Field>
            <Field label={`C14 — device count (${tx.C14})`}>
              <input type="range" min={0} max={60} value={tx.C14} onChange={(e) => set("C14", Number(e.target.value))} className="w-full accent-[oklch(0.66_0.16_250)]" />
            </Field>
            <Field label={`Hour of day (${String(tx.hour).padStart(2, "0")}:00)`}>
              <input type="range" min={0} max={23} value={tx.hour} onChange={(e) => set("hour", Number(e.target.value))} className="w-full accent-[oklch(0.66_0.16_250)]" />
            </Field>
            <Field label="Identity record attached (has_identity)">
              <button
                onClick={() => set("hasIdentity", !tx.hasIdentity)}
                className={cn(
                  "rounded-lg border px-3 py-2 font-mono text-xs transition-colors",
                  tx.hasIdentity
                    ? "border-danger/50 bg-danger/10 text-danger"
                    : "border-border bg-surface/60 text-muted-foreground",
                )}
              >
                has_identity = {tx.hasIdentity ? 1 : 0}
              </button>
            </Field>
          </div>
        </Panel>

        <div className="space-y-6">
          <div className={cn("card-glow rounded-2xl border p-6", tierStyle.ring)}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Model decision
              </span>
              <Pill tone="cyan">XGBoost · threshold 0.42</Pill>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <TierIcon className={cn("size-10", tierStyle.text)} />
              <div>
                <p className={cn("font-display text-3xl font-semibold", tierStyle.text)}>{result.tier}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Predicted class:{" "}
                  <span className={result.probability >= 0.42 ? "text-danger" : "text-success"}>
                    {result.probability >= 0.42 ? "FRAUDULENT" : "LEGITIMATE"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Calibrated fraud probability
                </span>
                <span className={cn("font-display text-3xl font-semibold tabular-nums", tierStyle.text)}>
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    result.tier === "HIGH RISK" ? "bg-danger" : result.tier === "SUSPICIOUS" ? "bg-warning" : "bg-success",
                  )}
                  style={{ width: `${Math.max(2, pct)}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>0% · low</span>
                <span>30% · suspicious</span>
                <span>60% · high</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <Panel title="Key contributing risk factors" subtitle="Ranked by contribution to the log-odds score.">
            {result.factors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No elevated risk signals — the profile matches typical legitimate activity.
              </p>
            ) : (
              <ul className="space-y-3">
                {result.factors.map((f) => (
                  <li key={f.label} className="rounded-xl border border-border bg-surface/50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">{f.label}</span>
                      <span className="font-mono text-xs text-warning">+{f.weight.toFixed(2)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-warning"
                        style={{ width: `${Math.min(100, (f.weight / 2) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              <Pill tone="warning">Educational ML Prototype — Benchmarked on IEEE-CIS Dataset</Pill>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
