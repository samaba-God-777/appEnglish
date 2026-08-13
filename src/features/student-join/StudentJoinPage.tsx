import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { joinClass, fetchStudentEnrollments } from "@/lib/db";
import type { TeacherClass } from "@/types";

interface EnrolledClass {
  id: string;
  classId: string;
  studentId: string;
  joinedAt: string;
  class: TeacherClass | null;
}

const CODE_LENGTH = 6;

export default function StudentJoinPage() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<TeacherClass | null>(null);
  const [enrollments, setEnrollments] = useState<EnrolledClass[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  async function loadEnrollments() {
    setLoadingEnrollments(true);
    const data = await fetchStudentEnrollments();
    setEnrollments(data as EnrolledClass[]);
    setLoadingEnrollments(false);
  }

  const handleChange = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    setError(null);

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((c) => c) && newCode.join("").length === CODE_LENGTH) {
      handleSubmit(newCode.join(""));
    }
  }, [code]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newCode = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    const nextEmpty = newCode.findIndex((c) => !c);
    const focusIndex = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === CODE_LENGTH) {
      handleSubmit(pasted);
    }
  }, []);

  async function handleSubmit(codeStr?: string) {
    const codeToSubmit = codeStr || code.join("");
    if (codeToSubmit.length !== CODE_LENGTH) return;

    setJoining(true);
    setError(null);
    setSuccess(null);

    const result = await joinClass(codeToSubmit);
    setJoining(false);

    if (result.error) {
      setError(result.error);
      setCode(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } else if (result.class) {
      setSuccess(result.class);
      setCode(Array(CODE_LENGTH).fill(""));
      loadEnrollments();
    }
  }

  const filledCount = code.filter((c) => c).length;

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Join a Class</h1>
        <p className="mt-1 text-muted-foreground">
          Enter the code your teacher gave you to join their class.
        </p>
      </div>

      {/* Join Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="mb-3 block text-sm font-semibold">Class Code</label>
            <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {code.map((char, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    scale: char ? 1.05 : 1,
                    borderColor: char ? "hsl(var(--primary))" : "hsl(var(--border))",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <input
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="text"
                    autoComplete="one-time-code"
                    maxLength={2}
                    value={char}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="flex size-12 items-center justify-center rounded-xl border-2 bg-background text-center font-mono text-xl font-extrabold uppercase text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:size-14"
                    aria-label={`Character ${i + 1}`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Progress dots */}
            <div className="mt-3 flex justify-center gap-1.5">
              {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 rounded-full bg-muted"
                  initial={false}
                  animate={{
                    width: code[i] ? 20 : 8,
                    backgroundColor: code[i] ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              ))}
            </div>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              {filledCount}/{CODE_LENGTH} characters
              {filledCount === CODE_LENGTH && " — joining..."}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                >
                  <CheckCircle2 className="size-5" />
                </motion.div>
                <div>
                  <p className="font-semibold">Successfully joined!</p>
                  <p className="text-xs opacity-80">{success.className}</p>
                </div>
                <Sparkles className="ml-auto size-4" />
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={joining || filledCount !== CODE_LENGTH} className="w-full">
            {joining && <Loader2 className="animate-spin" aria-hidden />}
            {joining ? "Joining..." : "Join Class"}
            {!joining && <ArrowRight className="size-4 ml-1" />}
          </Button>
        </form>
      </motion.div>

      {/* My Classes */}
      <div>
        <h2 className="text-lg font-bold">My Classes</h2>
        {loadingEnrollments ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted/50">
              <Users className="size-8 text-muted-foreground/50" />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              No classes yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Ask your teacher for the 6-character class code above.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {enrollments.map((enrollment, i) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{enrollment.class?.className ?? "Unknown Class"}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(enrollment.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary">
                    {enrollment.class?.classCode}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
