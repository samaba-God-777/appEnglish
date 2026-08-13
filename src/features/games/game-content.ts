import { flashDecks } from "@/features/flashcards/flashcard-decks";

export interface WordPair {
  word: string;
  meaning: string;
}

/** Word ↔ meaning pairs drawn from the flashcard decks, for Hangman and Memory Match. */
export const gameWordPairs: WordPair[] = flashDecks
  .flatMap((deck) => deck.cards)
  .map((card) => ({ word: card.word, meaning: card.definition }));

/** Short, natural sentences for Typing Race and Sentence Builder. */
export const gameSentences: string[] = [
  "The early bird catches the worm.",
  "Practice makes perfect every single day.",
  "She has been learning English for years.",
  "We should leave before it gets dark.",
  "He always drinks coffee in the morning.",
  "They are planning a trip to London.",
  "I have never seen such a beautiful sunset.",
  "Reading books improves your vocabulary quickly.",
  "Could you please repeat the question slowly?",
  "The meeting was postponed until next Friday.",
  "Honesty is the best policy in life.",
  "My brother works at a busy hospital.",
];

export interface Idiom {
  idiom: string;
  meaning: string;
}

/** Common English idioms with plain-language meanings, for the Idiom Challenge. */
export const idioms: Idiom[] = [
  { idiom: "break the ice", meaning: "to make people feel more relaxed" },
  { idiom: "hit the books", meaning: "to study hard" },
  { idiom: "under the weather", meaning: "feeling slightly ill" },
  { idiom: "a piece of cake", meaning: "something very easy" },
  { idiom: "once in a blue moon", meaning: "very rarely" },
  { idiom: "spill the beans", meaning: "to reveal a secret" },
  { idiom: "cost an arm and a leg", meaning: "to be very expensive" },
  { idiom: "call it a day", meaning: "to stop working for the day" },
  { idiom: "the ball is in your court", meaning: "it is your decision now" },
  { idiom: "bite the bullet", meaning: "to face something difficult bravely" },
  { idiom: "cut corners", meaning: "to do something cheaply or carelessly" },
  { idiom: "hit the nail on the head", meaning: "to be exactly right" },
];

/** Longer, trickier sentences for the Listening Dictation challenge. */
export const dictationSentences: string[] = [
  "The committee agreed to postpone the decision until further notice.",
  "Despite the heavy rain, the ceremony continued as planned.",
  "She reluctantly admitted that she had misunderstood the instructions.",
  "Our flight was delayed because of unexpected technical difficulties.",
  "He managed to finish the report before the strict deadline.",
  "They were thoroughly impressed by the museum's remarkable collection.",
  "Learning a language requires patience, practice, and consistent effort.",
  "The negotiations were surprisingly smooth and mutually beneficial.",
];

/** Deterministic shuffle so results are stable per input (no flicker on re-render). */
export function shuffle<T>(items: T[], seed = 1): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor((Math.abs(Math.sin(seed + i)) * 10000) % (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
