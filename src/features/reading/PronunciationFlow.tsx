import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Volume2, ArrowRight, ArrowLeft, RotateCcw, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { speak } from "@/lib/speech";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";
import type { ReadingArticle } from "./reading-data";

interface Grade {
  transcript: string;
  score: number;
  wrongWords: string[];
  feedback: string;
}

function splitSentences(fullText: string): string[] {
  return fullText
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
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

function scoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

export function PronunciationFlow({
  article,
  onExit,
}: {
  article: ReadingArticle;
  onExit: () => void;
}) {
  const sentences = splitSentences(article.fullText);
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [checking, setChecking] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const awardedRef = useRef(false);

  const addXp = useAuthStore((s) => s.addXp);
  const addActivity = useStatsStore((s) => s.addActivity);
  const setPronunciation = useStatsStore((s) => s.setPronunciation);

  const sentence = sentences[index];
  const total = sentences.length;
  const micUnsupported = typeof window !== "undefined" && !navigator.mediaDevices?.getUserMedia;

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferred = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/wav"];
      const mime =
        typeof MediaRecorder !== "undefined"
          ? preferred.find((m) => MediaRecorder.isTypeSupported(m))
          : undefined;
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
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  const checkPronunciation = async () => {
    if (!audio || checking) return;
    setChecking(true);
    setError(null);
    try {
      const audioBase64 = await blobToBase64(audio);
      const res = await fetch("/api/pronunciation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ audioBase64, mimeType: audio.type, target: sentence }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as Grade;
      setGrade(data);
      setScores((s) => [...s, data.score]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't grade your pronunciation.");
    } finally {
      setChecking(false);
    }
  };

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
    setAudio(null);
    setGrade(null);
    setError(null);
  };

  const resetAll = () => {
    setIndex(0);
    setAudio(null);
    setGrade(null);
    setError(null);
    setScores([]);
    setFinished(false);
    awardedRef.current = false;
  };

  // Award XP once when the flow is finished.
  useEffect(() => {
    if (!finished || awardedRef.current || scores.length === 0) return;
    awardedRef.current = true;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    setPronunciation(avg);
    const xp = Math.max(2, Math.round(avg / 5));
    addXp(xp);
    addActivity(xp, Math.max(1, Math.round(total / 10)), "reading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  // ───────────────────────── Completion ─────────────────────────
  if (finished) {
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return (
      <Card className="shadow-soft">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <PartyPopper className="size-9 text-primary" aria-hidden />
          <p className="text-5xl font-extrabold tracking-tight tabular-nums text-primary">{avg}%</p>
          <p className="max-w-sm text-muted-foreground">
            {avg >= 80
              ? "Outstanding pronunciation — your reading aloud sounds natural."
              : avg >= 50
                ? "Good effort! Review the highlighted words and read again."
                : "Keep practising — repetition builds clear, confident pronunciation."}
          </p>
          <div className="mt-2 w-full max-w-sm space-y-2">
            {sentences.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2 text-left">
                <span className="line-clamp-1 flex-1 text-xs text-muted-foreground">{s}</span>
                <span className={cn("shrink-0 text-sm font-bold tabular-nums", scoreColor(scores[i] ?? 0))}>
                  {scores[i] ?? "—"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={onExit}>
              <ArrowLeft aria-hidden /> Back to article
            </Button>
            <Button onClick={resetAll}>
              <RotateCcw aria-hidden /> Practise again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic className="size-4 text-primary" aria-hidden /> Pronunciation Practice
            </CardTitle>
            <Badge variant="secondary">
              {index + 1} / {total}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={index} max={total} className="mb-5" label="Pronunciation progress" />

          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="flex items-start gap-2 text-base leading-relaxed">
              <Volume2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
              <span>{sentence}</span>
            </p>
          </div>

          {micUnsupported && (
            <p className="mt-3 text-sm text-destructive">
              Your browser doesn't support voice recording on this device.
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => speak(sentence ?? "")} disabled={!sentence}>
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
            <Button size="sm" onClick={checkPronunciation} disabled={!audio || checking} className="ml-auto">
              {checking ? "Grading…" : "Check pronunciation"}
            </Button>
          </div>

          {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}

          {grade && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className={cn("text-4xl font-extrabold tabular-nums", scoreColor(grade.score))}>
                  {grade.score}%
                </span>
                <p className="text-sm text-muted-foreground">{grade.feedback}</p>
              </div>

              {grade.transcript && (
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What you said</p>
                  <p className="mt-1 text-sm italic">“{grade.transcript}”</p>
                </div>
              )}

              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {grade.wrongWords.length > 0 ? "Watch these words" : "Every word sounded great"}
                </p>
                <p className="mt-1 flex flex-wrap gap-1 text-sm leading-relaxed">
                  {(sentence ?? "").split(/\s+/).map((word, i) => {
                    const norm = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const isWrong = grade.wrongWords.includes(norm);
                    return (
                      <span
                        key={i}
                        className={cn(
                          "rounded px-0.5",
                          isWrong && "bg-destructive/15 text-destructive decoration-destructive underline",
                        )}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onExit}>
          <ArrowLeft aria-hidden /> Back
        </Button>
        <Button onClick={next} disabled={index === 0 && !grade} className="flex-1 sm:flex-none">
          {index + 1 >= total ? "Finish" : "Next sentence"}
          <ArrowRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}