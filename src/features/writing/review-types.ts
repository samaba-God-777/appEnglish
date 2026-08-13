export type CorrectionCategory =
  | "grammar"
  | "vocabulary"
  | "collocation"
  | "spelling"
  | "punctuation";

export interface Correction {
  /** Exact substring from the student's text, so it can be highlighted in place. */
  wrong: string;
  right: string;
  category: CorrectionCategory;
  explanation: string;
}

export interface ReviewScores {
  grammar: number;
  vocabulary: number;
  coherence: number;
  taskResponse: number;
  overall: number;
}

export interface VocabSuggestion {
  word: string;
  translation: string;
  example: string;
}

export interface WritingReview {
  corrections: Correction[];
  scores: ReviewScores;
  /** Brief overall comment in simple English. */
  feedback: string;
  /** The essay rewritten at the target level, keeping the student's ideas. */
  improvedVersion: string;
  vocabularySuggestions: VocabSuggestion[];
  source: "ai" | "demo";
}

export const categoryLabels: Record<CorrectionCategory, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  collocation: "Collocations",
  spelling: "Spelling",
  punctuation: "Punctuation",
};
