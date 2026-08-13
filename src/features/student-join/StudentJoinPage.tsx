import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  KeyRound,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
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

export default function StudentJoinPage() {
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<TeacherClass | null>(null);
  const [enrollments, setEnrollments] = useState<EnrolledClass[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  async function loadEnrollments() {
    setLoadingEnrollments(true);
    const data = await fetchStudentEnrollments();
    setEnrollments(data as EnrolledClass[]);
    setLoadingEnrollments(false);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setJoining(true);
    setError(null);
    setSuccess(null);

    const result = await joinClass(code.trim());
    setJoining(false);

    if (result.error) {
      setError(result.error);
    } else if (result.class) {
      setSuccess(result.class);
      setCode("");
      loadEnrollments();
    }
  }

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
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="classCode" className="mb-1.5 block text-sm font-semibold">
              Class Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="classCode"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 font-mono text-lg font-bold tracking-widest uppercase placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground focus:border-ring"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              Successfully joined <strong>{success.className}</strong>!
            </motion.div>
          )}

          <Button type="submit" disabled={joining || !code.trim()}>
            {joining && <Loader2 className="animate-spin" aria-hidden />}
            Join Class
            <ArrowRight className="size-4 ml-1" />
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
            <BookOpen className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              You haven't joined any classes yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {enrollments.map((enrollment) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
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
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
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
