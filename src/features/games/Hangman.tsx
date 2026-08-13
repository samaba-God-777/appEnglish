import { useEffect, useMemo, useState } from "react";
import { Heart, RotateCcw, X, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { gameWordPairs, pickRandom, type WordPair } from "./game-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const MAX_LIVES = 6;

export function Hangman({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const [round, setRound] = useState(0);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);
  const [awarded, setAwarded] = useState(false);
  const { items, status, refresh } = useAiContent<WordPair>("hangman", gameWordPairs, { count: 8, level: diffLevel });

  // Pick a single-word answer so every letter is guessable.
  const pair = useMemo(() => {
    void round;
    return pickRandom(items.filter((p) => /^[a-z]+$/i.test(p.word)));
  }, [round, items]);
  const word = pair.word.toLowerCase();

  const wrong = [...guessed].filter((l) => !word.includes(l));
  const lives = MAX_LIVES - wrong.length;
  const won = word.split("").every((l) => guessed.has(l));
  const lost = lives <= 0;
  const over = won || lost;

  // Award XP from an effect (not the render body) to avoid a React state-update crash.
  useEffect(() => {
    if (over && won && !awarded) {
      setAwarded(true);
      const xp = 20 + lives * 5;
      addXp(xp);
      addActivity(xp, 2, "vocabulary");
    }
  }, [over, won, lives, awarded, addXp, addActivity]);

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  const guess = (letter: string) => {
    if (over || guessed.has(letter)) return;
    setGuessed((prev) => new Set(prev).add(letter));
  };

  const nextRound = () => {
    refresh();
    setGuessed(new Set());
    setAwarded(false);
    setRound((r) => r + 1);
  };

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit game">
            <X aria-hidden />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" aria-label={`${lives} lives left`}>
              {Array.from({ length: MAX_LIVES }, (_, i) => (
                <Heart key={i} className={cn("size-5", i < lives ? "fill-destructive text-destructive" : "text-muted")} aria-hidden />
              ))}
            </div>
            {status === "ai" && <Badge variant="accent">AI</Badge>}
          </div>
          <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Lightbulb className="size-3.5 text-accent" aria-hidden /> Hint: {pair.meaning}
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-2">
          {word.split("").map((letter, i) => (
            <span
              key={i}
              className={cn(
                "flex size-11 items-center justify-center rounded-lg border-b-4 border-border text-2xl font-extrabold uppercase",
                guessed.has(letter) || over ? "text-foreground" : "text-transparent",
                over && !guessed.has(letter) && "text-destructive",
              )}
            >
              {guessed.has(letter) || over ? letter : "_"}
            </span>
          ))}
        </div>

        {over ? (
          <div className="text-center">
            <Badge variant={won ? "success" : "destructive"} className="text-sm">
              {won ? `You won! +${20 + lives * 5} XP` : `The word was “${word}”`}
            </Badge>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={onExit}>
                <X aria-hidden /> Exit
              </Button>
              <Button onClick={nextRound}>
                <RotateCcw aria-hidden /> New word
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-md grid-cols-7 gap-1.5 sm:grid-cols-9">
            {ALPHABET.map((letter) => {
              const used = guessed.has(letter);
              const isWrong = used && !word.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => guess(letter)}
                  disabled={used}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg border border-border text-sm font-bold uppercase transition-colors",
                    !used && "hover:border-primary hover:bg-primary/5",
                    used && !isWrong && "border-success bg-success/10 text-success",
                    isWrong && "border-destructive bg-destructive/10 text-destructive",
                  )}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
