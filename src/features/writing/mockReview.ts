import type { Correction, WritingReview } from "./review-types";

/** Common Spanish-speaker mistakes, used only when the AI endpoint is unreachable. */
const knownMistakes: Correction[] = [
  { wrong: "peoples", right: "people", category: "grammar", explanation: "'People' is already plural — no 's' needed." },
  { wrong: "informations", right: "information", category: "grammar", explanation: "'Information' is uncountable in English." },
  { wrong: "i ", right: "I ", category: "punctuation", explanation: "The pronoun 'I' is always capitalized." },
  { wrong: "is depend", right: "depends", category: "grammar", explanation: "Main verbs don't need 'is': 'it depends'." },
  { wrong: "make a party", right: "have a party", category: "collocation", explanation: "Collocation: you 'have' or 'throw' a party." },
  { wrong: "very much people", right: "many people", category: "vocabulary", explanation: "Use 'many' with countable nouns like 'people'." },
  { wrong: "actually", right: "currently", category: "vocabulary", explanation: "False friend: 'actualmente' is 'currently', not 'actually'." },
  { wrong: "assist to", right: "attend", category: "vocabulary", explanation: "False friend: 'asistir a' is 'attend', not 'assist to'." },
];

export function buildDemoReview(text: string, minWords: number, maxWords: number): WritingReview {
  const corrections = knownMistakes.filter((m) =>
    text.toLowerCase().includes(m.wrong.toLowerCase()),
  );

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const inRange = words >= minWords && words <= maxWords;
  const grammar = Math.max(50, 95 - corrections.length * 10);
  const taskResponse = inRange ? 90 : 65;
  const overall = Math.round(grammar * 0.4 + taskResponse * 0.3 + 85 * 0.3);

  let improved = text;
  for (const c of corrections) {
    improved = improved.replace(new RegExp(c.wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), c.right);
  }

  return {
    corrections,
    scores: { grammar, vocabulary: 85, coherence: 85, taskResponse, overall },
    feedback: inRange
      ? "Nice work staying on topic. Review the highlighted corrections and try using richer connectors like 'however' or 'moreover'."
      : `Good effort! Aim for ${minWords}–${maxWords} words to fully answer the prompt, and review the highlighted corrections.`,
    improvedVersion: improved,
    vocabularySuggestions: [
      { word: "however", translation: "sin embargo", example: "I was tired. However, I finished the essay." },
      { word: "moreover", translation: "además", example: "Moreover, the park is free to visit." },
      { word: "whereas", translation: "mientras que", example: "I like tea, whereas my brother prefers coffee." },
    ],
    source: "demo",
  };
}
