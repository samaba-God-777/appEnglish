import { useMemo, useState } from "react";
import { RotateCcw, X, Gauge, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { gameSentences, pickRandom } from "./game-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

export function TypingRace({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const [round, setRound] = useState(0);
  const { items, status } = useAiContent("typing-race", gameSentences, { count: 8, level: diffLevel });
  const sentence = useMemo(() => {
    void round;
    return pickRandom(items);
  }, [round, items]);

  const [value, setValue] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);
  const [result, setResult] = useState<{ wpm: number; accuracy: number; xp: number } | null>(null);

  const onChange = (text: string) => {
    if (done) return;
    if (startTime === null) setStartTime(Date.now());
    setValue(text);
    if (text === sentence) finish(text, startTime ?? Date.now());
  };

  const finish = (text: string, start: number) => {
    const minutes = Math.max((Date.now() - start) / 60000, 1 / 60);
    const words = sentence.trim().split(/\s+/).length;
    const wpm = Math.round(words / minutes);
    let correctChars = 0;
    for (let i = 0; i < text.length; i++) if (text[i] === sentence[i]) correctChars++;
    const accuracy = Math.round((correctChars / sentence.length) * 100);
    const xp = Math.round((wpm + accuracy) / 3);
    setDone(true);
    setResult({ wpm, accuracy, xp });
    addXp(xp);
    addActivity(xp, 1, "writing");
  };

  const next = () => {
    setValue("");
    setStartTime(null);
    setDone(false);
    setResult(null);
    setRound((r) => r + 1);
  };

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit game">
            <X aria-hidden />
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Typing Race</Badge>
            {status === "ai" && <Badge variant="accent">AI</Badge>}
          </div>
          <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        {/* Target sentence with live per-character feedback */}
        <p className="rounded-xl bg-muted p-4 text-lg leading-relaxed">
          {sentence.split("").map((char, i) => {
            const typed = value[i];
            return (
              <span
                key={i}
                className={cn(
                  typed == null && "text-muted-foreground",
                  typed != null && typed === char && "text-success",
                  typed != null && typed !== char && "rounded bg-destructive/20 text-destructive",
                )}
              >
                {char}
              </span>
            );
          })}
        </p>

        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={done}
          placeholder="Start typing here…"
          aria-label="Type the sentence"
          className="mt-4 h-12 w-full rounded-xl border border-border bg-background px-4 text-base focus:border-ring"
        />

        {done && result ? (
          <div className="mt-6 text-center">
            <div className="flex justify-center gap-6">
              <span className="flex flex-col items-center">
                <Gauge className="size-5 text-primary" aria-hidden />
                <span className="mt-1 text-2xl font-extrabold tabular-nums">{result.wpm}</span>
                <span className="text-xs text-muted-foreground">WPM</span>
              </span>
              <span className="flex flex-col items-center">
                <Target className="size-5 text-accent" aria-hidden />
                <span className="mt-1 text-2xl font-extrabold tabular-nums">{result.accuracy}%</span>
                <span className="text-xs text-muted-foreground">accuracy</span>
              </span>
            </div>
            <Badge variant="accent" className="mt-4 text-sm">+{result.xp} XP</Badge>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={onExit}>
                <X aria-hidden /> Exit
              </Button>
              <Button onClick={next}>
                <RotateCcw aria-hidden /> Next sentence
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Type the sentence exactly. Speed and accuracy both count.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
