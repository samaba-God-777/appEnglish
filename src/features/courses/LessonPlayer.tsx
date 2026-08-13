import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BookMarked,
  BookText,
  CheckCircle2,
  Headphones,
  Mic,
  PartyPopper,
  PenLine,
  Play,
  SpellCheck2,
  Square,
  Swords,
  Volume2,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { speak } from "@/lib/speech";
import { useStatsStore } from "@/store/stats";
import type { Lesson, LessonType } from "./course-content";
import { buildLessonSteps, type LessonStep } from "./lesson-content";

const typeIcons: Record<LessonType, LucideIcon> = {
  vocabulary: BookMarked,
  grammar: SpellCheck2,
  listening: Headphones,
  speaking: Mic,
  reading: BookText,
  writing: PenLine,
  quiz: Swords,
};

interface LessonPlayerProps {
  courseTitle: string;
  lesson: Lesson;
  /** Reviewing an already-completed lesson: no progress or XP is awarded. */
  isReview?: boolean;
  onComplete: (xp: number) => void;
  onClose: () => void;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.readAsDataURL(blob);
  });
}

/** Renders the prompt, turning the `___` blank into a highlighted marker. */
function GapPrompt({ prompt }: { prompt: string }) {
  const parts = prompt.split("___");
  if (parts.length === 1) return <span>{prompt}</span>;
  return (
    <span className="leading-relaxed">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              className="mx-1 inline-block min-w-4 rounded-md bg-primary/15 px-1 text-center text-primary"
              aria-hidden
            >
              ?
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

/** Shared multiple-choice / gap-fill / listening / reading comprehension step. */
function ChoiceStep({
  step,
  isLast,
  onGrade,
  onNext,
}: {
  step: Extract<LessonStep, { kind: "mcq" | "gapfill" | "listen" | "read" }>;
  isLast: boolean;
  onGrade: (correct: boolean) => void;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === step.answerIndex;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    onGrade(i === step.answerIndex);
  };

  return (
    <div>
      {step.kind === "listen" && step.text && (
        <div className="mb-5 rounded-xl border border-border bg-muted/50 p-4">
          <div className="flex items-start justify-between gap-4">
            <p className="flex-1 text-base italic leading-relaxed">“{step.text}”</p>
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => speak(step.text ?? "")} aria-label="Listen to the audio">
              <Volume2 aria-hidden /> Listen
            </Button>
          </div>
        </div>
      )}

      {step.kind === "read" && step.passage && (
        <div className="mb-5 max-h-48 overflow-y-auto rounded-xl border border-border bg-muted/50 p-4">
          <p className="text-base leading-relaxed">{step.passage}</p>
        </div>
      )}

      <p className="text-lg font-semibold leading-relaxed">
        {step.kind === "gapfill" ? <GapPrompt prompt={step.prompt} /> : step.question}
      </p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {step.options.map((option, i) => {
          const isAnswer = i === step.answerIndex;
          const isSelected = i === selected;
          return (
            <button
              key={`${step.kind}-${i}`}
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={cn(
                "rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
                selected === null && "hover:border-primary hover:bg-primary/5",
                selected !== null && isAnswer && "border-success bg-success/10 text-success",
                selected !== null && isSelected && !isAnswer && "border-destructive bg-destructive/10 text-destructive",
                selected !== null && !isSelected && !isAnswer && "opacity-50",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                {option}
                {selected !== null && isAnswer && <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />}
                {selected !== null && isSelected && !isAnswer && <XCircle className="size-5 shrink-0 text-destructive" aria-hidden />}
              </span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex flex-col gap-4 rounded-xl bg-muted/60 p-4"
        >
          <p className="text-sm text-muted-foreground">
            <span className={cn("font-semibold", correct ? "text-success" : "text-destructive")}>
              {correct ? "Correct!" : "Not quite."}
            </span>{" "}
            {step.explanation}
          </p>
          <div className="flex justify-end">
            <Button onClick={onNext}>{isLast ? "Finish" : "Next"}</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface Grade {
  transcript: string;
  score: number;
  wrongWords: string[];
  feedback: string;
}

/** Mic-recording pronunciation step. */
function SpeakStep({
  step,
  isLast,
  onDone,
  onScore,
}: {
  step: Extract<LessonStep, { kind: "speak" }>;
  isLast: boolean;
  onDone: () => void;
  onScore?: (score: number) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [checking, setChecking] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const micUnsupported = typeof window !== "undefined" && !navigator.mediaDevices?.getUserMedia;

  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferred = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/wav"];
      const mime = typeof MediaRecorder !== "undefined" ? preferred.find((m) => MediaRecorder.isTypeSupported(m)) : undefined;
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        setAudio(new Blob(chunksRef.current, { type: recorder.mimeType || mime || "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Couldn't access the microphone. Check browser permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    setRecording(false);
  };

  const check = async () => {
    if (!audio || checking) return;
    setChecking(true);
    setError(null);
    try {
      const audioBase64 = await blobToBase64(audio);
      const res = await fetch("/api/pronunciation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ audioBase64, mimeType: audio.type, target: step.text }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const g = (await res.json()) as Grade;
      setGrade(g);
      onScore?.(g.score);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't grade your pronunciation.");
    } finally {
      setChecking(false);
    }
  };

  const scoreColor = (score: number) => (score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive");

  return (
    <div>
      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <p className="flex items-start gap-2 text-base italic leading-relaxed">
          <Volume2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
          <span>“{step.text}”</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => speak(step.text)}>
          <Volume2 aria-hidden /> Hear it
        </Button>
        {!recording ? (
          <Button size="sm" onClick={startRecording} disabled={micUnsupported}>
            <Mic aria-hidden /> Record
          </Button>
        ) : (
          <Button size="sm" variant="destructive" onClick={stopRecording}>
            <Square className="size-3.5" aria-hidden /> Stop
          </Button>
        )}
        <Button size="sm" onClick={check} disabled={!audio || checking} className="ml-auto">
          {checking ? "Grading…" : "Check pronunciation"}
        </Button>
      </div>

      {micUnsupported && <p className="mt-3 text-sm text-destructive">Your browser doesn't support voice recording on this device.</p>}
      {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}

      {grade && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className={cn("text-4xl font-extrabold tabular-nums", scoreColor(grade.score))}>{grade.score}%</span>
            <p className="text-sm text-muted-foreground">{grade.feedback}</p>
          </div>
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {grade.wrongWords.length > 0 ? "Watch these words" : "Every word sounded great"}
            </p>
            <p className="mt-1 flex flex-wrap gap-1 text-sm leading-relaxed">
              {step.text.split(/\s+/).map((word, i) => {
                const norm = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                const isWrong = grade.wrongWords.includes(norm);
                return (
                  <span key={i} className={cn("rounded px-0.5", isWrong && "bg-destructive/15 text-destructive underline")}>
                    {word}
                  </span>
                );
              })}
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onDone}>{isLast ? "Finish" : "Next"}</Button>
          </div>
        </motion.div>
      )}
      {!grade && !recording && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onDone}>
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}

/** Guided writing prompt with a free-text area. */
function WriteStep({ step, isLast, onNext }: { step: Extract<LessonStep, { kind: "write" }>; isLast: boolean; onNext: () => void }) {
  const [text, setText] = useState("");
  return (
    <div>
      <p className="text-base font-semibold">{step.prompt}</p>
      {step.hint && <p className="mt-1.5 text-sm text-muted-foreground">Hint: {step.hint}</p>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Write your answer here…"
        className="mt-4 w-full resize-none rounded-xl border border-border bg-card p-4 text-sm leading-relaxed outline-none transition-colors focus:border-primary"
      />
      <div className="mt-4 flex justify-end">
        <Button onClick={onNext} disabled={text.trim().length === 0}>
          {isLast ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}

export function LessonPlayer({ courseTitle, lesson, isReview = false, onComplete, onClose }: LessonPlayerProps) {
  const steps = buildLessonSteps(lesson);
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const setPronunciation = useStatsStore((s) => s.setPronunciation);
  const prevScore = useRef(0);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const Icon = typeIcons[lesson.type];
  const scorable = steps.filter(
    (s) => s.kind === "mcq" || s.kind === "gapfill" || s.kind === "listen" || s.kind === "read",
  ).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const next = () => {
    if (step && step.kind === "speak" && prevScore.current > 0) setPronunciation(prevScore.current);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const finishAndContinue = () => {
    if (step?.kind === "speak" && prevScore.current > 0) setPronunciation(prevScore.current);
    if (!isReview) onComplete(lesson.xp);
    onClose();
  };

  const answered = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
  };

  const selectable = step?.kind === "mcq" || step?.kind === "gapfill" || step?.kind === "listen" || step?.kind === "read";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Lesson: ${lesson.title}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lifted"
      >
        {step && step.kind !== "finish" ? (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-border p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-muted-foreground">
                    {courseTitle}
                    {isReview && <Badge variant="secondary" className="ml-1.5">Review</Badge>}
                  </p>
                  <h2 className="truncate text-base font-extrabold tracking-tight">{lesson.title}</h2>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close lesson" className="shrink-0">
                <X aria-hidden />
              </Button>
            </div>

            <div className="flex items-center gap-3 px-5 pt-4">
              <Progress value={stepIndex + 1} max={steps.length} className="h-2 flex-1" label="Lesson progress" />
              <span className="shrink-0 text-xs font-bold text-muted-foreground tabular-nums">
                {stepIndex + 1} / {steps.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 lg:p-6">
              {step.kind === "intro" && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-accent">{lesson.type}</p>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{step.heading}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{step.body}</p>
                  {step.example && (
                    <div className="mt-4 rounded-xl border border-border bg-muted/50 p-4 text-sm italic text-muted-foreground">
                      {step.example}
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <Button onClick={next}>
                      <Play aria-hidden /> {stepIndex === 0 ? "Start" : "Continue"}
                    </Button>
                  </div>
                </div>
              )}

              {selectable && (
                <ChoiceStep
                  key={`${step.kind}-${stepIndex}`}
                  step={step}
                  isLast={isLast}
                  onGrade={answered}
                  onNext={next}
                />
              )}

              {step.kind === "speak" && (
                <SpeakStep
                  key={`speak-${stepIndex}`}
                  step={step}
                  isLast={isLast}
                  onDone={next}
                  onScore={(s) => (prevScore.current = s)}
                />
              )}

              {step.kind === "write" && <WriteStep key={`write-${stepIndex}`} step={step} isLast={isLast} onNext={next} />}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
              <PartyPopper className="size-8" aria-hidden />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">{isReview ? "Review complete!" : "Lesson complete!"}</h2>
            <p className="text-sm text-muted-foreground">“{lesson.title}” is done.</p>
            {step?.kind === "finish" && step.summary && <p className="max-w-sm text-sm text-muted-foreground">{step.summary}</p>}
            {scorable > 0 && (
            <>
              <p className="text-3xl font-extrabold tracking-tight text-primary tabular-nums">
                {score}/{scorable}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {score >= 3 ? "Great recall — you've got this." : score >= 2 ? "Solid progress, keep it up." : "Every try builds competence."}
              </p>
            </>
          )}
          {scorable === 0 && <p className="max-w-sm text-sm text-muted-foreground">Nice work — you've completed the task.</p>}
            {isReview ? (
              <Badge variant="secondary" className="text-sm">
                Already mastered — no XP for reviews
              </Badge>
            ) : (
              <Badge variant="accent" className="text-sm">
                <Zap className="size-4" aria-hidden /> +{lesson.xp} XP earned
              </Badge>
            )}
            <Button size="lg" className="mt-3" onClick={finishAndContinue}>
              Continue
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}