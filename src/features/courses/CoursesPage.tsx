import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mock";
import { useProgressStore } from "@/store/progress";
import { useAuthStore } from "@/store/auth";
import { fetchStudentAssignedCourseIds } from "@/lib/db";
import type { CefrLevel } from "@/types";
import { cn } from "@/lib/cn";

const levels: Array<CefrLevel | "All"> = ["All", "A1", "A2", "B1", "B2", "C1"];

export default function CoursesPage() {
  const [filter, setFilter] = useState<CefrLevel | "All">("All");
  const [assignedCourseIds, setAssignedCourseIds] = useState<string[] | null>(null);
  const completedByCourse = useProgressStore((s) => s.completedByCourse);
  const user = useAuthStore((s) => s.user);
  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    if (!isTeacher) {
      fetchStudentAssignedCourseIds().then((ids) => {
        setAssignedCourseIds(ids);
      });
    }
  }, [isTeacher]);

  const visible = (() => {
    let pool = courses;

    if (!isTeacher && assignedCourseIds !== null) {
      if (assignedCourseIds.length > 0) {
        pool = courses.filter((c) => assignedCourseIds.includes(c.id));
      }
    }

    return filter === "All" ? pool : pool.filter((c) => c.level === filter);
  })();

  const noAccess = !isTeacher && assignedCourseIds !== null && assignedCourseIds.length === 0;

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <PageHeader title="My Courses" description="Structured learning paths from A1 to C1, aligned with the CEFR." />

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by CEFR level">
        {levels.map((level) => (
          <button
            key={level}
            role="tab"
            aria-selected={filter === level}
            onClick={() => setFilter(level)}
            className={cn(
              "rounded-full border border-border px-4 py-1.5 text-sm font-semibold transition-colors duration-150",
              filter === level
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {level}
          </button>
        ))}
      </div>

      {noAccess ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted/50">
            <Lock className="size-8 text-muted-foreground/50" />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            No courses assigned yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Join a class with your teacher's code to access your courses.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((course, i) => {
            const completed = completedByCourse[course.id] ?? 0;
            const percent = Math.round((completed / course.lessons) * 100);
            const done = percent === 100;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link to={`/courses/${course.id}`} className="block h-full" aria-label={`Open ${course.title}`}>
                  <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-card/90 text-foreground backdrop-blur-sm">{course.level}</Badge>
                        {done && (
                          <Badge variant="success" className="bg-card/90 backdrop-blur-sm">
                            <CheckCircle2 className="size-3" aria-hidden /> Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-bold tracking-tight">{course.title}</h3>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground">{course.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3.5" aria-hidden />
                          {course.units} units · {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" aria-hidden />
                          {course.durationHours}h
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <Progress value={percent} className="flex-1" label={`${course.title} progress`} />
                        <span className="text-xs font-bold text-muted-foreground tabular-nums">{percent}%</span>
                      </div>
                      <span
                        className={cn(
                          "mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200",
                          done
                            ? "border border-border bg-card group-hover:bg-muted"
                            : "bg-primary text-primary-foreground shadow-soft group-hover:opacity-90",
                        )}
                      >
                        {done ? "Review course" : percent > 0 ? "Continue" : "Start course"}
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
