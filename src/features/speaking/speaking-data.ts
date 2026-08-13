import type { CefrLevel } from "@/types";

export interface SpeakingExercise {
  id: string;
  level: CefrLevel;
  sentence: string;
  category: string;
  description: string;
}

const exercises: SpeakingExercise[] = [
  // ── A1 ────────────────────────────────────────────────────────────────
  {
    id: "s-a1-1",
    level: "A1",
    sentence: "Hello, my name is John.",
    category: "Introduction",
    description: "Practice basic introductions in English.",
  },
  {
    id: "s-a1-2",
    level: "A1",
    sentence: "I like apples and bananas.",
    category: "Food & Preferences",
    description: "Learn to express your food preferences.",
  },
  {
    id: "s-a1-3",
    level: "A1",
    sentence: "What time is it?",
    category: "Daily Life",
    description: "Ask questions about time.",
  },
  {
    id: "s-a1-4",
    level: "A1",
    sentence: "I live in a small apartment near the city center.",
    category: "Home & Living",
    description: "Describe where you live.",
  },
  {
    id: "s-a1-5",
    level: "A1",
    sentence: "I would like a cup of coffee, please.",
    category: "At a Café",
    description: "Order food and drinks politely.",
  },
  {
    id: "s-a1-6",
    level: "A1",
    sentence: "She is my sister and he is my brother.",
    category: "Family",
    description: "Talk about your family members.",
  },

  // ── A2 ────────────────────────────────────────────────────────────────
  {
    id: "s-a2-1",
    level: "A2",
    sentence: "Can you help me find the nearest bus station?",
    category: "Directions",
    description: "Ask for help with directions.",
  },
  {
    id: "s-a2-2",
    level: "A2",
    sentence: "I have been living in this city for five years.",
    category: "Personal Experience",
    description: "Talk about your personal experiences.",
  },
  {
    id: "s-a2-3",
    level: "A2",
    sentence: "Yesterday, I went to the market to buy some vegetables.",
    category: "Daily Activities",
    description: "Describe your daily activities.",
  },
  {
    id: "s-a2-4",
    level: "A2",
    sentence: "I am planning to travel to Spain next summer.",
    category: "Travel Plans",
    description: "Talk about future travel plans.",
  },
  {
    id: "s-a2-5",
    level: "A2",
    sentence: "Could you please repeat that? I didn't understand.",
    category: "Asking for Clarification",
    description: "Politely ask someone to repeat themselves.",
  },
  {
    id: "s-a2-6",
    level: "A2",
    sentence: "The restaurant near my office serves excellent pasta.",
    category: "Food & Restaurants",
    description: "Recommend or describe a restaurant.",
  },

  // ── B1 ────────────────────────────────────────────────────────────────
  {
    id: "s-b1-1",
    level: "B1",
    sentence: "The weather has been thoroughly unpredictable throughout the year.",
    category: "Small Talk",
    description: "Engage in casual conversation about weather.",
  },
  {
    id: "s-b1-2",
    level: "B1",
    sentence: "Although the movie was entertaining, I found the ending quite predictable.",
    category: "Opinions & Reviews",
    description: "Express opinions about entertainment.",
  },
  {
    id: "s-b1-3",
    level: "B1",
    sentence: "If I were you, I would consider investing in renewable energy solutions.",
    category: "Advice",
    description: "Give and receive advice.",
  },
  {
    id: "s-b1-4",
    level: "B1",
    sentence: "Working from home has changed the way many people approach their daily routines.",
    category: "Work & Lifestyle",
    description: "Discuss modern work trends and habits.",
  },
  {
    id: "s-b1-5",
    level: "B1",
    sentence: "I believe that learning a second language opens doors to new opportunities.",
    category: "Education",
    description: "Share your views on language learning.",
  },
  {
    id: "s-b1-6",
    level: "B1",
    sentence: "Public transportation should be improved to reduce traffic congestion in major cities.",
    category: "Urban Issues",
    description: "Discuss city infrastructure and solutions.",
  },

  // ── B2 ────────────────────────────────────────────────────────────────
  {
    id: "s-b2-1",
    level: "B2",
    sentence: "The implications of artificial intelligence on employment markets are multifaceted and require careful consideration.",
    category: "Complex Topics",
    description: "Discuss complex modern issues.",
  },
  {
    id: "s-b2-2",
    level: "B2",
    sentence: "Despite the economic downturn, the company managed to maintain profitability through strategic cost optimization.",
    category: "Business",
    description: "Discuss business and economics.",
  },
  {
    id: "s-b2-3",
    level: "B2",
    sentence: "One could argue that environmental sustainability should supersede economic growth in policy decisions.",
    category: "Arguments",
    description: "Present and counter-argue viewpoints.",
  },
  {
    id: "s-b2-4",
    level: "B2",
    sentence: "The widespread adoption of remote work has fundamentally transformed corporate culture and employee expectations.",
    category: "Society & Technology",
    description: "Analyze societal shifts caused by technology.",
  },
  {
    id: "s-b2-5",
    level: "B2",
    sentence: "Access to quality education remains one of the most pressing challenges facing developing nations today.",
    category: "Global Issues",
    description: "Discuss education equity on a global scale.",
  },
  {
    id: "s-b2-6",
    level: "B2",
    sentence: "While social media has connected billions of people, it has also contributed to the spread of misinformation.",
    category: "Media & Communication",
    description: "Weigh the pros and cons of social media.",
  },

  // ── C1 ────────────────────────────────────────────────────────────────
  {
    id: "s-c1-1",
    level: "C1",
    sentence: "The juxtaposition of traditional methodologies with contemporary approaches elucidates the paradigm shift in academic discourse.",
    category: "Academic",
    description: "Use sophisticated academic language.",
  },
  {
    id: "s-c1-2",
    level: "C1",
    sentence: "Notwithstanding the prevalence of technological disruption, the human element remains indispensable in organizational dynamics.",
    category: "Professional",
    description: "Professional and formal discussion.",
  },
  {
    id: "s-c1-3",
    level: "C1",
    sentence: "The nuanced interplay between socioeconomic factors and cultural manifestations warrants comprehensive empirical investigation.",
    category: "Research",
    description: "Discuss research and complex ideas.",
  },
  {
    id: "s-c1-4",
    level: "C1",
    sentence: "The ramifications of climate change extend far beyond environmental degradation, permeating economic stability and geopolitical relations.",
    category: "Global Affairs",
    description: "Analyze interconnected global challenges.",
  },
  {
    id: "s-c1-5",
    level: "C1",
    sentence: "Contemporary neuroscience suggests that cognitive development is an intricate interplay between genetic predisposition and environmental stimuli.",
    category: "Science",
    description: "Discuss scientific findings with precision.",
  },
  {
    id: "s-c1-6",
    level: "C1",
    sentence: "The erosion of democratic institutions in several regions underscores the fragility of governance structures when confronted with populism.",
    category: "Political Analysis",
    description: "Provide nuanced political commentary.",
  },

  // ── C2 ────────────────────────────────────────────────────────────────
  {
    id: "s-c2-1",
    level: "C2",
    sentence: "The epistemological ramifications of quantum mechanics fundamentally challenge our preconceived notions of causality and determinism.",
    category: "Philosophy",
    description: "Advanced philosophical and scientific discourse.",
  },
  {
    id: "s-c2-2",
    level: "C2",
    sentence: "The amelioration of societal inequities necessitates a multidisciplinary approach that synthesizes insights from numerous academic disciplines.",
    category: "Social Issues",
    description: "Discuss advanced social topics.",
  },
  {
    id: "s-c2-3",
    level: "C2",
    sentence: "Notwithstanding the ostensible consonance in political ideology, underlying ideological fissures substantiate claims of systemic incongruence.",
    category: "Politics",
    description: "Advanced political discourse.",
  },
  {
    id: "s-c2-4",
    level: "C2",
    sentence: "The inexorable march of technological innovation compels a fundamental reassessment of what it means to be human in the twenty-first century.",
    category: "Humanity & Technology",
    description: "Explore the philosophical impact of technology.",
  },
  {
    id: "s-c2-5",
    level: "C2",
    sentence: "The confluence of artificial intelligence and bioengineering heralds a new epoch in which the boundaries between organic and synthetic life become increasingly ephemeral.",
    category: "Future Studies",
    description: "Speculate on emerging scientific frontiers.",
  },
  {
    id: "s-c2-6",
    level: "C2",
    sentence: "The labyrinthine nature of international trade agreements often obscures the differential impact on small and medium-sized enterprises in developing economies.",
    category: "Economics",
    description: "Analyze complex global economic systems.",
  },
];

export function getAllExercises(): SpeakingExercise[] {
  return exercises;
}

export function getExercisesByLevel(level: CefrLevel): SpeakingExercise[] {
  return exercises.filter((ex) => ex.level === level);
}

export function getExerciseById(id: string): SpeakingExercise | null {
  return exercises.find((ex) => ex.id === id) ?? null;
}

export type Recording = {
  id: string;
  exerciseId: string;
  audioBlob: Blob;
  timestamp: number;
  duration: number;
  score?: number;
};
