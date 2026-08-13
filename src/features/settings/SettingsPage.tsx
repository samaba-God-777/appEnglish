import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/theme";
import { useAuthStore, useUser } from "@/store/auth";
import { cn } from "@/lib/cn";
import { Check, Clock, Flame, Pencil, Sparkles, X } from "lucide-react";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

const LEVEL_LABELS: Record<string, string> = {
  A1: "Starter",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-intermediate",
  C1: "Advanced",
};

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => (part[0] ?? "").toUpperCase())
    .join("");
}

function Toggle({ label, description, defaultOn = true }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          on ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200",
            on && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const user = useUser();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [level, setLevel] = useState(user.level);

  function openEdit() {
    setName(user.name);
    setLevel(user.level);
    setEditing(true);
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed) return;
    updateProfile({ name: trimmed, avatarInitials: initialsFrom(trimmed), level });
    setEditing(false);
  }

  const stats = [
    { icon: Flame, label: "Day streak", value: `${user.streakDays}` },
    { icon: Sparkles, label: "Words learned", value: user.wordsLearned.toLocaleString() },
    { icon: Clock, label: "Studied today", value: `${user.minutesStudiedToday}m` },
  ];

  return (
    <div className="mx-auto max-w-3xl p-4 lg:p-8">
      <PageHeader title="Settings" description="Profile, preferences and notifications." />

      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-br from-primary/15 via-primary/[0.06] to-transparent" aria-hidden />
          <CardContent className="-mt-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar initials={user.avatarInitials} size="lg" className="ring-4 ring-card" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-bold leading-tight">{user.name}</p>
                    <Badge variant="secondary">
                      {user.level} · {LEVEL_LABELS[user.level]}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {!editing && (
                <Button variant="outline" size="sm" onClick={openEdit}>
                  <Pencil aria-hidden /> Edit profile
                </Button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-muted/40">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1 py-4">
                  <Icon className="size-4 text-primary" aria-hidden />
                  <span className="text-lg font-bold tabular-nums leading-none">{value}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            {editing && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
                className="mt-6 space-y-5 border-t border-border pt-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="display-name" className="mb-1.5 block text-sm font-semibold">
                      Display name
                    </label>
                    <input
                      id="display-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold">Target level</span>
                    <fieldset className="grid grid-cols-5 gap-2">
                      <legend className="sr-only">Choose your target CEFR level</legend>
                      {CEFR_LEVELS.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLevel(l)}
                          aria-pressed={level === l}
                          className={cn(
                            "rounded-lg border-2 py-2 text-sm font-semibold tabular-nums transition-colors duration-150",
                            level === l
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:bg-muted",
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </fieldset>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm">
                    <Check aria-hidden /> Save changes
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                    <X aria-hidden /> Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how EnglishAI Pro looks for you.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            {(["light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                aria-pressed={theme === mode}
                className={cn(
                  "flex-1 rounded-xl border-2 p-4 text-sm font-semibold capitalize transition-colors duration-150",
                  theme === mode ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted",
                )}
              >
                {mode} mode
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <Toggle label="Daily reminder" description="A nudge to keep your streak alive, every day at 7 PM." />
            <Toggle label="Streak alerts" description="Warn me before my streak is about to break." />
            <Toggle label="Weekly report" description="Summary of XP, minutes and words learned, every Monday." defaultOn={false} />
            <Toggle label="Leaderboard changes" description="Tell me when someone passes me in my league." defaultOn={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}