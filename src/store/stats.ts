import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SkillKey } from "@/types";
import { upsertDailyActivity, upsertSkillXp } from "@/lib/db";

interface DayActivity {
  xp: number;
  minutes: number;
}

interface StatsState {
  byDate: Record<string, DayActivity>;
  skillXp: Record<SkillKey, number>;
  pronunciationScore: number;
  addActivity: (xp: number, minutes: number, skill?: SkillKey) => void;
  setPronunciation: (score: number) => void;
}

const emptySkills: Record<SkillKey, number> = {
  listening: 0,
  speaking: 0,
  reading: 0,
  writing: 0,
  grammar: 0,
  vocabulary: 0,
};

export function dateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      byDate: {},
      skillXp: { ...emptySkills },
      pronunciationScore: 0,
      addActivity: (xp, minutes, skill) =>
        set((state) => {
          const key = dateKey();
          const day = state.byDate[key] ?? { xp: 0, minutes: 0 };
          // Sync to Supabase (fire-and-forget)
          upsertDailyActivity(xp, minutes);
          if (skill) upsertSkillXp(skill, state.skillXp[skill] + xp);
          return {
            byDate: { ...state.byDate, [key]: { xp: day.xp + xp, minutes: day.minutes + minutes } },
            skillXp: skill ? { ...state.skillXp, [skill]: state.skillXp[skill] + xp } : state.skillXp,
          };
        }),
      setPronunciation: (score) => set({ pronunciationScore: score }),
    }),
    { name: "englishai-stats", version: 1, migrate: () => undefined },
  ),
);

export function computeStreak(byDate: Record<string, DayActivity>): number {
  let streak = 0;
  const cursor = new Date();
  if (!byDate[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  while (byDate[dateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface DayPoint {
  day: string;
  date: string;
  minutes: number;
  xp: number;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function lastNDays(byDate: Record<string, DayActivity>, n: number): DayPoint[] {
  const points: DayPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dateKey(date);
    const activity = byDate[key] ?? { xp: 0, minutes: 0 };
    points.push({
      day: dayNames[date.getDay()] ?? "",
      date: key,
      minutes: activity.minutes,
      xp: activity.xp,
    });
  }
  return points;
}

export function heatmapLevelForXp(xp: number): number {
  if (xp <= 0) return 0;
  if (xp < 30) return 1;
  if (xp < 60) return 2;
  if (xp < 100) return 3;
  return 4;
}

export function skillScore(xp: number): number {
  return Math.min(100, Math.round(xp / 5));
}
