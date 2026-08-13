import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, Loader2, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/types";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    setAuthError(null);
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.name, role: selectedRole } },
    });
    if (error) {
      setAuthError(error.message === "User already registered" ? "An account with this email already exists" : error.message);
      return;
    }
    if (result.user) {
      login(result.user.email ?? data.email, data.name, selectedRole);
      navigate("/", { replace: true });
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
        <div className="relative flex h-full flex-col justify-center p-12 text-primary-foreground">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md text-4xl leading-tight font-extrabold tracking-tight"
          >
            Start your journey from A1 to C1 today.
          </motion.h1>
          <p className="mt-6 text-sm text-white/80">
            Join thousands of learners improving their English with AI-powered lessons, real-time feedback, and gamified progress.
          </p>
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

          <h2 className="text-2xl font-extrabold tracking-tight">Create your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Start your journey from A1 to C1 today.</p>

          {authError && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {authError}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                selectedRole === "student"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              )}
            >
              <Users className="size-6" aria-hidden />
              <span className="text-sm font-semibold">Student</span>
              <span className="text-xs text-center">I want to learn English</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                selectedRole === "teacher"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              )}
            >
              <BookOpen className="size-6" aria-hidden />
              <span className="text-sm font-semibold">Teacher</span>
              <span className="text-xs text-center">I want to teach English</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                aria-invalid={!!errors.name}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:border-ring",
                  errors.name && "border-destructive",
                )}
                {...register("name")}
              />
              {errors.name && <p className="mt-1 text-xs font-medium text-destructive">{errors.name.message}</p>}
            </div>

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
                  autoComplete="new-password"
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
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
