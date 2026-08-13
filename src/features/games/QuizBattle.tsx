import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "@/types";
import { quizQuestions } from "@/data/mock";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

interface QuizBattleProps {
  onExit: () => void;
}

const XP_PER_CORRECT = 24;
const ROUNDS = 8;

export function QuizBattle({ onExit }: QuizBattleProps) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const addXp = useAuthStore((s) => s.addXp);
  const addActivity = useStatsStore((s) => s.addActivity);
  const awardedRef = useRef(false);
  const { items, status, refresh } = useAiContent<QuizQuestion>("quiz", quizQuestions, { count: ROUNDS, level: diffLevel });
  const questions = useMemo(() => items.map((q, i) => ({ ...q, id: q.id || `ai-${i}` })), [items]);

  const question = questions[index];
  const finished = index >= questions.length || !question;

  useEffect(() => {
    if (finished && !awardedRef.current) {
      awardedRef.current = true;
      const xp = score * XP_PER_CORRECT;
      if (xp > 0) {
        addXp(xp);
        addActivity(xp, 4, "grammar");
      }
    }
  }, [finished, score, addXp, addActivity]);

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  const choose = (optionIndex: number) => {
    if (selected !== null || !question) return;
    setSelected(optionIndex);
    if (optionIndex === question.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setIndex((i) => i + 1);
  };

  if (finished) {
    const xp = score * XP_PER_CORRECT;
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <p className="text-5xl font-extrabold tracking-tight text-primary tabular-nums">
            {score}/{questions.length}
          </p>
          <p className="text-muted-foreground">
            {score === questions.length ? "Perfect round! " : score >= 3 ? "Solid work! " : "Keep practicing! "}
            You earned <strong className="text-accent">+{xp} XP</strong>.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onExit}>
              <X aria-hidden /> Exit
            </Button>
            <Button
              onClick={() => {
                awardedRef.current = false;
                refresh();
                setIndex(0);
                setScore(0);
                setSelected(null);
              }}
            >
              <RotateCcw aria-hidden /> Play again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit quiz">
            <X aria-hidden />
          </Button>
          <Progress value={index} max={questions.length} className="flex-1" label="Quiz progress" />
          <span className="text-sm font-bold text-muted-foreground tabular-nums">
            {index + 1}/{questions.length}
          </span>
          {status === "ai" && <Badge variant="accent">AI</Badge>}
          <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl font-bold tracking-tight">{question.question}</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, optionIndex) => {
              const isCorrect = optionIndex === question.answerIndex;
              const isSelected = optionIndex === selected;
              return (
                <button
                  key={option}
                  onClick={() => choose(optionIndex)}
                  disabled={selected !== null}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm font-semibold transition-all duration-150",
                    selected === null && "hover:border-primary hover:bg-primary/5",
                    selected !== null && isCorrect && "border-success bg-success/10 text-success",
                    selected !== null && isSelected && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                    selected !== null && !isSelected && !isCorrect && "opacity-50",
                  )}
                >
                  {option}
                  {selected !== null && isCorrect && <CheckCircle2 className="size-5 shrink-0" aria-hidden />}
                  {selected !== null && isSelected && !isCorrect && <XCircle className="size-5 shrink-0" aria-hidden />}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-muted p-4"
            >
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
              <Button onClick={next}>{index + 1 === questions.length ? "Finish" : "Next"}</Button>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
