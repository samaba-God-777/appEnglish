import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, ListChecks, Keyboard, ArrowLeft, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { flashDecks, flashLevels, levelMeta, getDeck, type FlashLevel } from "./flashcard-decks";
import { FlipActivity } from "./FlipActivity";
import { QuizActivity } from "./QuizActivity";
import { SpellActivity } from "./SpellActivity";

type ActivityId = "flip" | "quiz" | "spell";

const activities: { id: ActivityId; label: string; description: string; icon: LucideIcon }[] = [
  { id: "flip", label: "Flip cards", description: "See the word, recall the meaning, rate yourself.", icon: Layers },
  { id: "quiz", label: "Meaning quiz", description: "Pick the correct definition from four options.", icon: ListChecks },
  { id: "spell", label: "Spell it", description: "Read the meaning and type the word from memory.", icon: Keyboard },
];

export default function FlashcardsPage() {
  const [activity, setActivity] = useState<ActivityId>("flip");
  const [level, setLevel] = useState<FlashLevel | null>(null);

  const deck = level ? getDeck(level) : undefined;

  if (deck && level) {
    const activityMeta = activities.find((a) => a.id === activity)!;
    return (
      <div className="mx-auto max-w-3xl p-4 lg:p-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setLevel(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Levels
          </button>
          <div className="flex items-center gap-2">
            <Badge>{level}</Badge>
            <Badge variant="secondary">{activityMeta.label}</Badge>
          </div>
        </div>

        {activity === "flip" && <FlipActivity deck={deck} onExit={() => setLevel(null)} />}
        {activity === "quiz" && <QuizActivity deck={deck} onExit={() => setLevel(null)} />}
        {activity === "spell" && <SpellActivity deck={deck} onExit={() => setLevel(null)} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-8">
      <PageHeader
        title="Flashcards"
        description="Six decks from A1 to C2, three ways to practise. Pick an activity, then a level."
      />

      {/* Activity picker */}
      <div className="mb-8 grid gap-3 md:grid-cols-3">
        {activities.map((a) => (
          <button
            key={a.id}
            onClick={() => setActivity(a.id)}
            aria-pressed={activity === a.id}
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-150",
              activity === a.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted",
            )}
          >
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", activity === a.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              <a.icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold">{a.label}</span>
              <span className="block text-xs text-muted-foreground">{a.description}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Level picker */}
      <h2 className="mb-3 text-sm font-bold tracking-widest text-muted-foreground uppercase">Choose a level</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flashLevels.map((lvl, i) => {
          const meta = levelMeta[lvl];
          const count = flashDecks.find((d) => d.level === lvl)?.cards.length ?? 0;
          return (
            <motion.button
              key={lvl}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              onClick={() => setLevel(lvl)}
              className="group text-left"
            >
              <Card className="h-full overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted">
                <div className="flex items-center justify-between">
                  <span className={cn("flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-extrabold text-white", meta.color)}>
                    {lvl}
                  </span>
                  <Badge variant="secondary">{count} cards</Badge>
                </div>
                <h3 className="mt-3 text-base font-bold tracking-tight">{meta.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{meta.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-primary group-hover:underline">
                  Start {activities.find((a) => a.id === activity)!.label} →
                </span>
              </Card>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
