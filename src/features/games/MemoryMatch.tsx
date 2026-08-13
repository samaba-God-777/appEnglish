import { useEffect, useMemo, useState } from "react";
import { RotateCcw, X, Clock, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { gameWordPairs, shuffle, type WordPair } from "./game-content";
import { useAiContent, AiLoadingShell } from "./useAiContent";
import { DifficultyPuck, useGameDifficulty } from "./DifficultyPuck";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";

const PAIRS = 6;

interface Tile {
  id: string;
  pairId: number;
  text: string;
  kind: "word" | "meaning";
}

function buildTiles(pairs: WordPair[], seed: number): Tile[] {
  const chosen = shuffle(pairs, seed).slice(0, PAIRS);
  const tiles: Tile[] = [];
  chosen.forEach((p, i) => {
    tiles.push({ id: `w-${i}`, pairId: i, text: p.word, kind: "word" });
    tiles.push({ id: `m-${i}`, pairId: i, text: p.meaning, kind: "meaning" });
  });
  return shuffle(tiles, seed + 100);
}

export function MemoryMatch({ onExit }: { onExit: () => void }) {
  const { level: diffLevel, setLevel } = useGameDifficulty();
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000));
  const { items, status, refresh } = useAiContent<WordPair>("memory-match", gameWordPairs, { count: PAIRS, level: diffLevel });
  const tiles = useMemo(() => buildTiles(items, seed), [items, seed]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);
  const [awarded, setAwarded] = useState(false);

  const done = matched.size === PAIRS;

  useEffect(() => {
    if (done) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => {
    if (done && !awarded) {
      setAwarded(true);
      const xp = Math.max(30, 90 - moves * 2);
      addXp(xp);
      addActivity(xp, 2, "vocabulary");
    }
  }, [done, awarded, moves, addXp, addActivity]);

  if (status === "loading") {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6"><AiLoadingShell /></CardContent>
      </Card>
    );
  }

  const clickTile = (tile: Tile) => {
    if (matched.has(tile.pairId) || flipped.includes(tile.id) || flipped.length === 2) return;
    const next = [...flipped, tile.id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((id) => tiles.find((t) => t.id === id)!);
      if (a && b && a.pairId === b.pairId) {
        setMatched((prev) => new Set(prev).add(a.pairId));
        setFlipped([]);
      } else {
        window.setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const restart = () => {
    refresh();
    setSeed(Math.floor(Math.random() * 1000));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setSeconds(0);
    setAwarded(false);
  };

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit game">
            <X aria-hidden />
          </Button>
          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 tabular-nums">
              <Clock className="size-4" aria-hidden /> {seconds}s
            </span>
            <span className="tabular-nums">{moves} moves</span>
            <Badge variant="secondary">{matched.size}/{PAIRS}</Badge>
            {status === "ai" && <Badge variant="accent">AI</Badge>}
          </div>
          <DifficultyPuck level={diffLevel} onSelect={setLevel} className="ml-auto" />
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Trophy className="size-10 text-accent" aria-hidden />
            <p className="text-2xl font-extrabold tracking-tight">All matched!</p>
            <p className="text-sm text-muted-foreground">
              {moves} moves in {seconds}s · <span className="font-bold text-accent">+{Math.max(30, 90 - moves * 2)} XP</span>
            </p>
            <div className="mt-2 flex gap-3">
              <Button variant="outline" onClick={onExit}>
                <X aria-hidden /> Exit
              </Button>
              <Button onClick={restart}>
                <RotateCcw aria-hidden /> Play again
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {tiles.map((tile) => {
              const isOpen = flipped.includes(tile.id) || matched.has(tile.pairId);
              return (
                <button
                  key={tile.id}
                  onClick={() => clickTile(tile)}
                  disabled={matched.has(tile.pairId)}
                  className={cn(
                    "flex min-h-20 items-center justify-center rounded-xl border p-3 text-center text-sm transition-all duration-200",
                    matched.has(tile.pairId) && "border-success bg-success/10 text-success",
                    !matched.has(tile.pairId) && isOpen && "border-primary bg-primary/5",
                    !isOpen && "border-border bg-muted hover:bg-muted/70",
                  )}
                >
                  {isOpen ? (
                    <span className={cn(tile.kind === "word" ? "font-extrabold" : "font-medium")}>{tile.text}</span>
                  ) : (
                    <span className="text-2xl text-muted-foreground">?</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
