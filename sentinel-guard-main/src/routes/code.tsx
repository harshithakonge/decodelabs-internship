import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Download, FileCode2 } from "lucide-react";

import { PageHeader, Panel, Pill } from "@/components/site/bits";
import { codeFiles, projectTree } from "@/lib/project-code";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/code")({
  head: () => ({
    meta: [
      { title: "Codebase & Submission Hub — Fraud Detection Project" },
      {
        name: "description",
        content:
          "Complete modular Python project: data preprocessing, feature engineering, training, evaluation, prediction, Streamlit app, notebook, requirements and README.",
      },
      { property: "og:title", content: "Codebase & Submission Hub — Fraud Detection Project" },
      {
        property: "og:description",
        content:
          "Browse and export the full fraud-detection codebase, structured for GitHub and internship submission.",
      },
    ],
  }),
  component: CodePage,
});

function CodePage() {
  const [active, setActive] = useState(codeFiles[0]!.path);
  const [copied, setCopied] = useState(false);
  const file = codeFiles.find((f) => f.path === active) ?? codeFiles[0]!;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const downloadAll = () => {
    const bundle = codeFiles
      .map((f) => `${"=".repeat(78)}\n# FILE: ${f.path}\n${"=".repeat(78)}\n\n${f.content}`)
      .join("\n\n");
    const blob = new Blob([`# fraud-detection project bundle\n\n${projectTree}\n\n${bundle}`], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fraud-detection-project.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Codebase & Submission Hub"
        title="The complete, modular Python project"
        description="Everything needed for a GitHub repository or internship submission: reproducible pipeline modules, an EDA notebook, a Streamlit app, pinned requirements and full documentation."
      />

      <div className="flex flex-wrap gap-2">
        <Pill tone="cyan">10 files</Pill>
        <Pill tone="cyan">Python 3.11</Pill>
        <Pill tone="success">Leakage-safe pipeline</Pill>
        <button
          onClick={downloadAll}
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:bg-primary/20"
        >
          <Download className="size-3.5" /> Download project bundle
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Directory tree">
            <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
              <code>{projectTree}</code>
            </pre>
          </Panel>

          <Panel title="Files">
            <ul className="space-y-1">
              {codeFiles.map((f) => (
                <li key={f.path}>
                  <button
                    onClick={() => setActive(f.path)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors",
                      active === f.path
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <FileCode2 className="size-3.5 shrink-0 text-cyan" />
                    <span className="truncate">{f.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title={file.path}
          subtitle={`${file.content.split("\n").length} lines · ${file.lang}`}
          action={
            <button
              onClick={() => copy(file.content)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-cyan/50"
            >
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy code"}
            </button>
          }
        >
          <pre className="max-h-[70vh] overflow-auto rounded-xl border border-border bg-[oklch(0.14_0.02_264)] p-5 font-mono text-[12px] leading-relaxed text-foreground">
            <code>{file.content}</code>
          </pre>
        </Panel>
      </div>
    </div>
  );
}
