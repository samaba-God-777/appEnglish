import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatsStore, dateKey, heatmapLevelForXp } from "@/store/stats";
import { cn } from "@/lib/cn";

const WEEKS = 16;

const intensityClasses = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
] as const;

export function StudyHeatmap() {
  const byDate = useStatsStore((s) => s.byDate);

  const grid = useMemo(() => {
    // Columns are weeks (oldest first); each column has 7 days ending today.
    const days: number[] = [];
    for (let i = WEEKS * 7 - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(heatmapLevelForXp(byDate[dateKey(date)]?.xp ?? 0));
    }
    return Array.from({ length: WEEKS }, (_, w) => days.slice(w * 7, w * 7 + 7));
  }, [byDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Heatmap</CardTitle>
        <CardDescription>Daily XP over the last {WEEKS} weeks — one square per day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-1" role="img" aria-label="Study activity heatmap">
          {grid.map((week, w) => (
            <div key={w} className="flex flex-col gap-1">
              {week.map((level, d) => (
                <div key={d} className={cn("size-3.5 rounded-[4px]", intensityClasses[level])} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
          Less
          {intensityClasses.map((cls) => (
            <span key={cls} className={cn("size-3 rounded-[4px]", cls)} />
          ))}
          More
        </div>
      </CardContent>
    </Card>
  );
}
