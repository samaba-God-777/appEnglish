import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Volume2, RotateCcw, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { speak } from "@/lib/speech";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";
import type { FlashDeck } from "./flashcard-decks";
import { CardArt } from "./CardArt";

export function SpellActivity({ deck, onExit }: { deck: FlashDeck; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  const card = deck.cards[index];
  const total = deck.cards.length;
  const finished = index >= total;
  const correct = card ? value.trim().toLowerCase() === card.word.toLowerCase() : false;

  const check = () => {
    if (!card || checked) return;
    setChecked(true);
    const xp = correct ? 15 : 4;
    addXp(xp);
    addActivity(xp, 1, "vocabulary");
    if (correct) setScore((s) => s + 1);
  };

  const advance = () => {
    setValue("");
    setChecked(false);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  if (finished || !card) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
        <p className="text-4xl font-extrabold tracking-tight text-primary">{score} / {total}</p>
        <p className="mt-2 text-muted-foreground">spelled correctly. Spelling builds real recall!</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onExit}>
            <ArrowLeft aria-hidden /> Levels
          </Button>
          <Button onClick={() => { setIndex(0); setScore(0); setValue(""); setChecked(false); setRevealed(false); }}>
            <RotateCcw aria-hidden /> Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Progress value={index} max={total} className="flex-1" label="Spelling progress" />
        <span className="text-sm font-bold text-muted-foreground tabular-nums">{index + 1} / {total}</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft lg:p-8">
        <CardArt card={card} compact />
        <Badge variant="secondary">{card.partOfSpeech}</Badge>
        <p className="mx-auto mt-3 max-w-md text-lg font-semibold">{card.definition}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          <Badge variant="accent">{card.translation}</Badge>
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" aria-label="Listen to the word" onClick={() => speak(card.word)}>
            <Volume2 aria-hidden /> Hear it
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setRevealed(true)} disabled={checked}>
            <Eye aria-hidden /> Hint
          </Button>
        </div>
        {revealed && !checked && (
          <p className="mt-2 font-mono text-sm tracking-widest text-muted-foreground">
            {card.word[0]}{"_ ".repeat(Math.max(0, card.word.length - 1)).trim()}
          </p>
        )}

        <form
          className="mt-5"
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
            placeholder="Type the word…"
            aria-label="Type the word"
            className={cn(
              "h-12 w-full max-w-sm rounded-xl border border-border bg-background px-4 text-center text-lg font-semibold focus:border-ring",
              checked && correct && "border-success text-success",
              checked && !correct && "border-destructive text-destructive",
            )}
          />

          {checked && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold">
              {correct ? (
                <span className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="size-4" aria-hidden /> Correct!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-destructive">
                  <XCircle className="size-4" aria-hidden /> It's “{card.word}”
                </span>
              )}
            </motion.div>
          )}

          <div className="mt-5">
            {checked ? (
              <Button type="submit" size="lg">{index + 1 === total ? "Finish" : "Next word"}</Button>
            ) : (
              <Button type="submit" size="lg" disabled={value.trim() === ""}>Check</Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
