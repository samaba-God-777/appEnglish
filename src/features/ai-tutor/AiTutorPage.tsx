import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/auth";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/cn";
import { getTutorReply, suggestedPrompts } from "./tutor-engine";

function buildInitialMessages(firstName: string): ChatMessage[] {
  return [
    {
      id: "m-0",
      role: "assistant",
      content: `Hi ${firstName}! 👋 I'm your AI tutor. I know you're working toward B2 and that writing is your weakest skill right now.\n\nWhat would you like to do today?`,
    },
  ];
}

/** Renders **bold** markers from the mock tutor as <strong>. */
function renderContent(content: string) {
  return content.split("\n").map((line, i) => (
    <p key={i} className={cn("min-h-[1em]", i > 0 && "mt-1")}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{part}</span>
        ),
      )}
    </p>
  ));
}

export default function AiTutorPage() {
  const user = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    buildInitialMessages(user.name.split(" ")[0] ?? "there"),
  );
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");
    const userMessage: ChatMessage = { id: `m-${Date.now()}-u`, role: "user", content: trimmed };
    const replyId = `m-${Date.now()}-a`;
    setMessages((prev) => [...prev, userMessage, { id: replyId, role: "assistant", content: "" }]);
    setStreaming(true);

    const full = getTutorReply(trimmed);
    const words = full.split(" ");
    words.forEach((_, i) => {
      const timer = window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, content: words.slice(0, i + 1).join(" ") } : m)),
        );
        if (i === words.length - 1) setStreaming(false);
      }, 250 + i * 28);
      timers.current.push(timer);
    });
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-4xl flex-col p-4 lg:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-6" aria-hidden />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">AI Tutor</h1>
          <p className="text-xs text-muted-foreground">
            Adapted to your level <Badge variant="secondary">B1</Badge> · English + Español
          </p>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-soft lg:p-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
            {message.role === "assistant" ? (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-4" aria-hidden />
              </div>
            ) : (
              <Avatar initials={user.avatarInitials} size="sm" />
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "assistant"
                  ? "rounded-tl-sm bg-muted"
                  : "rounded-tr-sm bg-primary text-primary-foreground",
              )}
            >
              {message.content ? (
                renderContent(message.content)
              ) : (
                <span className="flex gap-1 py-1" aria-label="Tutor is typing">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${dot * 0.15}s` }}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => send(prompt)}
            disabled={streaming}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about English…"
          aria-label="Message to AI tutor"
          className="h-12 flex-1 rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:border-ring"
        />
        <Button type="submit" size="lg" disabled={streaming || !input.trim()} aria-label="Send message">
          <Send aria-hidden />
        </Button>
      </form>
    </div>
  );
}
