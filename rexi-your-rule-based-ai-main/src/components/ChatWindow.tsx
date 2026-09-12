import { useEffect, useRef } from "react";
import type { UiStrings } from "@/chatbot/languages";
import type { ChatMessage } from "@/chatbot/types";
import { MessageBubble } from "./MessageBubble";

type Props = {
  ui: UiStrings;
  messages: ChatMessage[];
  onSuggestion: (question: string) => void;
};

const SUGGESTIONS = [
  "What is AI?",
  "What is Machine Learning?",
  "What is Python?",
  "What can you do?",
];

export function ChatWindow({ ui, messages, onSuggestion }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <span className="text-6xl">🤖</span>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">{ui.emptyTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{ui.emptySub}</p>
        <p className="text-sm text-muted-foreground">{ui.emptyHint}</p>
        <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onSuggestion(question)}
              className="rounded-2xl border border-panel-border bg-background/60 px-4 py-3 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-soft"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
