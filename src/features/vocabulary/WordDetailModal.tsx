import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Volume2, Gauge, Loader2, BookX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { speak } from "@/lib/speech";
import { lookupWord, type DictEntry } from "@/lib/dictionary-api";

interface WordDetailModalProps {
  word: string;
  onClose: () => void;
}

export function WordDetailModal({ word, onClose }: WordDetailModalProps) {
  const [entry, setEntry] = useState<DictEntry | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    lookupWord(word).then((result) => {
      if (!active) return;
      if (result) {
        setEntry(result);
        setStatus("ready");
      } else {
        setStatus("notfound");
      }
    });
    return () => {
      active = false;
    };
  }, [word]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const playAudio = () => {
    if (entry?.audio) {
      audioRef.current ??= new Audio(entry.audio);
      audioRef.current.src = entry.audio;
      audioRef.current.play().catch(() => speak(word));
    } else {
      speak(word);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Dictionary entry: ${word}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="scrollbar-thin max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-lifted lg:p-8"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight">{entry?.word ?? word}</h2>
            {entry?.phonetic && <p className="text-sm text-muted-foreground">{entry.phonetic}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X aria-hidden />
          </Button>
        </div>

        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={playAudio} aria-label={`Listen to ${word}`}>
            <Volume2 aria-hidden /> Listen
          </Button>
          <Button size="sm" variant="outline" onClick={() => speak(word, { slow: true })} aria-label={`Listen to ${word} slowly`}>
            <Gauge aria-hidden /> Slow
          </Button>
        </div>

        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden /> Looking it up…
          </div>
        )}

        {status === "notfound" && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <BookX className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm font-semibold">No dictionary entry found</p>
            <p className="text-xs text-muted-foreground">
              You can still hear the pronunciation with the Listen button above.
            </p>
          </div>
        )}

        {status === "ready" && entry && (
          <div className="mt-5 space-y-5">
            {entry.meanings.map((meaning, mi) => (
              <div key={`${meaning.partOfSpeech}-${mi}`}>
                <p className="mb-2 text-sm font-bold text-primary italic">{meaning.partOfSpeech}</p>
                <ol className="space-y-2.5">
                  {meaning.definitions.map((d, di) => (
                    <li key={di} className="text-sm">
                      <span className="mr-1.5 font-bold text-muted-foreground tabular-nums">{di + 1}.</span>
                      {d.definition}
                      {d.example && (
                        <p className="mt-1 ml-5 rounded-lg bg-muted px-3 py-1.5 text-muted-foreground italic">
                          “{d.example}”
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
                {meaning.synonyms.length > 0 && (
                  <div className="mt-2.5 ml-5 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Synonyms:</span>
                    {meaning.synonyms.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {entry.origin && (
              <p className="border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="font-semibold">Origin:</span> {entry.origin}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
