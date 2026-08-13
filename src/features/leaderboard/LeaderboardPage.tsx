import { useMemo } from "react";
import { Flame, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/auth";
import { useStatsStore, computeStreak } from "@/store/stats";
import { buildLeaderboard } from "@/lib/leaderboard";
import { cn } from "@/lib/cn";

const medalColors = ["text-amber-400", "text-slate-400", "text-amber-700"] as const;

export default function LeaderboardPage() {
  const user = useUser();
  const byDate = useStatsStore((s) => s.byDate);
  const streak = useMemo(() => computeStreak(byDate), [byDate]);
  const leaderboard = useMemo(() => buildLeaderboard(user, streak), [user, streak]);

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <PageHeader title="Leaderboard" description="Emerald League · resets every Monday · top 5 advance to Diamond" />

      <Card className="overflow-hidden">
        <ul>
          {leaderboard.map((entry) => (
            <li
              key={entry.rank}
              className={cn(
                "flex items-center gap-4 border-b border-border px-5 py-3.5 last:border-b-0",
                entry.isCurrentUser && "bg-primary/5",
              )}
            >
              <span className="flex w-8 items-center justify-center">
                {entry.rank <= 3 ? (
                  <Trophy className={cn("size-5", medalColors[entry.rank - 1])} aria-label={`Rank ${entry.rank}`} />
                ) : (
                  <span className="text-sm font-extrabold text-muted-foreground tabular-nums">{entry.rank}</span>
                )}
              </span>
              <Avatar initials={entry.initials} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  <span aria-hidden className="mr-1.5">{entry.country}</span>
                  {entry.name}
                  {entry.isCurrentUser && <span className="ml-2 text-xs font-bold text-primary">You</span>}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="size-3 text-accent" aria-hidden />
                  {entry.streak} day streak
                </p>
              </div>
              <Badge variant="secondary">{entry.level}</Badge>
              <span className="w-24 text-right text-sm font-bold text-primary tabular-nums">
                {entry.xp.toLocaleString()} XP
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
