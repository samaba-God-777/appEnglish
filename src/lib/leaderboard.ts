import { leaderboard } from "@/data/mock";
import type { LeaderboardEntry, UserProfile } from "@/types";

/** Merges the session user into the demo league and recomputes ranks by XP. */
export function buildLeaderboard(user: UserProfile, userStreak: number): LeaderboardEntry[] {
  const others = leaderboard.filter((entry) => !entry.isCurrentUser);
  const mine: LeaderboardEntry = {
    rank: 0,
    name: user.name,
    initials: user.avatarInitials,
    xp: user.xp,
    streak: userStreak,
    level: user.level,
    country: "🌎",
    isCurrentUser: true,
  };
  return [...others, mine]
    .sort((a, b) => b.xp - a.xp)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function userRank(user: UserProfile, userStreak: number): number {
  return buildLeaderboard(user, userStreak).find((e) => e.isCurrentUser)?.rank ?? 0;
}
