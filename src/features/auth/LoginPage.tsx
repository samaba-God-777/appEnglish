import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, Loader2, Sparkles, Mic, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/cn";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const highlights = [
  { icon: Sparkles, text: "AI tutor that adapts to your CEFR level" },
  { icon: Mic, text: "Real-time pronunciation analysis" },
  { icon: Trophy, text: "Gamified streaks, XP and leagues" },
];

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate(from, { replace: true });
    });
  }, [navigate, from]);

  const onSubmit = async (data: LoginForm) => {
    setAuthError(null);
    const { data: result, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setAuthError(error.message === "Invalid login credentials" ? "Email or password incorrect" : error.message);
      return;
    }
    if (result.user) {
      const role = (result.user.user_metadata?.role as "student" | "teacher") ?? "student";
      login(result.user.email ?? data.email, result.user.user_metadata?.full_name, role);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(0,0,0,.25), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <GraduationCap className="size-6" aria-hidden />
            </div>
            <span className="text-lg font-extrabold tracking-tight">EnglishAI Pro</span>
          </div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-md text-4xl leading-tight font-extrabold tracking-tight"
            >
              Learn English smarter with artificial intelligence.
            </motion.h1>
            <ul className="mt-8 space-y-4">
              {highlights.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm font-medium text-white/90"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-white/15">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {text}
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/70">Trusted by schools, academies and companies worldwide.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" aria-hidden />
            </div>
            <span className="text-lg font-extrabold tracking-tight">EnglishAI Pro</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue your learning streak.</p>

          {authError && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:border-ring",
                  errors.email && "border-destructive",
                )}
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-xs font-medium text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className={cn(
                    "h-11 w-full rounded-xl border border-border bg-card px-4 pr-11 text-sm placeholder:text-muted-foreground focus:border-ring",
                    errors.password && "border-destructive",
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to EnglishAI Pro?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
