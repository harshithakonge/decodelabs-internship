import { useCallback, useEffect, useState } from "react";
import { UI, type LanguageCode } from "@/chatbot/languages";
import { getAttachmentResponse, getBotResponse, getErrorResponse } from "@/chatbot/rules";
import type { Attachment, ChatMessage, Theme } from "@/chatbot/types";
import { ChatWindow } from "@/components/ChatWindow";
import { Header } from "@/components/Header";
import { MessageInput } from "@/components/MessageInput";
import { Sidebar } from "@/components/Sidebar";
import {
  STORAGE_KEYS,
  formatTime,
  loadJson,
  makeId,
  readFileAsDataUrl,
  removeKey,
  saveJson,
} from "@/utils/storage";

// Attachments larger than this stay in memory only, so LocalStorage never overflows.
const MAX_PERSIST_BYTES = 1_200_000;

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const ui = UI[language];

  // Load saved preferences and history once, on the client.
  useEffect(() => {
    setLanguage(loadJson<LanguageCode>(STORAGE_KEYS.language, "en"));
    setTheme(loadJson<Theme>(STORAGE_KEYS.theme, "light"));
    setMessages(loadJson<ChatMessage[]>(STORAGE_KEYS.messages, []));
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!ready) return;
    saveJson(STORAGE_KEYS.theme, theme);
    saveJson(STORAGE_KEYS.language, language);
  }, [ready, theme, language]);

  useEffect(() => {
    if (!ready) return;
    const storable = messages.map((message) => {
      if (message.attachment && message.attachment.url.length > MAX_PERSIST_BYTES) {
        const { attachment: _skipped, ...rest } = message;
        return rest;
      }
      return message;
    });
    saveJson(STORAGE_KEYS.messages, storable);
  }, [ready, messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  /** Runs one turn of the conversation through the rule engine. */
  const handleSend = useCallback(
    (text: string, attachment?: Attachment) => {
      try {
        if (!text.trim() && !attachment) return; // Rule 1: empty input

        addMessage({
          id: makeId(),
          sender: "user",
          text,
          time: formatTime(),
          ...(attachment && { attachment }),
        });

        const reply =
          text.trim().length > 0
            ? getBotResponse(text, language).reply
            : getAttachmentResponse(attachment!.kind, language);

        addMessage({ id: makeId(), sender: "rexi", text: reply, time: formatTime() });
      } catch {
        addMessage({
          id: makeId(),
          sender: "rexi",
          text: getErrorResponse(language),
          time: formatTime(),
        });
      }
    },
    [addMessage, language],
  );

  const handlePickFile = useCallback(
    async (file: File, kind: "image" | "video"): Promise<Attachment | null> => {
      try {
        const url = await readFileAsDataUrl(file);
        return { kind, name: file.name, url };
      } catch {
        addMessage({
          id: makeId(),
          sender: "rexi",
          text: getErrorResponse(language),
          time: formatTime(),
        });
        return null;
      }
    },
    [addMessage, language],
  );

  function handleNewChat() {
    setMessages([]);
    setSidebarOpen(false);
  }

  function handleClearHistory() {
    setMessages([]);
    removeKey(STORAGE_KEYS.messages);
    setSidebarOpen(false);
  }

  function handleQuickTopic(question: string) {
    handleSend(question);
    setSidebarOpen(false);
  }

  return (
    <div className="bg-gradient-shell flex h-screen w-full gap-0 p-0 md:gap-4 md:p-4">
      {/* Desktop sidebar */}
      <div className="hidden w-72 shrink-0 md:block lg:w-80">
        <Sidebar
          ui={ui}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
          onNewChat={handleNewChat}
          onClearHistory={handleClearHistory}
          onQuickTopic={handleQuickTopic}
        />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div
            className="absolute inset-0 bg-brand-ink/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="bg-gradient-shell relative z-10 h-full w-[85%] max-w-xs">
            <Sidebar
              ui={ui}
              theme={theme}
              onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
              onNewChat={handleNewChat}
              onClearHistory={handleClearHistory}
              onQuickTopic={handleQuickTopic}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-none border-panel-border bg-panel backdrop-blur-xl md:rounded-3xl md:border md:shadow-soft">
        <Header
          ui={ui}
          language={language}
          onLanguageChange={setLanguage}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <ChatWindow ui={ui} messages={messages} onSuggestion={handleSend} />
        <MessageInput ui={ui} onSend={handleSend} onPickFile={handlePickFile} />
      </main>
    </div>
  );
}
