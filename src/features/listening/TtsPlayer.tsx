import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Mic } from "lucide-react";
import type { ListeningExercise } from "./listening-data";

const ACCENT_LANG: Record<ListeningExercise["accent"], string> = {
  American: "en-US",
  British: "en-GB",
  Australian: "en-AU",
  Canadian: "en-CA",
};

export function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [clean];
}

/**
 * Rank voices by expected audio quality. Neural/natural system voices
 * (Edge "Natural", macOS "Enhanced"/Siri, Chrome's Google voices) sound far
 * clearer than the default robotic ones, so they win the auto pick.
 */
function scoreVoice(v: SpeechSynthesisVoice, targetLang: string): number {
  const name = v.name.toLowerCase();
  const lang = v.lang.replace("_", "-").toLowerCase();
  let s = 0;
  if (lang === targetLang.toLowerCase()) s += 10;
  else if (lang.startsWith("en")) s += 4;
  else return -1; // not an English voice
  if (name.includes("natural") || name.includes("neural")) s += 8;
  if (name.includes("premium") || name.includes("enhanced")) s += 6;
  if (name.includes("google")) s += 5;
  if (name.includes("siri")) s += 4;
  if (!v.localService) s += 2; // cloud voices are usually higher quality
  if (name.includes("compact") || name.includes("eloquence")) s -= 6; // known low-quality voices
  return s;
}

const RATES = [0.75, 1, 1.25] as const;
const SENTENCE_PAUSE_MS = 280; // small breath between sentences — clearer diction
const VOICE_PREF_KEY = "englishai-listening-voice";

interface TtsPlayerProps {
  exercise: ListeningExercise;
  onSentenceChange?: (index: number) => void;
}

/**
 * Speech player: reads the transcript aloud with the browser's TTS voices,
 * auto-picking the highest-quality English voice for the exercise accent.
 * Speaks sentence by sentence so we can track progress, seek and highlight.
 */
export function TtsPlayer({ exercise, onSentenceChange }: TtsPlayerProps) {
  const sentences = useMemo(() => splitSentences(exercise.transcript), [exercise.transcript]);
  const [index, setIndex] = useState(-1); // -1 = not started
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>(() => localStorage.getItem(VOICE_PREF_KEY) ?? "auto");

  const playingRef = useRef(false);
  const rateRef = useRef(1);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const targetLang = ACCENT_LANG[exercise.accent] ?? "en-US";

  // English voices, best quality first
  const englishVoices = useMemo(
    () =>
      voices
        .map((v) => ({ v, score: scoreVoice(v, targetLang) }))
        .filter(({ score }) => score >= 0)
        .sort((a, b) => b.score - a.score)
        .map(({ v }) => v),
    [voices, targetLang],
  );

  const voice = useMemo(() => {
    if (voiceURI !== "auto") {
      const chosen = englishVoices.find((v) => v.voiceURI === voiceURI);
      if (chosen) return chosen;
    }
    return englishVoices[0] ?? null;
  }, [englishVoices, voiceURI]);

  const setSentence = useCallback(
    (i: number) => {
      setIndex(i);
      onSentenceChange?.(i);
    },
    [onSentenceChange],
  );

  const speakFrom = useCallback(
    (i: number) => {
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
      window.speechSynthesis.cancel();
      if (i >= sentences.length) {
        playingRef.current = false;
        setPlaying(false);
        setSentence(-1);
        return;
      }
      setSentence(i);
      const u = new SpeechSynthesisUtterance(sentences[i]);
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? targetLang;
      u.rate = rateRef.current;
      u.pitch = 1;
      u.volume = 1;
      u.onend = () => {
        if (!playingRef.current) return;
        // brief pause between sentences reads much more naturally
        pauseTimer.current = setTimeout(() => {
          if (playingRef.current) speakFrom(i + 1);
        }, SENTENCE_PAUSE_MS);
      };
      window.speechSynthesis.speak(u);
    },
    [sentences, voice, targetLang, setSentence],
  );

  const play = () => {
    playingRef.current = true;
    setPlaying(true);
    speakFrom(index < 0 ? 0 : index);
  };
  // "Pause" restarts the current sentence on resume — speechSynthesis.pause()
  // is unreliable across browsers, cancel + remembered index is not.
  const pause = () => {
    playingRef.current = false;
    setPlaying(false);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    window.speechSynthesis.cancel();
  };
  const restart = () => {
    playingRef.current = true;
    setPlaying(true);
    speakFrom(0);
  };
  const skip = (delta: number) => {
    const next = Math.min(sentences.length - 1, Math.max(0, (index < 0 ? 0 : index) + delta));
    if (playing) speakFrom(next);
    else setSentence(next);
  };
  const changeRate = (r: number) => {
    setRate(r);
    rateRef.current = r;
    if (playing) speakFrom(index < 0 ? 0 : index); // re-speak current sentence at the new speed
  };
  const changeVoice = (uri: string) => {
    setVoiceURI(uri);
    localStorage.setItem(VOICE_PREF_KEY, uri);
    if (playing) pause();
  };

  if (!supported) {
    return (
      <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        Tu navegador no soporta síntesis de voz. Prueba con Chrome, Edge o Safari.
      </p>
    );
  }

  const progress = sentences.length ? Math.max(0, index) / sentences.length : 0;

  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={playing ? pause : play}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5 translate-x-0.5" aria-hidden />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{exercise.title}</div>
          <div className="text-xs text-muted-foreground">{exercise.accent} accent</div>
        </div>
        <div className="flex items-center gap-1">
          {RATES.map((r) => (
            <button
              key={r}
              onClick={() => changeRate(r)}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                rate === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted-foreground/10"
              }`}
            >
              {r}×
            </button>
          ))}
        </div>
      </div>

      {/* Progress by sentence */}
      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted-foreground/20">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs tabular-nums text-muted-foreground">
            {index < 0 ? "Listo para escuchar" : `Oración ${index + 1} de ${sentences.length}`}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => skip(-1)} aria-label="Previous sentence" className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted-foreground/10 hover:text-foreground">
              <SkipBack className="size-4" aria-hidden />
            </button>
            <button onClick={restart} aria-label="Restart" className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted-foreground/10 hover:text-foreground">
              <RotateCcw className="size-4" aria-hidden />
            </button>
            <button onClick={() => skip(1)} aria-label="Next sentence" className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted-foreground/10 hover:text-foreground">
              <SkipForward className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Voice picker — quality varies a lot per device, let the learner choose */}
      {englishVoices.length > 0 && (
        <div className="mt-3 flex items-center gap-2 border-t border-muted-foreground/10 pt-3">
          <Mic className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <select
            value={voice?.voiceURI ?? "auto"}
            onChange={(e) => changeVoice(e.target.value)}
            aria-label="Voice"
            className="h-7 max-w-full flex-1 truncate rounded-lg border border-muted-foreground/20 bg-background px-2 text-xs font-medium focus:border-ring"
          >
            {englishVoices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang.replace("_", "-")})
              </option>
            ))}
          </select>
          <button
            onClick={() => changeVoice("auto")}
            className="shrink-0 text-[11px] font-semibold text-primary hover:underline"
            title="Elegir automáticamente la mejor voz"
          >
            Auto
          </button>
        </div>
      )}
    </div>
  );
}
