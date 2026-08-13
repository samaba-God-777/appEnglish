import {
  Footprints,
  Flame,
  BookMarked,
  Mic,
  Trophy,
  GraduationCap,
  Moon,
  Crown,
  Lock,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { achievements } from "@/data/mock";
import { cn } from "@/lib/cn";

const icons: Record<string, LucideIcon> = {
  Footprints,
  Flame,
  BookMarked,
  Mic,
  Trophy,
  GraduationCap,
  Moon,
  Crown,
};

const rarityStyles = {
  common: "bg-secondary text-secondary-foreground",
  rare: "bg-chart-4/15 text-chart-4",
  epic: "bg-accent/15 text-accent",
  legendary: "bg-chart-5/15 text-chart-5",
} as const;

export default function AchievementsPage() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      <PageHeader
        title="Achievements"
        description={`${unlockedCount} of ${achievements.length} unlocked — keep going!`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {achievements.map((achievement) => {
          const Icon = icons[achievement.icon] ?? Trophy;
          const percent = Math.min(100, Math.round((achievement.progress / achievement.target) * 100));
          return (
            <Card
              key={achievement.id}
              className={cn(
                "flex flex-col p-5 transition-shadow duration-200 hover:shadow-lifted",
                !achievement.unlocked && "opacity-80",
              )}
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl",
                    achievement.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {achievement.unlocked ? <Icon className="size-6" aria-hidden /> : <Lock className="size-5" aria-hidden />}
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", rarityStyles[achievement.rarity])}>
                  {achievement.rarity}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold">{achievement.title}</h3>
              <p className="mt-0.5 flex-1 text-xs text-muted-foreground">{achievement.description}</p>
              <div className="mt-3">
                <Progress
                  value={percent}
                  className="h-1.5"
                  barClassName={achievement.unlocked ? "bg-success" : undefined}
                  label={`${achievement.title} progress`}
                />
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground tabular-nums">
                    {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                  </span>
                  <Badge variant="accent">
                    <Zap className="size-3" aria-hidden /> {achievement.xpReward} XP
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
