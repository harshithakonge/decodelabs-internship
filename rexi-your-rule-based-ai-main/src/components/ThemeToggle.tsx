import type { Theme } from "@/chatbot/types";

type Props = {
  theme: Theme;
  onToggle: () => void;
  darkLabel: string;
  lightLabel: string;
};

export function ThemeToggle({ theme, onToggle, darkLabel, lightLabel }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full rounded-xl border border-panel-border bg-background/60 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
    >
      {theme === "light" ? darkLabel : lightLabel}
    </button>
  );
}
