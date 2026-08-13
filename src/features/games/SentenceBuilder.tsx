import { useMemo, useState } from "react";
import { RotateCcw, X, CheckCircle2, XCircle, Delete } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { gameSentences, shuffle } from "./game-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

const ROUNDS = 5;

interface Token {
  id: number;
  word: string;
}

export function SentenceBuilder({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const { items, status, refresh } = useAiContent("sentence-builder", gameSentences, { count: ROUNDS, level: diffLevel });
  const sentences = useMemo(() => items.slice(0, ROUNDS), [items]);
  const [round, setRound] = useState(0);
  const [built, setBuilt] = useState<Token[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  const sentence = sentences[round];
  const finished = round >= sentences.length || !sentence;

  const bank = useMemo(() => {
    if (!sentence) return [] as Token[];
    return shuffle(
      sentence.split(" ").map((word, id) => ({ id, word })),
      seed + round,
    );
  }, [sentence, seed, round]);

  const available = bank.filter((t) => !built.some((b) => b.id === t.id));
  const attempt = built.map((t) => t.word).join(" ");
  const correct = attempt === sentence;

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  const check = () => {
    if (checked || built.length !== bank.length) return;
    setChecked(true);
    const xp = correct ? 20 : 5;
    addXp(xp);
    addActivity(xp, 1, "grammar");
    if (correct) setScore((s) => s + 1);
  };

  const advance = () => {
    setBuilt([]);
    setChecked(false);
    setRound((r) => r + 1);
  };

  if (finished) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <p className="text-4xl font-extrabold tracking-tight text-primary tabular-nums">
            {score} / {sentences.length}
          </p>
          <p className="text-muted-foreground">sentences built correctly.</p>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={onExit}>
              <X aria-hidden /> Exit
            </Button>
            <Button
              onClick={() => {
                refresh();
                setRound(0);
                setScore(0);
                setBuilt([]);
                setChecked(false);
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
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit game">
            <X aria-hidden />
          </Button>
          <Progress value={round} max={sentences.length} className="flex-1" label="Progress" />
          <span className="text-sm font-bold text-muted-foreground tabular-nums">
            {round + 1} / {sentences.length}
          </span>
          {status === "ai" && <Badge variant="accent">AI</Badge>}
          <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        <p className="mb-2 text-center text-sm font-semibold text-muted-foreground">Put the words in the correct order:</p>

        {/* Build area */}
        <div
          className={cn(
            "mb-4 flex min-h-16 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed p-3",
            checked && correct && "border-success bg-success/5",
            checked && !correct && "border-destructive bg-destructive/5",
            !checked && "border-border",
          )}
        >
          {built.length === 0 && <span className="text-sm text-muted-foreground">Tap the words below…</span>}
          {built.map((token) => (
            <button
              key={token.id}
              onClick={() => !checked && setBuilt((b) => b.filter((t) => t.id !== token.id))}
              disabled={checked}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
            >
              {token.word}
            </button>
          ))}
        </div>

        {/* Word bank */}
        <div className="flex flex-wrap justify-center gap-2">
          {available.map((token) => (
            <button
              key={token.id}
              onClick={() => setBuilt((b) => [...b, token])}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary/5"
            >
              {token.word}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {checked ? (
            <>
              <Badge variant={correct ? "success" : "destructive"} className="text-sm">
                {correct ? (
                  <>
                    <CheckCircle2 className="size-4" aria-hidden /> Correct! +20 XP
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" aria-hidden /> {sentence}
                  </>
                )}
              </Badge>
              <Button onClick={advance}>{round + 1 === sentences.length ? "Finish" : "Next"}</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setBuilt((b) => b.slice(0, -1))} disabled={built.length === 0}>
                <Delete aria-hidden /> Undo
              </Button>
              <Button onClick={check} disabled={built.length !== bank.length}>
                Check
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
