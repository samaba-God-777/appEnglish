import { create } from "zustand";
import { persist } from "zustand/middleware";
import { courses } from "@/data/mock";

interface ProgressState {
  /** Completed lesson count per course id. Every course starts at zero. */
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
          return {
            completedByCourse: {
              ...state.completedByCourse,
              [courseId]: Math.min(course.lessons, current + 1),
            },
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
      // v0 seeded demo progress from mock data; v1 starts every course at zero.
      migrate: () => ({ completedByCourse: { ...freshStart } }),
    },
  ),
);

export function useCourseProgress(courseId: string): number {
  return useProgressStore((s) => s.completedByCourse[courseId] ?? 0);
}
