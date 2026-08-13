import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, RotateCcw, ChevronRight, MapPin, Sparkles, PartyPopper, Meh } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { speak } from "@/lib/speech";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { storyNodes, storyStart, endingXp, type Ending, type StoryNode } from "./story-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";

const endingMeta: Record<Ending, { label: string; icon: typeof PartyPopper; className: string }> = {
  great: { label: "Best ending!", icon: PartyPopper, className: "text-success" },
  good: { label: "Good ending", icon: Sparkles, className: "text-primary" },
  bad: { label: "You'll do better next time", icon: Meh, className: "text-warning" },
};

/** Raw story node the AI returns: prose + a list of choice labels. */
interface RawStoryItem {
  text: string;
  choices: string[];
}

/** Lay the static branching story out as a raw sequence so it doubles as the AI fallback. */
function storyToRaw(nodes: Record<string, StoryNode>): RawStoryItem[] {
  return Object.values(nodes).map((n) => ({ text: n.text, choices: n.choices.map((c) => c.label) }));
}

const fallbackStory = storyToRaw(storyNodes);

export function StoryAdventure({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const { items, status, refresh } = useAiContent<RawStoryItem>("story", fallbackStory, { count: 8, level: diffLevel });
  const isGenerated = status === "ai" && items.length > 0;

  // The AI returns a linear chain; the last node is the ending. Map it back onto the
  // existing graph engine (Record of StoryNode) so the player logic is untouched.
  const graph: Record<string, StoryNode> = useMemo(() => {
    if (!isGenerated) return storyNodes;
    const rec: Record<string, StoryNode> = {};
    items.forEach((it, i) => {
      const id = `n${i}`;
      const isLast = i === items.length - 1;
      rec[id] = {
        id,
        text: it.text,
        choices: isLast ? [] : it.choices.map((label) => ({ label, next: `n${i + 1}` })),
        ending: isLast ? "great" : undefined,
      };
    });
    return rec;
  }, [isGenerated, items]);

  const startId = isGenerated ? "n0" : storyStart;
  const [nodeId, setNodeId] = useState(startId);
  const [steps, setSteps] = useState(0);
  const [awarded, setAwarded] = useState(false);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  // When a fresh AI story arrives, restart the walk from its first node.
  useEffect(() => {
    if (isGenerated) {
      setNodeId("n0");
      setSteps(0);
      setAwarded(false);
    }
  }, [isGenerated]);

  // Award XP once when the player lands on an ending node. Kept in an effect
  // (not the render body) to avoid "Cannot update a component while rendering".
  useEffect(() => {
    const n = graph[nodeId];
    if (n?.ending !== undefined && !awarded) {
      setAwarded(true);
      const xp = endingXp[n.ending];
      addXp(xp);
      addActivity(xp, 4, "reading");
    }
  }, [graph, nodeId, awarded, addXp, addActivity]);

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell label="Writing your story…" /></CardContent>
      </Card>
    );
  }

  const node = graph[nodeId];
  if (!node) return null;
  const isEnding = node.ending !== undefined;

  const choose = (next: string) => {
    setSteps((s) => s + 1);
    setNodeId(next);
  };

  const restart = () => {
    refresh();
    setNodeId(startId);
    setSteps(0);
    setAwarded(false);
  };

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit game">
            <X aria-hidden />
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <MapPin className="size-3.5" aria-hidden /> London Adventure
            </Badge>
            <Badge variant="outline">Step {steps + 1}</Badge>
            {status === "ai" && <Badge variant="accent">AI</Badge>}
          </div>
          <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        <motion.div
          key={nodeId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isEnding && node.ending ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              {(() => {
                const meta = endingMeta[node.ending];
                const Icon = meta.icon;
                return (
                  <>
                    <span className={`flex size-16 items-center justify-center rounded-full bg-muted ${meta.className}`}>
                      <Icon className="size-8" aria-hidden />
                    </span>
                    <p className={`text-lg font-extrabold tracking-tight ${meta.className}`}>{meta.label}</p>
                  </>
                );
              })()}
              <p className="max-w-lg leading-relaxed text-muted-foreground">{node.text}</p>
              <Badge variant="accent" className="text-sm">
                <Sparkles className="size-4" aria-hidden /> +{endingXp[node.ending]} XP · reached in {steps} choices
              </Badge>
              <div className="mt-3 flex gap-3">
                <Button variant="outline" onClick={onExit}>
                  <X aria-hidden /> Exit
                </Button>
                <Button onClick={restart}>
                  <RotateCcw aria-hidden /> Play again
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => speak(node.text)}
                className="w-full rounded-xl bg-muted p-5 text-left text-lg leading-relaxed transition-colors hover:bg-muted/70"
                aria-label="Read the story aloud"
                title="Tap to hear it read aloud"
              >
                {node.text}
              </button>
              <div className="mt-5 space-y-2.5">
                {node.choices.map((choice) => (
                  <button
                    key={choice.next}
                    onClick={() => choose(choice.next)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5"
                  >
                    {choice.label}
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}