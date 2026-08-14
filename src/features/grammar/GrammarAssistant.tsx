import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

interface AssistantTopic {
  title: string;
  level: string;
  signalWords: string[];
}

interface Msg {
  role: "user" | "assistant";
  content: string;
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => (
    <p key={i} className={cn("min-h-[1em] whitespace-pre-wrap", i > 0 && "mt-1")}>
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

export function GrammarAssistant({ topic }: { topic: AssistantTopic }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    setError(null);
    const history: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(history);
    setBusy(true);

    const systemPrompt = `You are an expert ESL grammar tutor for Spanish-speaking learners, now helping with the topic "${topic.title}" (target level ${topic.level}).
Rules:
- Explain rules clearly in simple English, with one short example sentence each.
- Use bold **like this** for the key grammar structure / any term worth remembering.
- Reference the topic's signal words: ${topic.signalWords.join(", ")}, to help recognition.
- If the learner asks in Spanish ("explica en español"), switch to clear Spanish.
- If the learner pastes a sentence, correct it and explain the grammar point, not just the words.
- Keep answers focused: typically 2-5 short paragraphs or a short bulleted list. No long essays.`;

    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.7,
          max_tokens: 1200,
          messages: [
            { role: "system", content: systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Groq API error (${res.status}): ${detail.slice(0, 100)}`);
      }

      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error("Empty reply from AI");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reach the AI tutor");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader>
        <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen((o) => !o)}>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden /> Ask the AI tutor
          </CardTitle>
          <span className="text-xs font-semibold text-muted-foreground">{open ? "Hide" : "Show"}</span>
        </button>
      </CardHeader>
      {open && (
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Stuck on <strong>{topic.title}</strong>? Ask about the rule, a tricky sentence, or the signal words —{" "}
            {topic.signalWords.join(", ")}.
          </p>

          <div className="scrollbar-thin max-h-80 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-4" aria-hidden />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  I&apos;m your grammar tutor for {topic.title}. Try: "Explain this to me in Spanish" or paste a sentence.
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
                {m.role === "assistant" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="size-4" aria-hidden />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "assistant"
                      ? "rounded-tl-sm bg-muted"
                      : "rounded-tr-sm bg-primary text-primary-foreground",
                  )}
                >
                  {renderContent(m.content)}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-4" aria-hidden />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3" aria-label="Tutor is typing">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="size-1.5 animate-pulse rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && <p className="mt-3 text-xs font-semibold text-destructive">{error}</p>}

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
              placeholder="Ask about the grammar…"
              aria-label="Ask the grammar tutor"
              className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm focus:border-ring"
            />
            <Button type="submit" size="icon" disabled={busy || input.trim() === ""} aria-label="Send">
              <Send className="size-4" aria-hidden />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
