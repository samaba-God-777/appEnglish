import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TopicResult {
  bestActivity: number;
  bestTestScore: number;
  assignmentPassed: boolean;
}

interface GrammarProgressState {
  completed: Record<string, TopicResult>;
  recordActivity: (topicId: string, score: number) => void;
  recordTest: (topicId: string, score: number) => void;
  recordAssignment: (topicId: string, passed: boolean) => void;
}

const empty = (): TopicResult => ({ bestActivity: 0, bestTestScore: 0, assignmentPassed: false });

export const useGrammarProgress = create<GrammarProgressState>()(
  persist(
    (set) => ({
      completed: {},
      recordActivity: (topicId, score) =>
        set((state) => {
          const cur = state.completed[topicId] ?? empty();
          return {
            completed: {
              ...state.completed,
              [topicId]: { ...cur, bestActivity: Math.max(cur.bestActivity, score) },
            },
          };
        }),
      recordTest: (topicId, score) =>
        set((state) => {
          const cur = state.completed[topicId] ?? empty();
          return {
            completed: {
              ...state.completed,
              [topicId]: { ...cur, bestTestScore: Math.max(cur.bestTestScore, score) },
            },
          };
        }),
      recordAssignment: (topicId, passed) =>
        set((state) => {
          const cur = state.completed[topicId] ?? empty();
          return {
            completed: {
              ...state.completed,
              [topicId]: { ...cur, assignmentPassed: cur.assignmentPassed || passed },
            },
          };
        }),
    }),
    { name: "englishai-grammar-progress" },
  ),
);