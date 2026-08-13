import { useEffect, useMemo, useState } from "react";

let wordsPromise: Promise<string[]> | null = null;

/** Loads the ~370k-word English list once per session (lazy, cached). */
function loadWords(): Promise<string[]> {
  if (!wordsPromise) {
    wordsPromise = fetch("/dictionary/words_alpha.txt")
      .then((res) => res.text())
      .then((text) => text.split("\n").map((w) => w.trim()).filter((w) => w.length > 1))
      .catch(() => []);
  }
  return wordsPromise;
}

interface WordListState {
  ready: boolean;
  total: number;
  search: (query: string, limit?: number) => string[];
}

export function useWordList(): WordListState {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    loadWords().then((list) => {
      if (active) setWords(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return useMemo(
    () => ({
      ready: words.length > 0,
      total: words.length,
      search: (query: string, limit = 60) => {
        const q = query.trim().toLowerCase();
        if (q.length < 2) return [];
        const starts: string[] = [];
        const contains: string[] = [];
        for (const w of words) {
          if (w.startsWith(q)) {
            starts.push(w);
            if (starts.length >= limit) break;
          }
        }
        if (starts.length < limit) {
          for (const w of words) {
            if (!w.startsWith(q) && w.includes(q)) {
              contains.push(w);
              if (starts.length + contains.length >= limit) break;
            }
          }
        }
        return [...starts, ...contains].slice(0, limit);
      },
    }),
    [words],
  );
}
