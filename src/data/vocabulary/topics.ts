export interface VocabTopic {
  id: string;
  label: string;
  emoji: string;
  /** Lucide icon name for word tiles in this topic. */
  icon: string;
  /** Tailwind gradient for word tiles in this topic. */
  color: string;
}

/** Thematic sections the vocabulary deck is organised into. */
export const vocabTopics: VocabTopic[] = [
  { id: "essentials", label: "Essentials", emoji: "⭐", icon: "Star", color: "from-teal-400 to-emerald-500" },
  { id: "food", label: "Food & Drink", emoji: "🍔", icon: "UtensilsCrossed", color: "from-orange-400 to-red-500" },
  { id: "travel", label: "Travel & Transport", emoji: "✈️", icon: "Plane", color: "from-sky-400 to-blue-500" },
  { id: "work", label: "Work & Business", emoji: "💼", icon: "Briefcase", color: "from-slate-400 to-gray-600" },
  { id: "technology", label: "Technology", emoji: "💻", icon: "Cpu", color: "from-indigo-400 to-violet-500" },
  { id: "health", label: "Health & Body", emoji: "❤️‍🩹", icon: "HeartPulse", color: "from-rose-400 to-red-500" },
  { id: "family", label: "Family & People", emoji: "👨‍👩‍👧", icon: "Users", color: "from-pink-400 to-fuchsia-500" },
  { id: "education", label: "Education", emoji: "🎓", icon: "GraduationCap", color: "from-blue-400 to-indigo-500" },
  { id: "home", label: "Home & Furniture", emoji: "🏠", icon: "Home", color: "from-amber-400 to-orange-500" },
  { id: "nature", label: "Nature & Environment", emoji: "🌿", icon: "Leaf", color: "from-green-400 to-teal-500" },
  { id: "emotions", label: "Emotions & Feelings", emoji: "😊", icon: "Smile", color: "from-yellow-400 to-amber-500" },
  { id: "clothing", label: "Clothing & Fashion", emoji: "👕", icon: "Shirt", color: "from-purple-400 to-pink-500" },
  { id: "sports", label: "Sports & Fitness", emoji: "⚽", icon: "Dumbbell", color: "from-lime-400 to-green-500" },
  { id: "money", label: "Money & Shopping", emoji: "💰", icon: "Wallet", color: "from-emerald-400 to-green-600" },
  { id: "weather", label: "Weather & Time", emoji: "🌤️", icon: "CloudSun", color: "from-cyan-400 to-sky-500" },
  { id: "animals", label: "Animals", emoji: "🐾", icon: "PawPrint", color: "from-orange-400 to-amber-500" },
  { id: "city", label: "City & Places", emoji: "🏙️", icon: "Building2", color: "from-gray-400 to-slate-600" },
  { id: "communication", label: "Communication", emoji: "💬", icon: "MessageCircle", color: "from-blue-400 to-cyan-500" },
  { id: "arts", label: "Arts & Culture", emoji: "🎨", icon: "Palette", color: "from-fuchsia-400 to-purple-500" },
  { id: "verbs", label: "Common Verbs", emoji: "🏃", icon: "Zap", color: "from-red-400 to-rose-500" },
  { id: "adjectives", label: "Common Adjectives", emoji: "🔤", icon: "Sparkles", color: "from-violet-400 to-indigo-500" },
];

export const vocabTopicMap: Record<string, VocabTopic> = Object.fromEntries(
  vocabTopics.map((t) => [t.id, t]),
);
