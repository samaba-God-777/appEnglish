export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type SkillKey =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "grammar"
  | "vocabulary";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  level: CefrLevel;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  diamonds: number;
  streakDays: number;
  wordsLearned: number;
  minutesStudiedToday: number;
  pronunciationScore: number;
  coursesCompleted: number;
  certificates: number;
  rank: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CefrLevel;
  units: number;
  lessons: number;
  completedLessons: number;
  durationHours: number;
  skills: SkillKey[];
  image: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  definition: string;
  example?: string;
  translation: string;
  level: CefrLevel;
  synonyms?: string[];
  mastery: number;
  /** Topic id this word belongs to (see vocabTopics). */
  topic: string;
  /** Lucide icon name used as the word's illustration. */
  icon: string;
  /** Tailwind gradient classes for the illustration tile. */
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  initials: string;
  xp: number;
  streak: number;
  level: CefrLevel;
  country: string;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface GameInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpPerRound: number;
  difficulty: "Easy" | "Medium" | "Hard";
  playable: boolean;
}

export interface WeeklyActivity {
  day: string;
  minutes: number;
  xp: number;
}

export interface SkillScore {
  skill: string;
  score: number;
}

export interface SpeakingMetric {
  label: string;
  score: number;
  feedback: string;
}

export interface SpeakingAssessment {
  transcript: string;
  overall: number;
  metrics: SpeakingMetric[];
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
