import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WritingReview } from "@/features/writing/review-types";
import type { WritingLevel } from "@/features/writing/prompts";
import { insertWritingEssay } from "@/lib/db";

export interface EssayRecord {
  id: string;
  date: string;
  promptId: string;
  promptText: string;
  level: WritingLevel;
  genre: string;
  text: string;
  review: WritingReview;
}

interface Draft {
  promptId: string;
  text: string;
}

interface WritingState {
  essays: EssayRecord[];
  draft: Draft | null;
  saveDraft: (draft: Draft) => void;
  clearDraft: () => void;
  addEssay: (essay: EssayRecord) => void;
}

export const useWritingStore = create<WritingState>()(
  persist(
    (set) => ({
      essays: [],
      draft: null,
      saveDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
      addEssay: (essay) =>
        set((state) => {
          // Sync to Supabase (fire-and-forget)
          insertWritingEssay({
            essay_id: essay.id,
            prompt_id: essay.promptId,
            prompt_text: essay.promptText,
            level: essay.level,
            genre: essay.genre,
            text: essay.text,
            overall_score: essay.review.scores.overall,
            grammar_score: essay.review.scores.grammar,
            vocabulary_score: essay.review.scores.vocabulary,
            coherence_score: essay.review.scores.coherence,
            task_response_score: essay.review.scores.taskResponse,
            corrections: essay.review.corrections,
            feedback: essay.review.feedback,
            improved_version: essay.review.improvedVersion,
            vocabulary_suggestions: essay.review.vocabularySuggestions,
          });
          return { essays: [essay, ...state.essays] };
        }),
    }),
    { name: "englishai-writing" },
  ),
);

export interface ScorePoint {
  index: number;
  date: string;
  score: number;
}

export function scoreHistory(essays: EssayRecord[]): ScorePoint[] {
  return [...essays]
    .reverse()
    .map((essay, index) => ({
      index: index + 1,
      date: new Date(essay.date).toLocaleDateString(undefined, { day: "2-digit", month: "short" }),
      score: essay.review.scores.overall,
    }));
}

export interface RepeatedError {
  wrong: string;
  right: string;
  explanation: string;
  count: number;
}

export function repeatedErrors(essays: EssayRecord[], min = 2): RepeatedError[] {
  const byKey = new Map<string, RepeatedError>();
  for (const essay of essays) {
    for (const c of essay.review.corrections) {
      const key = `${c.wrong.trim().toLowerCase()}→${c.right.trim().toLowerCase()}`;
      const existing = byKey.get(key);
      if (existing) existing.count += 1;
      else byKey.set(key, { wrong: c.wrong.trim(), right: c.right, explanation: c.explanation, count: 1 });
    }
  }
  return [...byKey.values()]
    .filter((e) => e.count >= min)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
