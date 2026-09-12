import type { UiStrings } from "@/chatbot/languages";
import type { Theme } from "@/chatbot/types";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  ui: UiStrings;
  theme: Theme;
  onToggleTheme: () => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  onQuickTopic: (question: string) => void;
};

export function Sidebar({
  ui,
  theme,
  onToggleTheme,
  onNewChat,
  onClearHistory,
  onQuickTopic,
}: Props) {
  const topics = [
    { label: ui.topicAi, question: "What is AI?" },
    { label: ui.topicMl, question: "What is Machine Learning?" },
    { label: ui.topicPython, question: "What is Python?" },
    { label: ui.topicChatbot, question: "What is a chatbot?" },
  ];

  return (
    <aside className="flex h-full w-full flex-col gap-5 overflow-y-auto rounded-none border-panel-border bg-panel p-5 backdrop-blur-xl md:rounded-3xl md:border">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-brand text-xl shadow-soft">
          🤖
        </span>
        <div>
          <p className="text-base font-semibold text-foreground">Rexi</p>
          <p className="text-xs text-muted-foreground">{ui.tagline}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
      >
        + {ui.newChat}
      </button>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {ui.quickTopics}
        </p>
        {topics.map((topic) => (
          <button
            key={topic.question}
            type="button"
            onClick={() => onQuickTopic(topic.question)}
            className="w-full rounded-xl border border-transparent bg-background/50 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-panel-border hover:bg-background"
          >
            {topic.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-panel-border bg-background/50 p-4">
        <p className="text-sm font-semibold text-foreground">{ui.aboutTitle}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{ui.aboutText}</p>
        <p className="mt-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {ui.featuresTitle}
        </p>
        <ul className="mt-2 space-y-1 text-xs text-foreground">
          {ui.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-brand-600">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto space-y-2 pt-2">
        <button
          type="button"
          onClick={onClearHistory}
          className="w-full rounded-xl border border-panel-border bg-background/60 px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          {ui.clearHistory}
        </button>
        <ThemeToggle
          theme={theme}
          onToggle={onToggleTheme}
          darkLabel={ui.darkMode}
          lightLabel={ui.lightMode}
        />
      </div>
    </aside>
  );
}
