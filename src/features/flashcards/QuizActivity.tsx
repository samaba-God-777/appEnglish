import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Volume2, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { speak } from "@/lib/speech";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";
import type { FlashCard, FlashDeck } from "./flashcard-decks";
import { CardArt } from "./CardArt";

/** Builds one question per card: the correct definition + 3 distractors from the deck. */
function buildOptions(cards: FlashCard[], correct: FlashCard): string[] {
  const others = cards.filter((c) => c.id !== correct.id).map((c) => c.definition);
  for (let i = others.length - 1; i > 0; i--) {
    const j = (i * 7 + correct.word.length) % (i + 1);
    [others[i], others[j]] = [others[j]!, others[i]!];
  }
  const opts = [correct.definition, ...others.slice(0, 3)];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = (i * 5 + correct.id.length) % (i + 1);
    [opts[i], opts[j]] = [opts[j]!, opts[i]!];
  }
  return opts;
}

export function QuizActivity({ deck, onExit }: { deck: FlashDeck; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  const card = deck.cards[index];
  const total = deck.cards.length;
  const finished = index >= total;
  const options = useMemo(() => (card ? buildOptions(deck.cards, card) : []), [deck.cards, card]);

  const choose = (option: string) => {
    if (selected || !card) return;
    setSelected(option);
    const correct = option === card.definition;
    const xp = correct ? 12 : 3;
    addXp(xp);
    addActivity(xp, 1, "vocabulary");
    if (correct) setScore((s) => s + 1);
  };

  if (finished || !card) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
        <p className="text-4xl font-extrabold tracking-tight text-primary">{score} / {total}</p>
        <p className="mt-2 text-muted-foreground">correct meanings. Nice work!</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onExit}>
            <ArrowLeft aria-hidden /> Levels
          </Button>
          <Button onClick={() => { setIndex(0); setScore(0); setSelected(null); }}>
            <RotateCcw aria-hidden /> Play again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Progress value={index} max={total} className="flex-1" label="Quiz progress" />
        <span className="text-sm font-bold text-muted-foreground tabular-nums">{index + 1} / {total}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card text-center shadow-soft">
        <CardArt card={card} bleed />
        <div className="p-6 text-center lg:p-8">
        <div className="flex flex-col items-center gap-3">
          <p className="text-3xl font-extrabold tracking-tight">{card.word}</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{card.phonetic}</span>
            <Button variant="ghost" size="icon" className="size-7" aria-label={`Listen to ${card.word}`} onClick={() => speak(card.word)}>
              <Volume2 aria-hidden />
            </Button>
          </div>
        </div>

        <p className="mt-5 text-sm font-semibold text-muted-foreground">Choose the correct meaning:</p>
        <div className="mt-3 grid gap-2.5 text-left sm:grid-cols-2">
          {options.map((option) => {
            const isCorrect = option === card.definition;
            const isSelected = option === selected;
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                disabled={selected !== null}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
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
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-muted p-4">
            <p className="text-left text-sm text-muted-foreground italic">“{card.example}”</p>
            <Button onClick={() => { setSelected(null); setIndex((i) => i + 1); }}>
              {index + 1 === total ? "Finish" : "Next"}
            </Button>
          </motion.div>
        )}
        </div>
      </div>
    </>
  );
}
