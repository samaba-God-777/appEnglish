import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { grammarTopics } from "./grammar-content";
import { buildQuiz, type GrammarQuestion } from "./grammar-questions";
import { GrammarQuiz } from "./GrammarQuiz";

const FALLBACK_COUNT = 5;

export default function GrammarAiQuizPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = grammarTopics.find((t) => t.id === topicId);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [attempt, setAttempt] = useState(0);

  const load = async () => {
    if (!topic) return;
    setState("loading");
    try {
      const res = await fetch("/api/grammar/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topicId: topic.id, topicTitle: topic.title, count: FALLBACK_COUNT }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { questions?: GrammarQuestion[] };
      if (!data.questions || data.questions.length === 0) throw new Error("No questions generated");
      setQuestions(data.questions);
      setState("ready");
    } catch {
      setState("error");
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, attempt]);

  if (!topic) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-lg font-semibold">Topic not found</p>
        <Link to="/grammar" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
          <ArrowLeft aria-hidden /> Back to grammar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link
        to={`/grammar/${topic.id}`}
        className="mb-5 -ml-2 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> {topic.title}
      </Link>

      {state === "loading" && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
          <Sparkles className="size-8 animate-pulse text-primary" aria-hidden />
          <p className="text-lg font-bold">Generating fresh questions…</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            The AI is writing new practice for <strong>{topic.title}</strong>. This takes a few seconds.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
          <p className="text-lg font-bold">Couldn&apos;t reach the AI</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            The generation service isn&apos;t responding right now. You can retry, or practise with the built-in bank.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setAttempt((a) => a + 1)}>
              <RotateCcw aria-hidden /> Retry
            </Button>
            <Button variant="outline" onClick={() => { setQuestions(buildQuiz(topic.id, "activity")); setState("ready"); }}>
              Use the question bank
            </Button>
          </div>
        </div>
      )}

      {state === "ready" && (
        <>
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-4 text-primary" aria-hidden /> AI-generated practice · {topic.title}
          </div>
          <GrammarQuiz
            key={`${topic.id}-${attempt}`}
            topicId={topic.id}
            topicName={topic.title}
            mode="activity"
            questions={questions}
            onExit={() => window.history.back()}
          />
        </>
      )}
    </div>
  );
}
