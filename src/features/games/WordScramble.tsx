import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, X, CheckCircle2, XCircle, Lightbulb, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { gameWordPairs, shuffle, type WordPair } from "./game-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

const ROUNDS = 6;

/** Rearranges a word's letters, guaranteeing the result differs from the original. */
function scramble(word: string, seed: number): string {
  let result = word;
  let attempt = 0;
  while (result === word && attempt < 8) {
    result = shuffle(word.split(""), seed + attempt).join("");
    attempt++;
  }
  return result;
}

export function WordScramble({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const { items, status, refresh } = useAiContent<WordPair>("word-scramble", gameWordPairs, { count: ROUNDS, level: diffLevel });
  const words = useMemo(
    () =>
      shuffle(
        items.filter((p) => /^[a-z]{4,9}$/i.test(p.word)),
        seed,
      ).slice(0, ROUNDS),
    [items, seed],
  );
  const [round, setRound] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  const pair = words[round];
  const finished = round >= words.length || !pair;
  const scrambled = useMemo(() => (pair ? scramble(pair.word.toLowerCase(), seed + round) : ""), [pair, seed, round]);

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  const correct = pair ? value.trim().toLowerCase() === pair.word.toLowerCase() : false;

  const check = () => {
    if (!pair || checked) return;
    setChecked(true);
    const xp = correct ? 18 : 4;
    addXp(xp);
    addActivity(xp, 1, "vocabulary");
    if (correct) setScore((s) => s + 1);
  };

  const advance = () => {
    setValue("");
    setChecked(false);
    setRevealed(false);
    setRound((r) => r + 1);
  };

  if (finished) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <p className="text-4xl font-extrabold tracking-tight text-primary tabular-nums">
            {score} / {words.length}
          </p>
          <p className="text-muted-foreground">words unscrambled. Sharp eyes!</p>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={onExit}>
              <X aria-hidden /> Exit
            </Button>
            <Button onClick={() => { refresh(); setRound(0); setScore(0); setValue(""); setChecked(false); setRevealed(false); }}>
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
          <Progress value={round} max={words.length} className="flex-1" label="Progress" />
          <span className="text-sm font-bold text-muted-foreground tabular-nums">{round + 1} / {words.length}</span>
          {status === "ai" && <Badge variant="accent">AI</Badge>}
          <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        <div className="text-center">
          <p className="mb-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Lightbulb className="size-3.5 text-accent" aria-hidden /> {pair.meaning}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {scrambled.split("").map((letter, i) => (
              <span
                key={i}
                className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-2xl font-extrabold text-primary uppercase"
              >
                {letter}
              </span>
            ))}
          </div>

          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (checked) advance();
              else check();
            }}
          >
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={checked}
              placeholder="Unscramble the word…"
              aria-label="Type the unscrambled word"
              className={cn(
                "h-12 w-full max-w-sm rounded-xl border border-border bg-background px-4 text-center text-lg font-semibold focus:border-ring",
                checked && correct && "border-success text-success",
                checked && !correct && "border-destructive text-destructive",
              )}
            />

            {checked && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold">
                {correct ? (
                  <span className="flex items-center gap-1.5 text-success">
                    <CheckCircle2 className="size-4" aria-hidden /> Correct! +18 XP
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-destructive">
                    <XCircle className="size-4" aria-hidden /> It's “{pair.word}”
                  </span>
                )}
              </motion.div>
            )}

            <div className="mt-5 flex items-center justify-center gap-2">
              {checked ? (
                <Button type="submit" size="lg">{round + 1 === words.length ? "Finish" : "Next word"}</Button>
              ) : (
                <>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setRevealed(true)}>
                    <Eye aria-hidden /> Hint
                  </Button>
                  <Button type="submit" size="lg" disabled={value.trim() === ""}>Check</Button>
                </>
              )}
            </div>
            {revealed && !checked && (
              <p className="mt-2 font-mono text-sm tracking-widest text-muted-foreground">
                {pair.word.slice(0, 2).toLowerCase()}{"_ ".repeat(Math.max(0, pair.word.length - 2)).trim()}
              </p>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
