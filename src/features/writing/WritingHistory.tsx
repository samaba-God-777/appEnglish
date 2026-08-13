import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { History, Repeat, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { repeatedErrors, scoreHistory, useWritingStore } from "@/store/writing";
import { essayTypeName } from "./prompts";

export function WritingHistory() {
  const essays = useWritingStore((s) => s.essays);
  const points = useMemo(() => scoreHistory(essays), [essays]);
  const repeated = useMemo(() => repeatedErrors(essays), [essays]);

  if (essays.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      {points.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" aria-hidden /> Score progress
            </CardTitle>
            <CardDescription>Overall score of each reviewed essay</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--color-muted)" }}
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                    fontSize: 13,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {repeated.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="size-4 text-primary" aria-hidden /> Mistakes you repeat
            </CardTitle>
            <CardDescription>These appeared in more than one essay — focus here first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {repeated.map((e) => (
              <div key={`${e.wrong}-${e.right}`} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-destructive line-through">{e.wrong}</span>
                    {" → "}
                    <span className="font-semibold text-success">{e.right}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{e.explanation}</p>
                </div>
                <Badge variant="destructive">×{e.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-4 text-primary" aria-hidden /> Past essays ({essays.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {essays.slice(0, 8).map((essay) => (
            <div key={essay.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{essay.promptText}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(essay.date).toLocaleDateString()} · {essay.level} · {essayTypeName(essay.genre)} ·{" "}
                  {essay.text.trim().split(/\s+/).length} words
                </p>
              </div>
              <Badge variant={essay.review.scores.overall >= 90 ? "success" : essay.review.scores.overall >= 75 ? "accent" : "destructive"}>
                {essay.review.scores.overall}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
