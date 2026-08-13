import { useState } from "react";
import { motion } from "framer-motion";
import { Ear, X, RotateCcw, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { speak } from "@/lib/speech";
import { dictationSentences } from "./game-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

const ROUNDS = 6;

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function wordTokens(text: string): string[] {
  return text.split(/\s+/).map(normalize).filter((w) => w.length > 0);
}

/** 0–100: how many of the target's words appear in the dictation. */
function dictationAccuracy(target: string, input: string): number {
  const targetWords = wordTokens(target);
  if (targetWords.length === 0) return 0;
  const got = wordTokens(input);
  const matched = targetWords.filter((w) => got.includes(w)).length;
  return Math.round((matched / targetWords.length) * 100);
}

function scoreColor(a: number): string {
  return a >= 80 ? "text-success" : a >= 50 ? "text-warning" : "text-destructive";
}

export function ListeningDictation({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const { items, status, refresh } = useAiContent("dictation", dictationSentences, { count: ROUNDS, level: diffLevel });
  const sentences = items.slice(0, ROUNDS);
  const [round, setRound] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const addXp = useAuthStore((s) => s.addXp);
  const addActivity = useStatsStore((s) => s.addActivity);

  const sentence = sentences[round];
  const finished = round >= sentences.length || !sentence;
  const gotWords = wordTokens(value);

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  const check = () => {
    if (checked || !sentence) return;
    setChecked(true);
    const acc = dictationAccuracy(sentence, value);
    const xp = Math.max(2, Math.round(acc / 10));
    addXp(xp);
    addActivity(xp, 1, "listening");
    if (acc >= 80) setScore((s) => s + 1);
  };

  const advance = () => {
    setValue("");
    setChecked(false);
    setRound((r) => r + 1);
  };

  if (finished) {
    return (
      <Card className="shadow-soft">
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <Ear className="size-9 text-primary" aria-hidden />
          <p className="text-5xl font-extrabold tracking-tight text-primary tabular-nums">
            {score} / {sentences.length}
          </p>
          <p className="max-w-sm text-muted-foreground">
            {score >= ROUNDS
              ? "Flawless ear — you catch every word."
              : score >= Math.ceil(ROUNDS / 2)
                ? "Sharp listening. Tune in a little longer next round."
                : "Your ears warm up fast — replay the sentences you missed."}
          </p>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={onExit}>
              <X aria-hidden /> Exit
            </Button>
            <Button onClick={() => { refresh(); setRound(0); setScore(0); setValue(""); setChecked(false); }}>
              <RotateCcw aria-hidden /> Play again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentence) return null;

  const accuracy = checked ? dictationAccuracy(sentence, value) : 0;

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit game">
            <X aria-hidden />
          </Button>
          <Progress value={round} max={sentences.length} className="flex-1" label="Progress" />
          <span className="text-sm font-bold text-muted-foreground tabular-nums">{round + 1} / {sentences.length}</span>
          {status === "ai" && <Badge variant="accent">AI</Badge>}
        <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">Type what you hear</p>
          <Button size="lg" onClick={() => speak(sentence)} aria-label="Play the sentence">
            <Play aria-hidden /> Play
          </Button>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={checked}
            rows={3}
            placeholder="Write the sentence here…"
            autoFocus
            className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-4 text-center text-lg font-medium leading-relaxed outline-none transition-colors focus:border-ring"
          />

          {checked && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-3">
              <span className={cn("text-4xl font-extrabold tabular-nums", scoreColor(accuracy))}>{accuracy}%</span>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{accuracy >= 80 ? "Great catch!" : "Here's the sentence:"}</span>{" "}
                “{sentence}”
              </p>
              <div className="flex justify-center">
                <Button onClick={advance}>{round + 1 === sentences.length ? "Finish" : "Next"}</Button>
              </div>
            </motion.div>
          )}

          {!checked && (
            <Button onClick={check} disabled={value.trim() === ""} size="lg">
              Check {gotWords.length > 0 && `· ${gotWords.length} word${gotWords.length === 1 ? "" : "s"}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}