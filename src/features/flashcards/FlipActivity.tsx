import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ThumbsDown, ThumbsUp, Volume2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { speak } from "@/lib/speech";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import type { FlashDeck } from "./flashcard-decks";
import { CardArt } from "./CardArt";

export function FlipActivity({ deck, onExit }: { deck: FlashDeck; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  const card = deck.cards[index];
  const total = deck.cards.length;
  const finished = index >= total;

  const next = (wasKnown: boolean) => {
    const xp = wasKnown ? 10 : 4;
    addXp(xp);
    addActivity(xp, 1, "vocabulary");
    if (wasKnown) setKnown((k) => k + 1);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  if (finished || !card) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
        <p className="text-4xl font-extrabold tracking-tight text-primary">{known} / {total}</p>
        <p className="mt-2 text-muted-foreground">words you already knew. Keep practising the rest!</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onExit}>
            <ArrowLeft aria-hidden /> Levels
          </Button>
          <Button onClick={() => { setIndex(0); setKnown(0); setFlipped(false); }}>
            <RotateCcw aria-hidden /> Study again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Progress value={index} max={total} className="flex-1" label="Session progress" />
        <span className="text-sm font-bold text-muted-foreground tabular-nums">{index} / {total}</span>
      </div>

      <div className="[perspective:1200px]">
        <AnimatePresence mode="wait">
          <motion.button
            key={`${card.id}-${flipped}`}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? "Show word" : "Show definition"}
            className="flex min-h-72 w-full flex-col items-stretch overflow-hidden rounded-2xl border border-border bg-card text-center shadow-lifted"
          >
            {flipped ? (
              <div className="flex flex-col items-center justify-center gap-3 px-8 py-8">
                <Badge variant="secondary">{card.partOfSpeech}</Badge>
                <p className="max-w-md text-xl font-semibold">{card.definition}</p>
                <p className="text-sm text-muted-foreground italic">“{card.example}”</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <Badge variant="accent">{card.translation}</Badge>
                  {card.synonyms.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <CardArt card={card} bleed />
                <div className="flex flex-col items-center gap-3 px-8 pb-8 pt-5">
                  <Badge>{deck.level}</Badge>
                  <p className="text-4xl font-extrabold tracking-tight">{card.word}</p>
                  <p className="text-muted-foreground">{card.phonetic}</p>
                  <span className="text-xs text-muted-foreground">Tap card to flip</span>
                </div>
              </>
            )}
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="outline" size="lg" onClick={() => next(false)}>
          <ThumbsDown aria-hidden /> Still learning
        </Button>
        <Button variant="ghost" size="icon" aria-label={`Listen to ${card.word}`} onClick={() => speak(card.word)}>
          <Volume2 aria-hidden />
        </Button>
        <Button size="lg" onClick={() => next(true)}>
          <ThumbsUp aria-hidden /> I knew it
        </Button>
      </div>
    </>
  );
}
