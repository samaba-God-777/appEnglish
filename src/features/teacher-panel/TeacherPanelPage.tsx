import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Plus,
  Trash2,
  Users,
  BookOpen,
  Trophy,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import {
  createClass,
  fetchTeacherClasses,
  deleteClass,
  fetchClassStudents,
} from "@/lib/db";
import type { TeacherClass, StudentWithScores } from "@/types";

export default function TeacherPanelPage() {
  const user = useAuthStore((s) => s.user);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<Record<string, StudentWithScores[]>>({});
  const [loadingStudents, setLoadingStudents] = useState<string | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    setLoading(true);
    const data = await fetchTeacherClasses();
    setClasses(data);
    setLoading(false);
  }

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!className.trim()) return;
    setCreating(true);
    const newClass = await createClass(className.trim(), classDescription.trim() || undefined);
    if (newClass) {
      setClasses((prev) => [newClass, ...prev]);
      setClassName("");
      setClassDescription("");
    }
    setCreating(false);
  }

  async function handleDeleteClass(classId: string) {
    await deleteClass(classId);
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    if (expandedClass === classId) setExpandedClass(null);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  async function toggleExpandClass(classId: string) {
    if (expandedClass === classId) {
      setExpandedClass(null);
      return;
    }
    setExpandedClass(classId);
    if (!students[classId]) {
      setLoadingStudents(classId);
      const data = await fetchClassStudents(classId);
      setStudents((prev) => ({ ...prev, [classId]: data }));
      setLoadingStudents(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Teacher Panel</h1>
        <p className="mt-1 text-muted-foreground">
          Create classes, share your code, and track your students' progress.
        </p>
      </div>

      {/* Create Class Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Plus className="size-5 text-primary" />
          Create New Class
        </h2>
        <form onSubmit={handleCreateClass} className="mt-4 space-y-3">
          <div>
            <label htmlFor="className" className="mb-1.5 block text-sm font-semibold">
              Class Name
            </label>
            <input
              id="className"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. English B1 - Monday"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-ring"
              required
            />
          </div>
          <div>
            <label htmlFor="classDesc" className="mb-1.5 block text-sm font-semibold">
              Description (optional)
            </label>
            <input
              id="classDesc"
              type="text"
              value={classDescription}
              onChange={(e) => setClassDescription(e.target.value)}
              placeholder="e.g. Intermediate group, Mondays and Wednesdays"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <Button type="submit" disabled={creating || !className.trim()}>
            {creating && <Loader2 className="animate-spin" aria-hidden />}
            Create Class
          </Button>
        </form>
      </motion.div>

      {/* Classes List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 text-center">
          <BookOpen className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            No classes yet. Create your first class above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => (
            <motion.div
              key={cls.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* Class Header */}
              <div className="flex items-center justify-between p-5">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{cls.className}</h3>
                  {cls.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{cls.description}</p>
                  )}
                </div>

                {/* Class Code */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2">
                    <span className="text-xs font-medium text-muted-foreground">Code:</span>
                    <span className="font-mono text-lg font-extrabold tracking-widest text-primary">
                      {cls.classCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyCode(cls.classCode)}
                      className="ml-1 rounded-lg p-1 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                      aria-label="Copy class code"
                    >
                      {copiedCode === cls.classCode ? (
                        <Check className="size-4 text-green-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expand/Collapse Students */}
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => toggleExpandClass(cls.id)}
                  className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users className="size-4" />
                    Students
                    {students[cls.id] && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {students[cls.id].length}
                      </span>
                    )}
                  </span>
                  {expandedClass === cls.id ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedClass === cls.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {loadingStudents === cls.id ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : !students[cls.id] || students[cls.id].length === 0 ? (
                        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                          No students enrolled yet. Share the code with your students.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-t border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <th className="px-5 py-3">Student</th>
                                <th className="px-5 py-3">Level</th>
                                <th className="px-5 py-3 text-right">XP</th>
                                <th className="px-5 py-3 text-right">Words</th>
                                <th className="px-5 py-3 text-right">Minutes</th>
                                <th className="px-5 py-3 text-right">Streak</th>
                                <th className="px-5 py-3"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {students[cls.id].map((student) => (
                                <tr key={student.studentId} className="hover:bg-muted/30 transition-colors">
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {student.avatarInitials}
                                      </div>
                                      <div>
                                        <p className="font-semibold">{student.studentName}</p>
                                        <p className="text-xs text-muted-foreground">{student.studentEmail}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                                      {student.level}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3 text-right font-mono font-bold">
                                    {student.xp.toLocaleString()}
                                  </td>
                                  <td className="px-5 py-3 text-right font-mono">
                                    {student.wordsLearned}
                                  </td>
                                  <td className="px-5 py-3 text-right font-mono">
                                    {student.minutesStudied}
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <span className="inline-flex items-center gap-1 font-mono">
                                      <Trophy className="size-3 text-amber-500" />
                                      {student.streakDays}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => removeStudent(cls.id, student.studentId)}
                                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                      aria-label={`Remove ${student.studentName}`}
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delete Class */}
              <div className="border-t border-border px-5 py-3">
                <button
                  type="button"
                  onClick={() => handleDeleteClass(cls.id)}
                  className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
                >
                  Delete class
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  async function removeStudent(classId: string, studentId: string) {
    const { removeStudentFromClass } = await import("@/lib/db");
    await removeStudentFromClass(classId, studentId);
    setStudents((prev) => ({
      ...prev,
      [classId]: (prev[classId] ?? []).filter((s) => s.studentId !== studentId),
    }));
  }
}
