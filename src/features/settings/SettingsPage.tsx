import { useState, useRef } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/theme";
import { useAuthStore, useUser } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/cn";
import {
  Check,
  Clock,
  Flame,
  Pencil,
  Sparkles,
  X,
  Camera,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

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

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const user = useUser();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [level, setLevel] = useState(user.level);

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      if (error.message.includes("422") || error.message.includes("recent") || error.message.includes("session")) {
        setPasswordError("Please log out and log back in, then try again.");
      } else {
        setPasswordError(error.message);
      }
    } else {
      setPasswordSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 3000);
    }
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
        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-br from-primary/15 via-primary/[0.06] to-transparent" aria-hidden />
          <CardContent className="-mt-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar with upload */}
                <div className="relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="size-20 rounded-full object-cover ring-4 ring-card"
                    />
                  ) : (
                    <Avatar initials={user.avatarInitials} size="lg" className="ring-4 ring-card" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Change profile picture"
                  >
                    {uploading ? (
                      <Loader2 className="size-5 animate-spin text-white" />
                    ) : (
                      <Camera className="size-5 text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

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

            {/* Edit Profile Form */}
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

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                {showPasswordSection ? <X className="size-4" /> : <Pencil className="size-4" />}
                {showPasswordSection ? "Cancel" : "Change"}
              </Button>
            </div>
          </CardHeader>
          {showPasswordSection && (
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="mb-1.5 block text-sm font-semibold">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-11 text-sm placeholder:text-muted-foreground focus:border-ring"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-semibold">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-ring"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    {passwordSuccess}
                  </div>
                )}

                <Button type="submit" disabled={passwordLoading || !newPassword || !confirmPassword}>
                  {passwordLoading && <Loader2 className="animate-spin" aria-hidden />}
                  Update Password
                </Button>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Appearance */}
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

      </div>
    </div>
  );
}
