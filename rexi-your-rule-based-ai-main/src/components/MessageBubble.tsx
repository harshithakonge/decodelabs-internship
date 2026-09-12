import type { ChatMessage } from "@/chatbot/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`animate-message-in flex w-full gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-brand text-sm">
          🤖
        </span>
      )}
      <div className="max-w-[85%] sm:max-w-[70%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "rounded-br-md bg-gradient-brand text-white"
              : "rounded-bl-md border border-panel-border bg-bubble-bot text-bubble-bot-foreground"
          }`}
        >
          {message.attachment?.kind === "image" && (
            <figure className="mb-2">
              <img
                src={message.attachment.url}
                alt={message.attachment.name}
                className="max-h-64 w-full rounded-xl object-cover"
              />
              <figcaption
                className={`mt-1 text-xs ${isUser ? "text-white/80" : "text-muted-foreground"}`}
              >
                🖼 {message.attachment.name}
              </figcaption>
            </figure>
          )}
          {message.attachment?.kind === "video" && (
            <figure className="mb-2">
              <video
                src={message.attachment.url}
                controls
                className="max-h-64 w-full rounded-xl bg-black"
              />
              <figcaption
                className={`mt-1 text-xs ${isUser ? "text-white/80" : "text-muted-foreground"}`}
              >
                🎥 {message.attachment.name}
              </figcaption>
            </figure>
          )}
          {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
        </div>
        <p
          className={`mt-1 text-[11px] text-muted-foreground ${isUser ? "text-right" : "text-left"}`}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
}
