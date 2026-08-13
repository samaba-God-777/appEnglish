import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  Clock,
  Headphones,
  Lock,
  Mic,
  PenLine,
  Play,
  BookText,
  RotateCcw,
  SpellCheck2,
  Swords,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/mock";
import { useProgressStore, useCourseProgress } from "@/store/progress";
import { useAuthStore } from "@/store/auth";
import { useStatsStore } from "@/store/stats";
import { cn } from "@/lib/cn";
import { buildCourseUnits, type Lesson, type LessonType } from "./course-content";
import { LessonPlayer } from "./LessonPlayer";

const typeIcons: Record<LessonType, LucideIcon> = {
  vocabulary: BookMarked,
  grammar: SpellCheck2,
  listening: Headphones,
  speaking: Mic,
  reading: BookText,
  writing: PenLine,
  quiz: Swords,
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courses.find((c) => c.id === courseId);

  const completed = useCourseProgress(courseId ?? "");
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const resetCourse = useProgressStore((s) => s.resetCourse);
  const addXp = useAuthStore((s) => s.addXp);
  const addActivity = useStatsStore((s) => s.addActivity);

  const units = useMemo(() => (course ? buildCourseUnits(course) : []), [course]);

  const currentUnitNumber = useMemo(() => {
    const unit = units.find((u) => u.lessons.some((l) => l.index === completed));
    return unit?.number ?? units[0]?.number ?? 1;
  }, [units, completed]);

  const [openUnits, setOpenUnits] = useState<Set<number>>(() => new Set([currentUnitNumber]));
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!course) return <Navigate to="/courses" replace />;

  const percent = Math.round((completed / course.lessons) * 100);
  const allLessons = units.flatMap((u) => u.lessons);
  const nextLesson = allLessons.find((l) => l.index === completed) ?? null;
  const firstLesson = allLessons[0] ?? null;
  const isReviewing = activeLesson !== null && activeLesson.index < completed;

  const toggleUnit = (number: number) =>
    setOpenUnits((prev) => {
      const next = new Set(prev);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      return next;
    });

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-8">
      <Link
        to="/courses"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All courses
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="relative h-44 lg:h-56">
          <img src={course.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden />
          <div className="absolute right-5 bottom-4 left-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Badge className="bg-white/90 text-slate-900">{course.level}</Badge>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
                {course.title}
              </h1>
            </div>
            {nextLesson ? (
              <Button size="lg" onClick={() => setActiveLesson(nextLesson)}>
                <Play aria-hidden /> {completed === 0 ? "Start course" : "Continue"}
              </Button>
            ) : (
              firstLesson && (
                <Button size="lg" variant="secondary" onClick={() => setActiveLesson(firstLesson)}>
                  <Play aria-hidden /> Review course
                </Button>
              )
            )}
          </div>
        </div>

        <div className="p-5 lg:p-6">
          <p className="text-sm text-muted-foreground">{course.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookMarked className="size-3.5" aria-hidden /> {course.units} units · {course.lessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> {course.durationHours}h total
            </span>
            <span className="flex items-center gap-1 font-semibold text-success">
              <CheckCircle2 className="size-3.5" aria-hidden /> {completed} completed
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={percent} className="h-2.5 flex-1" label="Course progress" />
            <span className="text-sm font-extrabold text-primary tabular-nums">{percent}%</span>
          </div>

          {completed > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {confirmingReset ? (
                <>
                  <span className="text-xs font-semibold text-destructive">
                    Reset all progress in this course?
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      resetCourse(course.id);
                      setConfirmingReset(false);
                      setOpenUnits(new Set([1]));
                    }}
                  >
                    Yes, start over
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmingReset(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setConfirmingReset(true)}>
                  <RotateCcw aria-hidden /> Start over
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {units.map((unit) => {
          const unitDone = unit.lessons.every((l) => l.index < completed);
          const unitLocked = unit.lessons[0] !== undefined && unit.lessons[0].index > completed;
          const open = openUnits.has(unit.number);
          const doneInUnit = unit.lessons.filter((l) => l.index < completed).length;

          return (
            <div key={unit.number} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <button
                onClick={() => toggleUnit(unit.number)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                    unitDone ? "bg-success/10 text-success" : unitLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                  )}
                >
                  {unitDone ? <CheckCircle2 className="size-5" aria-hidden /> : unit.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{unit.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {doneInUnit}/{unit.lessons.length} lessons
                  </span>
                </span>
                {unitLocked && <Lock className="size-4 text-muted-foreground" aria-label="Locked unit" />}
                <ChevronDown
                  className={cn("size-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
                  aria-hidden
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border"
                  >
                    {unit.lessons.map((lesson) => {
                      const done = lesson.index < completed;
                      const isNext = lesson.index === completed;
                      const locked = lesson.index > completed;
                      const Icon = typeIcons[lesson.type];

                      return (
                        <li key={lesson.index}>
                          <button
                            onClick={() => !locked && setActiveLesson(lesson)}
                            disabled={locked}
                            title={done ? "Review this lesson" : undefined}
                            className={cn(
                              "flex w-full items-center gap-3 px-5 py-3 text-left",
                              isNext && "bg-primary/5 transition-colors hover:bg-primary/10",
                              done && "transition-colors hover:bg-muted",
                              locked && "opacity-50",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                                done ? "bg-success/10 text-success" : isNext ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                              )}
                            >
                              {done ? (
                                <CheckCircle2 className="size-4" aria-hidden />
                              ) : locked ? (
                                <Lock className="size-3.5" aria-hidden />
                              ) : (
                                <Icon className="size-4" aria-hidden />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={cn("block truncate text-sm font-semibold", done && "text-muted-foreground")}>
                                {lesson.title}
                              </span>
                              <span className="block text-xs text-muted-foreground capitalize">
                                {lesson.type} · {lesson.minutes} min{done ? " · tap to review" : ""}
                              </span>
                            </span>
                            <span className="flex items-center gap-1 text-xs font-bold text-accent">
                              <Zap className="size-3.5" aria-hidden /> {lesson.xp}
                            </span>
                            {isNext && <Badge>Next</Badge>}
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {activeLesson && (
        <LessonPlayer
          courseTitle={course.title}
          lesson={activeLesson}
          isReview={isReviewing}
          onClose={() => setActiveLesson(null)}
          onComplete={(xp) => {
            completeLesson(course.id);
            addXp(xp);
            addActivity(xp, activeLesson.minutes, activeLesson.type === "quiz" ? undefined : activeLesson.type);
          }}
        />
      )}
    </div>
  );
}
