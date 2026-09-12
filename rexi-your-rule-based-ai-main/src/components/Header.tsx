import type { LanguageCode, UiStrings } from "@/chatbot/languages";
import { LanguageSelector } from "./LanguageSelector";

type Props = {
  ui: UiStrings;
  language: LanguageCode;
  onLanguageChange: (code: LanguageCode) => void;
  onOpenSidebar: () => void;
};

export function Header({ ui, language, onLanguageChange, onOpenSidebar }: Props) {
  return (
    <header className="flex items-center gap-3 border-b border-panel-border px-4 py-3 md:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label={ui.menu}
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-panel-border text-foreground transition-colors hover:bg-background md:hidden"
      >
        ☰
      </button>
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-lg shadow-soft">
        🤖
      </span>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-foreground">Rexi</h1>
        <p className="truncate text-xs text-muted-foreground">{ui.online}</p>
      </div>
      <LanguageSelector value={language} onChange={onLanguageChange} label={ui.language} />
    </header>
  );
}
