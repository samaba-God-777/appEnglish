import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from "@/store/auth";
import { useStatsStore, computeStreak } from "@/store/stats";
import { buildLeaderboard } from "@/lib/leaderboard";
import { cn } from "@/lib/cn";

export function MiniLeaderboard() {
  const user = useUser();
  const byDate = useStatsStore((s) => s.byDate);
  const streak = useMemo(() => computeStreak(byDate), [byDate]);
  const entries = useMemo(() => buildLeaderboard(user, streak), [user, streak]);

  const top = entries.slice(0, 3);
  const me = entries.find((e) => e.isCurrentUser);
  const rows = me && me.rank > 3 ? [...top, me] : top;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>This week's top learners</CardDescription>
        </div>
        <Link to="/leaderboard" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Full ranking <ArrowRight className="size-4" aria-hidden />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2",
              entry.isCurrentUser && "border border-primary/30 bg-primary/5",
            )}
          >
            <span className="w-6 text-sm font-extrabold text-muted-foreground tabular-nums">#{entry.rank}</span>
            <Avatar initials={entry.initials} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {entry.name}
                {entry.isCurrentUser && <span className="ml-1.5 text-xs font-bold text-primary">You</span>}
              </p>
            </div>
            <span className="text-sm font-bold text-primary tabular-nums">{entry.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
