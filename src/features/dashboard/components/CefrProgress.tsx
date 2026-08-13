import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/data/mock";
import { useProgressStore } from "@/store/progress";
import { useUser } from "@/store/auth";
import type { CefrLevel } from "@/types";

const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export function CefrProgress() {
  const completedByCourse = useProgressStore((s) => s.completedByCourse);
  const user = useUser();

  const rows = useMemo(
    () =>
      levels.map((level) => {
        const levelCourses = courses.filter((c) => c.level === level);
        const total = levelCourses.reduce((sum, c) => sum + c.lessons, 0);
        const done = levelCourses.reduce((sum, c) => sum + (completedByCourse[c.id] ?? 0), 0);
        return { level, progress: total === 0 ? 0 : Math.round((done / total) * 100) };
      }),
    [completedByCourse],
  );

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>CEFR Journey</CardTitle>
          <CardDescription>From beginner to advanced mastery</CardDescription>
        </div>
        <Badge>Current: {user.level}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map(({ level, progress }) => (
          <div key={level} className="flex items-center gap-4">
            <span className="w-8 text-sm font-bold tabular-nums">{level}</span>
            <Progress value={progress} label={`${level} progress`} className="flex-1" />
            <span className="w-10 text-right text-xs font-semibold text-muted-foreground tabular-nums">
              {progress}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
