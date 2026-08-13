import { create } from "zustand";
import { persist } from "zustand/middleware";
import { vocabularyWords } from "@/data/mock";
import { upsertVocabularyProgress } from "@/lib/db";

const MASTERED = 100;
const KNOWN_GAIN = 50;
const LEARNING_GAIN = 15;

interface VocabState {
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
          // Sync to Supabase (fire-and-forget)
          const wordObj = vocabularyWords.find((w) => w.id === wordId);
          if (wordObj) upsertVocabularyProgress(wordId, wordObj.word, next);
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

export function useMasteredCount(): number {
  return useVocabStore((s) => Object.values(s.masteryByWord).filter((m) => m >= MASTERED).length);
}

export function useLearningCount(): number {
  return useVocabStore(
    (s) => Object.values(s.masteryByWord).filter((m) => m > 0 && m < MASTERED).length,
  );
}

export const totalWords = vocabularyWords.length;
export const masteredThreshold = MASTERED;
