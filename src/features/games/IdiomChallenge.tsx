import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Quote, X, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { idioms, shuffle, type Idiom } from "./game-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

const ROUNDS = 8;

/** One round's idiom plus four meaning options (one correct, three distractor meanings). */
function roundOptions(idiom: Idiom, pool: Idiom[], roundSeed: number): string[] {
  const others = shuffle(
    pool.filter((i) => i.meaning !== idiom.meaning).map((i) => i.meaning),
    roundSeed,
  );
  return shuffle([idiom.meaning, ...others.slice(0, 3)], roundSeed);
}

export function IdiomChallenge({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const { items, status, refresh } = useAiContent<Idiom>("idiom", idioms, { count: ROUNDS, level: diffLevel });
  const rounds = useMemo(() => shuffle(items, seed).slice(0, ROUNDS), [items, seed]);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const addXp = useAuthStore((s) => s.addXp);
  const addActivity = useStatsStore((s) => s.addActivity);

  const item = rounds[round];
  const finished = round >= rounds.length || !item;
  const options = useMemo(() => (item ? roundOptions(item, items, round) : []), [item, items, round]);
  const correct = !!item && selected !== null && options[selected] === item.meaning;

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  const choose = (i: number) => {
    if (selected !== null || !item) return;
    setSelected(i);
    const right = options[i] === item.meaning;
    if (right) {
      setScore((s) => s + 1);
      addXp(12);
      addActivity(12, 1, "vocabulary");
    }
  };

  const advance = () => {
    setSelected(null);
    setRound((r) => r + 1);
  };

  if (finished) {
    return (
      <Card className="shadow-soft">
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <Quote className="size-9 text-primary" aria-hidden />
          <p className="text-5xl font-extrabold tracking-tight text-primary tabular-nums">
            {score} / {rounds.length}
          </p>
          <p className="max-w-sm text-muted-foreground">
            {score >= 7 ? "Idiom master — you think in colour." : score >= 5 ? "Great slang sense. Keep collecting phrases." : "Every idiom you meet becomes a tool."}
          </p>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={onExit}>
              <X aria-hidden /> Exit
            </Button>
            <Button onClick={() => { refresh(); setRound(0); setScore(0); setSelected(null); }}>
              <RotateCcw aria-hidden /> Play again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!item) return null;

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit game">
            <X aria-hidden />
          </Button>
          <Progress value={round} max={rounds.length} className="flex-1" label="Progress" />
          <span className="text-sm font-bold text-muted-foreground tabular-nums">{round + 1} / {rounds.length}</span>
          {status === "ai" && <Badge variant="accent">AI</Badge>}
        <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">Choose the real meaning</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight">“{item.idiom}”</p>
        </div>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {options.map((option, i) => {
            const isAnswer = option === item.meaning;
            const isSelected = i === selected;
            return (
              <button
                key={`${item.idiom}-${i}`}
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={cn(
                  "rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
                  selected === null && "hover:border-primary hover:bg-primary/5",
                  selected !== null && isAnswer && "border-success bg-success/10 text-success",
                  selected !== null && isSelected && !isAnswer && "border-destructive bg-destructive/10 text-destructive",
                  selected !== null && !isSelected && !isAnswer && "opacity-50",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  {option}
                  {selected !== null && isAnswer && <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />}
                  {selected !== null && isSelected && !isAnswer && <XCircle className="size-5 shrink-0 text-destructive" aria-hidden />}
                </span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex flex-col gap-4 rounded-xl bg-muted/60 p-4"
          >
            <p className="text-sm text-muted-foreground">
              <span className={cn("font-semibold", correct ? "text-success" : "text-destructive")}>
                {correct ? "Correct!" : "Not quite."}
              </span>{" "}
              “{item.idiom}” means <span className="font-semibold text-foreground">{item.meaning}</span>.
            </p>
            <div className="flex justify-end">
              <Button onClick={advance}>{round + 1 === rounds.length ? "Finish" : "Next"}</Button>
            </div>
          </motion.div>
        )}

        <Badge className="mt-5 w-fit" variant="secondary">Idioms are literal pictures — visualise the scene to remember them.</Badge>
      </CardContent>
    </Card>
  );
}