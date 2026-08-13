import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mock";
import { useProgressStore } from "@/store/progress";

export function ContinueLearning() {
  const completedByCourse = useProgressStore((s) => s.completedByCourse);
  const inProgress = courses
    .filter((c) => {
      const completed = completedByCourse[c.id] ?? 0;
      return completed > 0 && completed < c.lessons;
    })
    .slice(0, 2);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Continue Learning</CardTitle>
          <CardDescription>Pick up where you left off</CardDescription>
        </div>
        <Link to="/courses" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          All courses <ArrowRight className="size-4" aria-hidden />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {inProgress.map((course) => {
          const completed = completedByCourse[course.id] ?? 0;
          const percent = Math.round((completed / course.lessons) * 100);
          return (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-muted"
            >
              <img
                src={course.image}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="size-14 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold">{course.title}</p>
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {completed} / {course.lessons} lessons · {percent}%
                </p>
                <Progress value={percent} className="mt-2 h-1.5" />
              </div>
              <PlayCircle className="size-6 shrink-0 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
