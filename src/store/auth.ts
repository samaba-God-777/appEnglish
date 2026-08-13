import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CefrLevel, UserProfile, UserRole } from "@/types";
import { currentUser } from "@/data/mock";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, role?: UserRole) => void;
  logout: () => void;
  syncSession: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<UserProfile, "name" | "avatarInitials" | "level" | "role">>) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  addDiamonds: (amount: number) => void;
}

const levelThresholds: Array<{ level: CefrLevel; nextAt: number }> = [
  { level: "A1", nextAt: 1000 },
  { level: "A2", nextAt: 2500 },
  { level: "B1", nextAt: 5000 },
  { level: "B2", nextAt: 9000 },
  { level: "C1", nextAt: 15000 },
];

export function levelForXp(xp: number): { level: CefrLevel; nextAt: number } {
  for (const threshold of levelThresholds) {
    if (xp < threshold.nextAt) return threshold;
  }
  const top = levelThresholds[levelThresholds.length - 1];
  return top ?? { level: "C1", nextAt: 15000 };
}

export function nextLevelLabel(level: CefrLevel): string {
  const order: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];
  const next = order[order.indexOf(level) + 1];
  return next ?? "C1+";
}

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => (part[0] ?? "").toUpperCase())
    .join("");
}

const TEACHER_ALLOWED_EMAILS = [
  "degraciawilliams10@gmail.com",
  "yoditamvale@gmail.com",
];

function freshProfile(email: string, name?: string, role: UserRole = "student"): UserProfile {
  const displayName = name?.trim() || email.split("@")[0] || "Learner";
  return {
    id: "u-local",
    name: displayName,
    email,
    avatarInitials: initialsFrom(displayName),
    role,
    level: "A1",
    xp: 0,
    xpToNextLevel: 1000,
    coins: 0,
    diamonds: 0,
    streakDays: 0,
    wordsLearned: 0,
    minutesStudiedToday: 0,
    pronunciationScore: 0,
    coursesCompleted: 0,
    certificates: 0,
    rank: 0,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, name, role) => set({ isAuthenticated: true, user: freshProfile(email, name, role) }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
      syncSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const email = session.user.email ?? "";
          const name = session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? email.split("@")[0];
          let role = (session.user.user_metadata?.role as UserRole) ?? "student";
          if (role === "teacher" && !TEACHER_ALLOWED_EMAILS.includes(email.toLowerCase())) {
            role = "student";
          }
          set({ isAuthenticated: true, user: freshProfile(email, name, role) });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
      updateProfile: (patch) =>
        set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
      addXp: (amount) =>
        set((state) => {
          if (!state.user) return state;
          const xp = state.user.xp + amount;
          const { level, nextAt } = levelForXp(xp);
          return { user: { ...state.user, xp, level, xpToNextLevel: nextAt } };
        }),
      addCoins: (amount) =>
        set((state) => (state.user ? { user: { ...state.user, coins: state.user.coins + amount } } : state)),
      addDiamonds: (amount) =>
        set((state) => (state.user ? { user: { ...state.user, diamonds: state.user.diamonds + amount } } : state)),
    }),
    {
      name: "englishai-auth",
      version: 2,
      migrate: (persisted) => {
        const old = persisted as { user?: { email?: string; name?: string } | null; isAuthenticated?: boolean };
        if (old?.isAuthenticated && old.user?.email) {
          return { isAuthenticated: true, user: freshProfile(old.user.email, old.user.name) };
        }
        return { user: null, isAuthenticated: false };
      },
    },
  ),
);

export function useUser(): UserProfile {
  return useAuthStore((s) => s.user) ?? currentUser;
}
