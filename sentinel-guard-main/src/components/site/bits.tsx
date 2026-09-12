import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "card-glow rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur sm:p-6",
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "danger" | "success" | "cyan";
}) {
  const toneClass = {
    default: "text-foreground",
    danger: "text-danger",
    success: "text-success",
    cyan: "text-cyan",
  }[tone];
  return (
    <div className="card-glow rounded-xl border border-border/70 bg-card/80 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={cn("mt-2 font-display text-2xl font-semibold tabular-nums sm:text-3xl", toneClass)}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "danger" | "success" | "warning" | "cyan";
}) {
  const map = {
    muted: "border-border bg-muted/60 text-muted-foreground",
    danger: "border-danger/40 bg-danger/10 text-danger",
    success: "border-success/40 bg-success/10 text-success",
    warning: "border-warning/40 bg-warning/10 text-warning",
    cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider",
        map[tone],
      )}
    >
      {children}
    </span>
  );
}

export const chartTheme = {
  grid: "oklch(1 0 0 / 8%)",
  axis: "oklch(0.7 0.024 258)",
  tooltip: {
    backgroundColor: "oklch(0.21 0.024 264)",
    border: "1px solid oklch(1 0 0 / 12%)",
    borderRadius: 12,
    color: "oklch(0.98 0.002 250)",
    fontSize: 12,
  } as const,
};
