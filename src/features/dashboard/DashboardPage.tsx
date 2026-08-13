import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Flame, BookMarked, Mic, Zap, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/store/auth";
import { nextLevelLabel } from "@/store/auth";
import { useStatsStore, computeStreak, dateKey } from "@/store/stats";
import { useMasteredCount } from "@/store/vocab";
import { userRank } from "@/lib/leaderboard";
import { StatCard } from "./components/StatCard";
import { WeeklyActivityChart } from "./components/WeeklyActivityChart";
import { SkillsRadar } from "./components/SkillsRadar";
import { CefrProgress } from "./components/CefrProgress";
import { StudyHeatmap } from "./components/StudyHeatmap";
import { ContinueLearning } from "./components/ContinueLearning";
import { MiniLeaderboard } from "./components/MiniLeaderboard";

export default function DashboardPage() {
  const user = useUser();
  const byDate = useStatsStore((s) => s.byDate);
  const pronunciation = useStatsStore((s) => s.pronunciationScore);
  const mastered = useMasteredCount();

  const streak = useMemo(() => computeStreak(byDate), [byDate]);
  const minutesToday = byDate[dateKey()]?.minutes ?? 0;
  const rank = useMemo(() => userRank(user, streak), [user, streak]);
  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));
  const nextLevel = nextLevelLabel(user.level);

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]} 👋`}
        description={
          user.xp === 0
            ? "Your journey starts here — complete a lesson to earn your first XP."
            : "Keep the momentum going and push toward the next level."
        }
        actions={
          <Link
            to="/courses"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground shadow-soft transition-all duration-200 hover:opacity-90 active:scale-[0.98] max-sm:hidden"
          >
            {user.xp === 0 ? "Start learning" : "Resume lesson"}
          </Link>
        }
      />

      <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">
              Level {user.level} · {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
            </p>
            <p className="text-xs text-muted-foreground">
              {(user.xpToNextLevel - user.xp).toLocaleString()} XP to reach {nextLevel}
            </p>
          </div>
          <span className="text-sm font-extrabold text-primary tabular-nums">{xpPercent}%</span>
        </div>
        <Progress value={xpPercent} className="mt-3 h-2.5" label="XP progress to next level" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Time Today"
          value={`${minutesToday}m`}
          sublabel="Goal: 30 minutes"
          icon={Clock}
          delay={0}
          to="/courses"
        />
        <StatCard
          label="Streak"
          value={`${streak} ${streak === 1 ? "day" : "days"}`}
          sublabel={streak === 0 ? "Study today to start" : "Keep it alive!"}
          icon={Flame}
          iconClassName="bg-accent/15 text-accent"
          delay={0.05}
          to="/achievements"
        />
        <StatCard
          label="Words Learned"
          value={mastered.toLocaleString()}
          sublabel="Practice flashcards"
          icon={BookMarked}
          delay={0.1}
          to="/vocabulary"
        />
        <StatCard
          label="Pronunciation"
          value={pronunciation === 0 ? "—" : `${pronunciation}%`}
          sublabel={pronunciation === 0 ? "Try the Speaking Lab" : "Latest score"}
          icon={Mic}
          delay={0.15}
          to="/speaking"
        />
        <StatCard
          label="Total XP"
          value={user.xp.toLocaleString()}
          sublabel={`Level ${user.level}`}
          icon={Zap}
          iconClassName="bg-accent/15 text-accent"
          delay={0.2}
          to="/leaderboard"
        />
        <StatCard
          label="Ranking"
          value={rank === 0 ? "—" : `#${rank}`}
          sublabel="Emerald League"
          icon={Trophy}
          delay={0.25}
          to="/leaderboard"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <WeeklyActivityChart />
        <SkillsRadar />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <CefrProgress />
        <ContinueLearning />
        <MiniLeaderboard />
      </div>

      <div className="mt-6">
        <StudyHeatmap />
      </div>
    </div>
  );
}
