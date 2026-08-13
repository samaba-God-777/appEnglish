import { create } from "zustand";
import { persist } from "zustand/middleware";
import { courses } from "@/data/mock";
import { upsertCourseProgress } from "@/lib/db";

interface ProgressState {
  completedByCourse: Record<string, number>;
  completeLesson: (courseId: string) => void;
  resetCourse: (courseId: string) => void;
}

const freshStart: Record<string, number> = Object.fromEntries(courses.map((course) => [course.id, 0]));

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedByCourse: { ...freshStart },
      completeLesson: (courseId) =>
        set((state) => {
          const course = courses.find((c) => c.id === courseId);
          if (!course) return state;
          const current = state.completedByCourse[courseId] ?? 0;
          const next = Math.min(course.lessons, current + 1);
          // Sync to Supabase (fire-and-forget)
          upsertCourseProgress(courseId, next, course.lessons);
          return {
            completedByCourse: { ...state.completedByCourse, [courseId]: next },
          };
        }),
      resetCourse: (courseId) =>
        set((state) => ({
          completedByCourse: { ...state.completedByCourse, [courseId]: 0 },
        })),
    }),
    {
      name: "englishai-progress",
      version: 1,
      migrate: () => ({ completedByCourse: { ...freshStart } }),
    },
  ),
);

export function useCourseProgress(courseId: string): number {
  return useProgressStore((s) => s.completedByCourse[courseId] ?? 0);
}
