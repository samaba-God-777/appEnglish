import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { grammarTopics } from "./grammar-content";
import { buildQuiz, type GrammarQuestion } from "./grammar-questions";
import { GrammarQuiz } from "./GrammarQuiz";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const FALLBACK_COUNT = 5;

function isQuestion(value: unknown): value is GrammarQuestion {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.prompt === "string" &&
    Array.isArray(v.options) &&
    v.options.length === 4 &&
    typeof v.correctIndex === "number" &&
    v.correctIndex >= 0 &&
    v.correctIndex < 4 &&
    (v.kind === "mcq" || v.kind === "gapfill") &&
    typeof v.explanation === "string"
  );
}

export default function GrammarAiQuizPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = grammarTopics.find((t) => t.id === topicId);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [attempt, setAttempt] = useState(0);

  const load = async () => {
    if (!topic) return;
    setState("loading");

    const prompt = `Create ${FALLBACK_COUNT} English language-learning quiz questions for the grammar topic "${topic.title}".
Return ONLY JSON with this exact shape:
{"questions":[{"id":"q1","topicId":"${topic.id}","kind":"mcq","prompt":"...","options":["a","b","c","d"],"correctIndex":0,"explanation":"..."}]}
- id must be unique per question.
- kind: "mcq" or "gapfill". For gapfill, the prompt's blank MUST be written with "___" (e.g. "She ___ to work every morning.") and options must fit the blank.
- exactly 4 options per question.
- correctIndex is the 0-based index of the right option.
- explanation is one short sentence explaining the rule, in simple English.
- Focus on choosing the correct tense/structure/form for the topic. Make one or two distractors common learner mistakes.
- Do not include markdown or extra keys.`;

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
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Groq API error (${res.status}): ${detail.slice(0, 100)}`);
      }

      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response from AI");

      const parsed = JSON.parse(content) as { questions?: unknown[] };
      const validQuestions = (parsed.questions ?? [])
        .filter(isQuestion)
        .slice(0, FALLBACK_COUNT)
        .map((q, i) => {
          const prompt = (q as GrammarQuestion).prompt.replace(/_{2,}/g, "___");
          return {
            ...(q as GrammarQuestion),
            prompt,
            id: `${topic.id}-ai-${i + 1}`,
            topicId: topic.id,
            kind: prompt.includes("___") ? "gapfill" as const : "mcq" as const,
          };
        });

      if (validQuestions.length === 0) throw new Error("No valid questions generated");

      setQuestions(validQuestions);
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
