import { create } from "zustand";
import { persist } from "zustand/middleware";
import { vocabularyWords } from "@/data/mock";

const MASTERED = 100;
const KNOWN_GAIN = 50;
const LEARNING_GAIN = 15;

interface VocabState {
  /** Mastery 0–100 per word id. Empty = every word starts at 0. */
  masteryByWord: Record<string, number>;
  practice: (wordId: string, known: boolean) => void;
  resetAll: () => void;
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set) => ({
      masteryByWord: {},
      practice: (wordId, known) =>
        set((state) => {
          const current = state.masteryByWord[wordId] ?? 0;
          const next = Math.min(MASTERED, current + (known ? KNOWN_GAIN : LEARNING_GAIN));
          return { masteryByWord: { ...state.masteryByWord, [wordId]: next } };
        }),
      resetAll: () => set({ masteryByWord: {} }),
    }),
    { name: "englishai-vocab" },
  ),
);

export function useWordMastery(wordId: string): number {
  return useVocabStore((s) => s.masteryByWord[wordId] ?? 0);
}

/** Words that reached full mastery (count for the dashboard "Words Learned" stat). */
export function useMasteredCount(): number {
  return useVocabStore((s) => Object.values(s.masteryByWord).filter((m) => m >= MASTERED).length);
}

/** Words touched at least once but not yet mastered. */
export function useLearningCount(): number {
  return useVocabStore(
    (s) => Object.values(s.masteryByWord).filter((m) => m > 0 && m < MASTERED).length,
  );
}

export const totalWords = vocabularyWords.length;
export const masteredThreshold = MASTERED;
