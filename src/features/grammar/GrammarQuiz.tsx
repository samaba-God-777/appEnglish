import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, PartyPopper, Trophy, Swords, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { speak } from "@/lib/speech";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";
import { buildQuiz, type GrammarMode, type GrammarQuestion } from "./grammar-questions";
import { useGrammarProgress } from "./useGrammarProgress";

const TITLE: Record<GrammarMode, string> = {
  activity: "Challenge",
  test: "Test",
  assignment: "Assignment",
};

const ICON: Record<GrammarMode, typeof Trophy> = {
  activity: PartyPopper,
  test: Trophy,
  assignment: Swords,
};

/** Renders the prompt, turning the `___` blank into a highlighted marker. */
function GapPrompt({ prompt }: { prompt: string }) {
  const parts = prompt.split("___");
  if (parts.length === 1) return <p className="text-lg font-semibold">{prompt}</p>;
  return (
    <p className="text-lg font-semibold leading-relaxed">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="mx-1 inline-block min-w-4 rounded-md bg-primary/15 px-1 text-center text-primary" aria-hidden>
              ?
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

export function GrammarQuiz({
  topicId,
  topicName,
  mode,
  onExit,
  questions,
}: {
  topicId: string;
  topicName: string;
  mode: GrammarMode;
  onExit: () => void;
  questions?: GrammarQuestion[];
}) {
  const activeQuestions = questions ?? buildQuiz(topicId, mode);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const awardedRef = useRef(false);
  const addXp = useAuthStore((s) => s.addXp);
  const addActivity = useStatsStore((s) => s.addActivity);
  const recordActivity = useGrammarProgress((s) => s.recordActivity);
  const recordTest = useGrammarProgress((s) => s.recordTest);
  const recordAssignment = useGrammarProgress((s) => s.recordAssignment);

  const q = activeQuestions[index];
  const total = activeQuestions.length;
  const finished = index >= total || !q;
  const TitleIcon = ICON[mode];
  const passed = total > 0 && score / total >= 0.7;

  const choose = (i: number) => {
    if (selected !== null || !q) return;
    setSelected(i);
    if (i === q.correctIndex) {
      setScore((s) => s + 1);
      if (mode === "activity") {
        addXp(12);
        addActivity(12, 1, "grammar");
      }
    }
  };

  const next = () => {
    setSelected(null);
    setIndex((i) => i + 1);
  };

  // Award once at the end.
  useEffect(() => {
    if (!finished || awardedRef.current) return;
    awardedRef.current = true;
    if (mode === "test") {
      const xp = score * 24;
      if (xp > 0) {
        addXp(xp);
        addActivity(xp, 4, "grammar");
      }
      recordTest(topicId, score);
    } else if (mode === "assignment") {
      if (passed) {
        const xp = score * 24;
        addXp(xp);
        addActivity(xp, 4, "grammar");
      }
      recordAssignment(topicId, passed);
    } else {
      recordActivity(topicId, score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (finished) {
    return (
      <Card className="shadow-soft">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center lg:p-12">
          <TitleIcon className="size-9 text-primary" aria-hidden />
          <p className="text-5xl font-extrabold tracking-tight text-primary tabular-nums">
            {score}/{total}
          </p>
          <p className="max-w-sm text-muted-foreground">
            {mode === "assignment"
              ? passed
                ? "Assignment passed — consistency on mastery works!"
                : "You need 70% to pass. Review the reference notes and try again."
              : mode === "test"
                ? score === total
                  ? "Perfect test — flawless recall."
                  : "Keep sharpening this topic."
                : "Every answer counts towards your grammar streak."}
          </p>
          {mode === "assignment" && (
            <Badge variant={passed ? "accent" : "outline"} className="px-4 py-1 text-sm">
              {passed ? "Passed" : `Try again · ${Math.round((score / total) * 100)}%`}
            </Badge>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={onExit}>
              <ArrowLeft aria-hidden /> Back to topic
            </Button>
            <Button
              onClick={() => {
                setIndex(0);
                setScore(0);
                setSelected(null);
                awardedRef.current = false;
              }}
            >
              <RotateCcw aria-hidden /> Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <TitleIcon className="size-5 text-primary" aria-hidden />
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wide">{topicName}</h2>
              <p className="text-xs text-muted-foreground">{TITLE[mode]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground tabular-nums">
              {index + 1} / {total}
            </span>
            <Badge variant="secondary">{score} correct</Badge>
          </div>
        </div>
        <Progress value={index} max={total} className="h-2" label={`${TITLE[mode]} progress`} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <GapPrompt prompt={q.prompt} />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Read the sentence aloud"
            onClick={() => speak(q.prompt.replace(/__+/g, "blank"))}
          >
            <Volume2 className="size-4" aria-hidden />
          </Button>
        </div>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {q.options.map((option, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = i === selected;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={cn(
                  "rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
                  selected === null && "hover:border-primary hover:bg-primary/5",
                  selected !== null && isCorrect && "border-success bg-success/10 text-success",
                  selected !== null && isSelected && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                  selected !== null && !isSelected && !isCorrect && "opacity-50",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  {option}
                  {selected !== null && isCorrect && <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />}
                  {selected !== null && isSelected && !isCorrect && <XCircle className="size-5 shrink-0 text-destructive" aria-hidden />}
                </span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col gap-4 rounded-xl bg-muted/60 p-4"
          >
            <p className="text-sm text-muted-foreground">
              <span className={cn("font-semibold", selected === q.correctIndex ? "text-success" : "text-destructive")}>
                {selected === q.correctIndex ? "Correct!" : "Not quite."}
              </span>{" "}
              {q.explanation}
            </p>
            <div className="flex justify-end">
              <Button onClick={next}>{index + 1 === total ? "Finish" : "Next"}</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}