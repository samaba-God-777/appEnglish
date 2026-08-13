import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatsStore, skillScore } from "@/store/stats";

const skillLabels = {
  listening: "Listening",
  speaking: "Speaking",
  reading: "Reading",
  writing: "Writing",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
} as const;

export function SkillsRadar() {
  const skillXp = useStatsStore((s) => s.skillXp);
  const data = useMemo(
    () =>
      (Object.keys(skillLabels) as Array<keyof typeof skillLabels>).map((key) => ({
        skill: skillLabels[key],
        score: skillScore(skillXp[key]),
      })),
    [skillXp],
  );
  const hasProgress = data.some((d) => d.score > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Radar</CardTitle>
        <CardDescription>
          {hasProgress ? "Your strengths across the six core skills" : "Practice each skill to grow your radar"}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                color: "var(--color-popover-foreground)",
                fontSize: 13,
              }}
            />
            <Radar name="Score" dataKey="score" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.25} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
