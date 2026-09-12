import { useEffect, useRef, useState } from "react";
import type { UiStrings } from "@/chatbot/languages";
import type { Attachment } from "@/chatbot/types";

type Props = {
  ui: UiStrings;
  onSend: (text: string, attachment?: Attachment) => void;
  onPickFile: (file: File, kind: "image" | "video") => Promise<Attachment | null>;
};

export function MessageInput({ ui, onSend, onPickFile }: Props) {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState<Attachment | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit() {
    const trimmed = text.trim();
    // Empty message prevention: need either text or an attachment.
    if (!trimmed && !pending) return;
    onSend(trimmed, pending ?? undefined);
    setText("");
    setPending(null);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video") {
    const file = event.target.files?.[0];
    event.target.value = "";
    setMenuOpen(false);
    if (!file) return;
    const attachment = await onPickFile(file, kind);
    if (attachment) setPending(attachment);
  }

  const canSend = text.trim().length > 0 || pending !== null;

  return (
    <div ref={wrapRef} className="border-t border-panel-border px-4 py-3 md:px-6">
      {pending && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-panel-border bg-background/60 px-3 py-2 text-xs text-foreground">
          <span>{pending.kind === "image" ? "🖼" : "🎥"}</span>
          <span className="truncate">{pending.name}</span>
          <button
            type="button"
            onClick={() => setPending(null)}
            className="ml-auto text-muted-foreground hover:text-destructive"
            aria-label="Remove attachment"
          >
            ✕
          </button>
        </div>
      )}

      <div className="relative flex items-end gap-2">
        {menuOpen && (
          <div className="absolute bottom-14 left-0 z-10 w-48 overflow-hidden rounded-2xl border border-panel-border bg-popover shadow-soft">
            <button
              type="button"
              onClick={() => imageRef.current?.click()}
              className="block w-full px-4 py-3 text-left text-sm text-popover-foreground transition-colors hover:bg-accent"
            >
              {ui.addImage}
            </button>
            <button
              type="button"
              onClick={() => videoRef.current?.click()}
              className="block w-full border-t border-panel-border px-4 py-3 text-left text-sm text-popover-foreground transition-colors hover:bg-accent"
            >
              {ui.addVideo}
            </button>
          </div>
        )}

        <button
          type="button"
          aria-label={ui.addImage}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-panel-border bg-background/70 text-xl text-foreground transition-colors hover:bg-background"
        >
          +
        </button>

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFile(event, "image")}
        />
        <input
          ref={videoRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(event) => handleFile(event, "video")}
        />

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={ui.placeholder}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-panel-border bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label={ui.send}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-brand text-white shadow-soft transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
