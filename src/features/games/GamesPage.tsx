import { useState, type ComponentType } from "react";
import {
  Swords,
  SpellCheck,
  Brain,
  Keyboard,
  Blocks,
  Map,
  Shuffle,
  Quote,
  Ear,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { games } from "@/data/mock";
import { QuizBattle } from "./QuizBattle";
import { Hangman } from "./Hangman";
import { MemoryMatch } from "./MemoryMatch";
import { SentenceBuilder } from "./SentenceBuilder";
import { TypingRace } from "./TypingRace";
import { StoryAdventure } from "./StoryAdventure";
import { WordScramble } from "./WordScramble";
import { IdiomChallenge } from "./IdiomChallenge";
import { ListeningDictation } from "./ListeningDictation";

const icons: Record<string, LucideIcon> = { Swords, SpellCheck, Brain, Keyboard, Blocks, Map, Shuffle, Quote, Ear };

const difficultyVariant = { Easy: "success", Medium: "accent", Hard: "destructive" } as const;

/** Maps a game id to its playable component. Games without an entry show "Coming soon". */
const gameComponents: Record<string, ComponentType<{ onExit: () => void }>> = {
  "g-1": QuizBattle,
  "g-2": Hangman,
  "g-3": MemoryMatch,
  "g-4": TypingRace,
  "g-5": SentenceBuilder,
  "g-6": StoryAdventure,
  "g-7": WordScramble,
  "g-8": IdiomChallenge,
  "g-9": ListeningDictation,
};

export default function GamesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const ActiveGame = activeId ? gameComponents[activeId] : null;
  if (ActiveGame) {
    return (
      <div className="mx-auto max-w-3xl p-4 lg:p-8">
        <ActiveGame onExit={() => setActiveId(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <PageHeader title="Games" description="Learn while you play — every round earns XP and sharpens a skill." />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => {
          const Icon = icons[game.icon] ?? Swords;
          const playable = game.playable && game.id in gameComponents;
          return (
            <Card key={game.id} className="flex flex-col p-6 transition-shadow duration-200 hover:shadow-lifted">
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </div>
                <Badge variant={difficultyVariant[game.difficulty]}>{game.difficulty}</Badge>
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight">{game.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{game.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-accent">
                  <Zap className="size-3.5" aria-hidden /> up to {game.xpPerRound} XP / round
                </span>
                {playable ? (
                  <Button onClick={() => setActiveId(game.id)}>Play now</Button>
                ) : (
                  <Button variant="outline" disabled>
                    Coming soon
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
