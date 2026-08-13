import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2, RotateCcw, Volume2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { speakingMetrics } from "@/data/mock";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/cn";
import { getExercisesByLevel } from "./speaking-data";
import { AIConversation } from "./AIConversation";
import type { CefrLevel, SpeakingAssessment } from "@/types";

const SPEAKING_XP = 30;

type Phase = "idle" | "recording" | "analyzing" | "results";
type Mode = "sentence" | "conversation";

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

export default function SpeakingPage() {
  const [mode, setMode] = useState<Mode>("sentence");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>("B1");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("s-b1-1");
  const [phase, setPhase] = useState<Phase>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [overall, setOverall] = useState(0);
  const [assessment, setAssessment] = useState<SpeakingAssessment | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const setPronunciation = useStatsStore((s) => s.setPronunciation);
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  const exercises = getExercisesByLevel(selectedLevel);
  const currentExercise = exercises.find((ex) => ex.id === selectedExerciseId);

  useEffect(() => {
    if (phase !== "analyzing") return;
    let cancelled = false;

    const analyze = async () => {
      setAnalyzeError(null);
      if (!recordedAudio || !currentExercise) {
        setPhase("idle");
        return;
      }
      try {
        const audioBase64 = await blobToBase64(recordedAudio);
        const res = await fetch("/api/speaking/assess", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            audioBase64,
            mimeType: recordedAudio.type,
            target: currentExercise.sentence,
            level: selectedLevel,
          }),
        });
        if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
        const data = (await res.json()) as SpeakingAssessment;
        if (cancelled) return;
        setAssessment(data);
        setOverall(data.overall);
        setPronunciation(data.overall);
        addXp(SPEAKING_XP);
        addActivity(SPEAKING_XP, 3, "speaking");
        setPhase("results");
      } catch (err) {
        if (cancelled) return;
        setAnalyzeError(err instanceof Error ? err.message : "Couldn't analyze your speech.");
        setPhase("idle");
      }
    };
    analyze();
    return () => {
      cancelled = true;
    };
  }, [phase, recordedAudio, currentExercise, selectedLevel, setPronunciation, addXp, addActivity]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingTime(0);
      setRecordingDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferred = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/wav"];
      const mime =
        typeof MediaRecorder !== "undefined"
          ? preferred.find((m) => MediaRecorder.isTypeSupported(m))
          : undefined;
      const mediaRecorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || mime || "audio/webm",
        });
        setRecordedAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setPhase("recording");

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 100);

      // Setup visualization
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(recordingTime / 10);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setPhase("analyzing");
    }
  };

  const playRecording = () => {
    if (!recordedAudio) return;

    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.ontimeupdate = () => {
        setPlaybackTime(audio.currentTime * 1000);
      };
      audioElementRef.current = audio;
    }

    const url = URL.createObjectURL(recordedAudio);
    audioElementRef.current.src = url;

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    setRecordedAudio(null);
    setRecordingTime(0);
    setPlaybackTime(0);
    setRecordingDuration(0);
    setAssessment(null);
    setAnalyzeError(null);
    setPhase("idle");
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-8">
      <PageHeader
        title="Speaking Lab"
        description="Record yourself speaking — AI analyzes pronunciation, fluency, intonation and more."
      />

      {/* Mode Toggle */}
      <div className="mb-6 flex w-full max-w-md rounded-xl border border-border bg-muted/40 p-1">
        {(
          [
            { id: "sentence", label: "Sentence Practice" },
            { id: "conversation", label: "AI Conversation" },
          ] as const
        ).map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => setMode(m.id)}
            className="flex-1"
          >
            {m.label}
          </Button>
        ))}
      </div>

      {/* Level Selection */}
      {mode === "sentence" && (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Your Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "primary" : "outline"}
                onClick={() => {
                  setSelectedLevel(level);
                  const levelExercises = getExercisesByLevel(level);
                  if (levelExercises.length > 0 && levelExercises[0]) {
                    setSelectedExerciseId(levelExercises[0].id);
                  }
                  setRecordedAudio(null);
                  setPhase("idle");
                }}
              >
                {level}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Exercise Selection */}
      {mode === "sentence" && exercises.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choose a Sentence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => {
                    setSelectedExerciseId(exercise.id);
                    setRecordedAudio(null);
                    setPhase("idle");
                  }}
                  className={cn(
                    "w-full rounded-lg border-2 p-4 text-left transition-all",
                    selectedExerciseId === exercise.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{exercise.category}</p>
                      <p className="mt-1 text-sm text-muted-foreground">"{exercise.sentence}"</p>
                      <p className="mt-1 text-xs text-muted-foreground">{exercise.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Conversation */}
      {mode === "conversation" && (
        <AIConversation level={selectedLevel} onExit={() => setMode("sentence")} />
      )}

      {/* Practice Sentence */}
      {mode === "sentence" && currentExercise && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
            <Badge variant="secondary">Practice sentence · {currentExercise.level}</Badge>
            <p className="max-w-2xl text-xl font-semibold lg:text-2xl">"{currentExercise.sentence}"</p>

            {/* Recording Visualization */}
            {phase === "recording" && (
              <div className="flex h-10 items-end gap-1" aria-label="Recording in progress">
                {Array.from({ length: 24 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 rounded-full bg-primary"
                    animate={{ height: [6, 10 + ((i * 13) % 28), 6] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}

            {phase === "analyzing" && (
              <p className="animate-pulse text-sm font-semibold text-primary">Analyzing your speech with AI…</p>
            )}

            {/* Recording Controls */}
            <div className="flex flex-col items-center gap-4">
              {recordedAudio && phase !== "analyzing" && phase !== "results" && (
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatTime(playbackTime)}</span>
                    <span>{formatTime(recordingDuration * 1000)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Button size="sm" variant="outline" onClick={playRecording} className="gap-2">
                      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={deleteRecording} className="gap-2 text-destructive">
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        deleteRecording();
                      }}
                      className="gap-2"
                    >
                      <RotateCcw className="size-4" />
                      Re-record
                    </Button>
                  </div>
                </div>
              )}

              {phase === "recording" ? (
                <Button size="lg" variant="destructive" onClick={stopRecording} className="gap-2">
                  <Square aria-hidden className="size-5" />
                  Stop recording ({formatTime(recordingTime * 100)})
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={startRecording}
                  disabled={phase === "analyzing" || phase === "results"}
                  className="gap-2"
                >
                  <Mic aria-hidden className="size-5" />
                  {recordedAudio && phase === "idle" ? "Re-record" : "Start recording"}
                </Button>
              )}

              {recordedAudio && phase === "idle" && (
                <Button size="lg" onClick={() => setPhase("analyzing")} className="gap-2">
                  <Volume2 aria-hidden className="size-5" />
                  Analyze Recording
                </Button>
              )}

              {analyzeError && <p className="text-sm font-semibold text-destructive">{analyzeError}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {mode === "sentence" && phase === "results" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Score Summary */}
          <div className="mb-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div
                  className="flex size-36 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--color-primary) ${overall * 3.6}deg, var(--color-muted) 0deg)`,
                  }}
                >
                  <div className="flex size-28 flex-col items-center justify-center rounded-full bg-card">
                    <span className="text-3xl font-extrabold tabular-nums">{overall}</span>
                    <span className="text-xs text-muted-foreground">Overall</span>
                  </div>
                </div>
                <div className="mt-4 w-full space-y-2 text-center">
                  <p className="text-sm font-semibold text-success">+5 points improvement</p>
                  <p className="text-xs text-muted-foreground">vs your last session</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessment?.transcript ? (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      What you said
                    </p>
                    <p className="mt-1 text-sm italic">“{assessment.transcript}”</p>
                  </div>
                ) : null}
                <div className="rounded-lg bg-success/10 p-3">
                  <p className="text-sm font-semibold text-success">
                    {overall >= 80
                      ? "Excellent progress — this sentence sounded natural."
                      : overall >= 60
                        ? "Good effort — you're on the right track."
                        : "Keep going — repeating out loud builds confidence."}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{assessment?.feedback}</p>
                </div>
                {assessment && assessment.strengths.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Strengths:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {assessment.strengths.map((s, i) => (
                        <li key={i}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {assessment && assessment.improvements.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Focus on:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {assessment.improvements.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Rubric Assessment */}
          <Card className="mb-6">
            <CardHeader>
              <div className="space-y-2">
                <CardTitle>Detailed Rubric Assessment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comprehensive feedback on your speaking performance across key dimensions
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {(assessment?.metrics ?? speakingMetrics).map((metric) => {
                const isStrength = metric.score >= 80;
                const needsWork = metric.score < 70;

                // Define performance levels
                const getLevel = (score: number) => {
                  if (score >= 90) return "Mastery";
                  if (score >= 80) return "Advanced";
                  if (score >= 70) return "Proficient";
                  if (score >= 60) return "Developing";
                  return "Beginning";
                };

                const getLevelColor = (score: number) => {
                  if (score >= 90) return "bg-success text-white";
                  if (score >= 80) return "bg-success/80 text-white";
                  if (score >= 70) return "bg-warning text-white";
                  if (score >= 60) return "bg-warning/60 text-white";
                  return "bg-destructive/60 text-white";
                };

                return (
                  <div key={metric.label} className="rounded-lg border border-border p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-base">{metric.label}</span>
                        <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", getLevelColor(metric.score))}>
                          {getLevel(metric.score)}
                        </span>
                        {isStrength && <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded">⭐ Strength</span>}
                        {needsWork && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">🎯 Focus</span>}
                      </div>
                      <div className="text-right">
                        <div className={cn("text-2xl font-bold tabular-nums", getLevelColor(metric.score).replace("bg-", "text-").replace("text-white", ""))}>{metric.score}%</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <Progress value={metric.score} className="h-2.5" label={metric.label} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Beginning (0%)</span>
                        <span>Advanced (80%)</span>
                        <span>Mastery (100%)</span>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-foreground">{metric.feedback}</p>
                    </div>

                    {/* Scoring Criteria */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded border border-success/30 bg-success/5 p-2">
                        <p className="font-semibold text-success mb-1">✓ What You're Doing Well:</p>
                        <p className="text-muted-foreground">
                          {metric.label === "Pronunciation" && "Clear articulation of most sounds"}
                          {metric.label === "Fluency" && "Generally smooth pacing"}
                          {metric.label === "Intonation" && "Good use of pitch variation"}
                          {metric.label === "Grammar" && "Mostly accurate sentence structure"}
                          {metric.label === "Vocabulary" && "Appropriate word choice"}
                          {metric.label === "Naturalness" && "Conversational tone"}
                        </p>
                      </div>
                      <div className="rounded border border-warning/30 bg-warning/5 p-2">
                        <p className="font-semibold text-warning mb-1">→ Areas to Improve:</p>
                        <p className="text-muted-foreground">
                          {metric.label === "Pronunciation" && "Subtle vowel distinctions"}
                          {metric.label === "Fluency" && "Pauses between sentences"}
                          {metric.label === "Intonation" && "Question intonation patterns"}
                          {metric.label === "Grammar" && "Tense consistency"}
                          {metric.label === "Vocabulary" && "Phrasal verb usage"}
                          {metric.label === "Naturalness" && "Filler word reduction"}
                        </p>
                      </div>
                    </div>

                    {/* Specific Improvement Tips */}
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Targeted Practice:</p>
                      <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                        {metric.label === "Pronunciation" && (
                          <>
                            <li>• Record and compare: Listen to native speakers saying the same words</li>
                            <li>• Focus on: Difficult consonant clusters and vowel pairs</li>
                            <li>• Resource: Use Forvo.com for pronunciation examples</li>
                          </>
                        )}
                        {metric.label === "Fluency" && (
                          <>
                            <li>• Practice: Read aloud without stopping to build continuous speech</li>
                            <li>• Use: Filler phrases naturally ("well," "you know," "I mean")</li>
                            <li>• Track: Reduce unnecessary pauses using the voice recorder</li>
                          </>
                        )}
                        {metric.label === "Intonation" && (
                          <>
                            <li>• Exaggerate: Practice extreme pitch changes to develop muscle memory</li>
                            <li>• Questions: Questions should rise at the end, statements should fall</li>
                            <li>• Emotion: Try expressing different emotions (excited, sad, surprised)</li>
                          </>
                        )}
                        {metric.label === "Grammar" && (
                          <>
                            <li>• Review: Past tense forms and conditional structures</li>
                            <li>• Practice: Complex sentences with multiple clauses</li>
                            <li>• Drill: Verb conjugation exercises daily for 10 minutes</li>
                          </>
                        )}
                        {metric.label === "Vocabulary" && (
                          <>
                            <li>• Learn: 5-10 new words daily and use them in sentences</li>
                            <li>• Focus: Synonyms for common words (said → mentioned, explained, etc.)</li>
                            <li>• Study: Phrasal verbs and idioms relevant to your interests</li>
                          </>
                        )}
                        {metric.label === "Naturalness" && (
                          <>
                            <li>• Listen: To podcasts and movies in your target accent</li>
                            <li>• Imitate: Copy speech patterns, rhythm, and stress of native speakers</li>
                            <li>• Reduce: Overly formal language in casual conversations</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Benchmark */}
                    <div className="flex items-center justify-between text-xs bg-muted/30 rounded p-2">
                      <span className="text-muted-foreground">Your Level vs Average:</span>
                      <div className="flex gap-4">
                        <span>Beginner (B1): 65% | <span className="font-semibold">You: {metric.score}%</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Next Steps & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold mb-1">📚 Grammar Focus</p>
                  <p className="text-xs text-muted-foreground">
                    Complete the intermediate grammar module to strengthen sentence construction.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold mb-1">🎯 Vocabulary Expansion</p>
                  <p className="text-xs text-muted-foreground">
                    Practice 10 new words daily with the flashcard feature for better word variety.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold mb-1">🎧 Listening Practice</p>
                  <p className="text-xs text-muted-foreground">
                    Listen to native English speakers to improve intonation and naturalness.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold mb-1">🔄 Repeat This Exercise</p>
                  <p className="text-xs text-muted-foreground">
                    Practice the same sentence again to see incremental improvements in your score.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Comparison */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Session Score</span>
                  <span className="font-semibold">84</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Today's Score</span>
                  <span className="font-semibold text-success">{overall}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground font-semibold">Improvement</span>
                  <span className="font-bold text-success">+{overall - 84} points</span>
                </div>
                <div className="mt-3 bg-success/10 rounded-lg p-2.5">
                  <p className="text-xs text-success font-semibold">🎉 Keep up the excellent work!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're consistently improving. Practice regularly to reach mastery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setPhase("idle");
              }}
            >
              Try Same Sentence Again
            </Button>
            <Button
              onClick={() => {
                setPhase("idle");
                deleteRecording();
              }}
            >
              Try Another Sentence
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
