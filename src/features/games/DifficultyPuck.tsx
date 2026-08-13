import { useState } from "react";
import { Gauge } from "lucide-react";
import type { CefrLevel } from "@/types";
import { useUser } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];

const isCefrLevel = (l: unknown): l is CefrLevel => CEFR_LEVELS.includes(l as CefrLevel);

/** Per-game manual difficulty: a CEFR band the learner picks, fed straight to AI generation. */
export function useGameDifficulty(): { level: CefrLevel; setLevel: (l: CefrLevel) => void } {
  const userLevel = useUser().level;
  const [level, setLevel] = useState<CefrLevel>(() => (isCefrLevel(userLevel) ? userLevel : "B1"));
  return { level, setLevel };
}

interface DifficultyPuckProps {
  level: CefrLevel;
  onSelect: (level: CefrLevel) => void;
  className?: string;
}

/** Compact A1–C1 difficulty picker. Changing it re-generates the round at that level. */
export function DifficultyPuck({ level, onSelect, className }: DifficultyPuckProps) {
  return (
    <div
      className={cn("flex items-center gap-1 rounded-xl border border-border bg-card p-1", className)}
      role="group"
      aria-label="AI difficulty"
      title="AI difficulty"
    >
      <Gauge className="mx-1 size-4 text-muted-foreground" aria-hidden />
      {CEFR_LEVELS.map((lvl) => (
        <Button
          key={lvl}
          type="button"
          size="sm"
          variant={lvl === level ? "accent" : "ghost"}
          onClick={() => onSelect(lvl)}
          aria-pressed={lvl === level}
          className="min-w-10 px-2"
        >
          {lvl}
        </Button>
      ))}
    </div>
  );
}