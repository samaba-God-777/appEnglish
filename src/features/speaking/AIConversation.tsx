import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Volume2, MessagesSquare, Send, PartyPopper, ArrowLeft, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { speak } from "@/lib/speech";
import { useAuthStore } from "@/store/auth";
import { useStatsStore } from "@/store/stats";
import { cn } from "@/lib/cn";
import type { CefrLevel } from "@/types";

interface Turn {
  role: "user" | "assistant";
  text: string;
}

const TOPIC_CHIPS = [
  "Travel",
  "Work & Career",
  "Food & Cooking",
  "Hobbies",
  "Technology",
  "Films & TV",
  "Daily Life",
  "Future Plans",
  "Weather",
  "Books",
];

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

type Stage = "setup" | "conversation" | "summary";

export function AIConversation({
  level,
  onExit,
}: {
  level: CefrLevel;
  onExit: () => void;
}) {
  const [stage, setStage] = useState<Stage>("setup");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const awardedRef = useRef(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const addXp = useAuthStore((s) => s.addXp);
  const addActivity = useStatsStore((s) => s.addActivity);
  const setPronunciation = useStatsStore((s) => s.setPronunciation);

  const micUnsupported = typeof window !== "undefined" && !navigator.mediaDevices?.getUserMedia;
  const activeTopic = customTopic.trim() || topic;

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toMessages = (list: Turn[]): Array<{ role: "user" | "assistant"; content: string }> =>
    list.map((t) => ({ role: t.role, content: t.text }));

  const fetchReply = async (history: Turn[]) => {
    const res = await fetch("/api/speaking/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topic: activeTopic, level, messages: toMessages(history) }),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = (await res.json()) as { reply: string };
    return data.reply;
  };

  const startConversation = async () => {
    setError(null);
    setBusy(true);
    setTurns([]);
    try {
      const reply = await fetchReply([]);
      setTurns([{ role: "assistant", text: reply }]);
      speak(reply);
      setStage("conversation");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start the conversation.");
    } finally {
      setBusy(false);
    }
  };

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
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType || mime || "audio/webm" }));
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

  const stopRecording = async () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  const [audio, setAudioBlob] = useState<Blob | null>(null);

  const sendTurn = async (blob: Blob) => {
    setError(null);
    setBusy(true);
    setListening(true);
    try {
      const audioBase64 = await blobToBase64(blob);
      const tr = await fetch("/api/speaking/transcribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ audioBase64, mimeType: blob.type }),
      });
      if (!tr.ok) throw new Error(`Transcription failed (${tr.status})`);
      const { text } = (await tr.json()) as { text: string };
      if (!text.trim()) {
        setError("I couldn't hear you. Try speaking a little closer and read again.");
        return;
      }
      const nextTurns = [...turns, { role: "user" as const, text }];
      setTurns(nextTurns);
      const reply = await fetchReply(nextTurns);
      setTurns((prev) => [...prev, { role: "assistant", text: reply }]);
      speak(reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't get a reply.");
    } finally {
      setListening(false);
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!audio) return;
    sendTurn(audio);
    setAudioBlob(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  const goToSummary = () => {
    const userTurns = turns.filter((t) => t.role === "user").length;
    if (userTurns >= 2 && !awardedRef.current) {
      awardedRef.current = true;
      const score = Math.min(98, 76 + userTurns * 2);
      setPronunciation(score);
      const xp = 10 + userTurns * 5;
      addXp(xp);
      addActivity(xp, Math.max(2, Math.round(userTurns / 2)), "speaking");
    }
    setStage("summary");
  };

  const resetAll = () => {
    setStage("setup");
    setTurns([]);
    setCustomTopic("");
    awardedRef.current = false;
    setError(null);
  };

  const userTurns = turns.filter((t) => t.role === "user").length;

  return (
    <div className="space-y-4">
      {/* ───────── Setup ───────── */}
      {stage === "setup" && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessagesSquare className="size-4 text-primary" aria-hidden /> AI Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pick a topic or type anything you want to talk about. The AI will chat with you — you speak,
              it listens and replies.
            </p>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Choose a topic
              </p>
              <div className="flex flex-wrap gap-2">
                {TOPIC_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setTopic(chip);
                      setCustomTopic("");
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      topic === chip && !customTopic.trim()
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setTopic("");
              }}
              placeholder="…or type any topic you want to talk about"
              rows={2}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

            <Button onClick={startConversation} disabled={!activeTopic || busy} className="w-full">
              {busy ? "Starting…" : "Start conversation"}
              <Send aria-hidden />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ───────── Conversation ───────── */}
      {stage === "conversation" && (
        <Card className="shadow-soft">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessagesSquare className="size-4 text-primary" aria-hidden /> {activeTopic}
            </CardTitle>
            <Badge variant="secondary">{level}</Badge>
          </CardHeader>
          <CardContent>
            <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {turns.map((turn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", turn.role === "assistant" ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      turn.role === "assistant"
                        ? "rounded-bl-sm border border-border bg-muted/60"
                        : "rounded-br-sm bg-primary text-primary-foreground",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="min-w-0 flex-1">{turn.text}</span>
                      {turn.role === "assistant" && (
                        <button
                          aria-label="Hear the reply"
                          onClick={() => speak(turn.text)}
                          className="mt-0.5 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-primary"
                        >
                          <Volume2 className="size-3.5" aria-hidden />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {listening && (
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-br-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                    Listening…
                  </div>
                </div>
              )}
            </div>

            {micUnsupported && (
              <p className="mt-3 text-sm text-destructive">
                Your browser doesn't support voice recording on this device.
              </p>
            )}
            {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {!recording ? (
                <Button size="sm" onClick={startRecording} disabled={busy || micUnsupported}>
                  <Mic aria-hidden /> Record your reply
                </Button>
              ) : (
                <Button size="sm" variant="destructive" onClick={stopRecording}>
                  <Square className="size-3.5" aria-hidden /> Stop
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={goToSummary}
                disabled={turns.length === 0 || busy}
                className="ml-auto hidden sm:inline-flex"
              >
                End conversation
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 sm:hidden">
              <Button variant="outline" size="sm" onClick={onExit}>
                <ArrowLeft aria-hidden /> Back
              </Button>
              <Button size="sm" onClick={goToSummary} disabled={turns.length === 0 || busy}>
                <PartyPopper aria-hidden /> End conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ───────── Summary ───────── */}
      {stage === "summary" && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="size-9 text-primary" aria-hidden />
            <p className="text-xl font-extrabold tracking-tight text-primary">Nice conversation!</p>
            <p className="max-w-sm text-muted-foreground">
              You had {userTurns} speaking turn{userTurns === 1 ? "" : "s"} about {activeTopic}. Keep
              chatting regularly — real conversation is the fastest way to fluency.
            </p>
            <div className="mt-2 w-full max-w-md space-y-2">
              {turns.map((turn, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm",
                    turn.role === "assistant" ? "bg-muted/60" : "bg-primary/10",
                  )}
                >
                  <span className={cn("font-semibold", turn.role === "assistant" ? "text-primary" : "text-foreground")}>
                    {turn.role === "assistant" ? "AI" : "You"}:
                  </span>{" "}
                  <span className="line-clamp-2 text-muted-foreground">{turn.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={onExit}>
                <ArrowLeft aria-hidden /> Back to Lab
              </Button>
              <Button onClick={resetAll}>
                <RotateCcw aria-hidden /> New conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}