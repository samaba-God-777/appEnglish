import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { GrammarQuiz } from "./GrammarQuiz";
import { grammarTopics } from "./grammar-content";
import { getQuestions } from "./grammar-questions";
import type { GrammarMode } from "./grammar-questions";

export default function GrammarGamePage({ mode }: { mode: GrammarMode }) {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = grammarTopics.find((t) => t.id === topicId);

  if (!topicId || !topic) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-lg font-semibold">Topic not found</p>
        <Link
          to="/grammar"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
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
      <GrammarQuiz
        topicId={topic.id}
        topicName={topic.title}
        mode={mode}
        onExit={() => window.history.back()}
      />
      {getQuestions(topic.id).length === 0 && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          No questions are ready for this topic yet.
        </p>
      )}
    </div>
  );
}