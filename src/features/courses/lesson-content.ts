import type { CefrLevel } from "@/types";
import type { Lesson } from "./course-content";
import { questionBankByLevel } from "./level-content";

/** A single interactive step inside a lesson. */
export type LessonStep =
  | { kind: "intro"; heading: string; body: string; example?: string }
  | { kind: "mcq"; question: string; options: string[]; answerIndex: number; explanation: string }
  | { kind: "gapfill"; prompt: string; options: string[]; answerIndex: number; explanation: string }
  | { kind: "listen"; text: string; question: string; options: string[]; answerIndex: number; explanation: string }
  | { kind: "speak"; text: string }
  | { kind: "read"; passage: string; question: string; options: string[]; answerIndex: number; explanation: string }
  | { kind: "write"; prompt: string; hint: string }
  | { kind: "finish"; summary: string };

const TYPE_HEADS: Record<string, { heading: string; body: string; example?: string }> = {
  vocabulary: {
    heading: "Key words",
    body: "Learn and use new words in context.",
    example: "Example: the word to join — connect two things together.",
  },
  grammar: {
    heading: "Grammar in context",
    body: "Build accurate sentences step by step.",
    example: "Example: 'She works' — third person takes -s.",
  },
  listening: {
    heading: "Listening focus",
    body: "Listen carefully and catch the key idea.",
    example: "Press Listen, then answer what you understood.",
  },
  speaking: {
    heading: "Pronunciation drill",
    body: "Repeat the sentence out loud, then check your pronunciation.",
    example: "Speak clearly and at a natural pace.",
  },
  reading: {
    heading: "Reading focus",
    body: "Read a short passage and find the main idea.",
    example: "Skim first, then read carefully to answer.",
  },
  writing: {
    heading: "Guided writing",
    body: "Write a few clear sentences on the prompt.",
    example: "Aim for correctness first, then add detail.",
  },
  quiz: {
    heading: "Unit checkpoint",
    body: "Review what you learned with a short quiz.",
    example: "Try to answer without notes.",
  },
};

const READINGS: Record<CefrLevel, string[]> = {
  A1: [
    "Anna lives with her family in a small town. Every morning she goes to work by bus. She likes her job because she talks to many friendly people.",
    "Tom has a dog called Max. Every day after school, Tom takes Max for a walk in the park. It is Max's favourite time of day.",
  ],
  A2: [
    "Last weekend, Sara and her friends decided to visit the beach. They left early and arrived before noon. They swam, ate lunch, and watched the sunset together.",
    "David wants to learn French. He studies for thirty minutes every evening after work. He says it is hard, but he enjoys the challenge.",
  ],
  B1: [
    "In recent years, remote work has transformed how many people spend their day. Employees can now balance home and office tasks, but staying focused without a fixed routine remains a challenge.",
    "Public libraries have quietly reinvented themselves. Beyond lending books, they now host workshops, free internet access, and community events, making them social anchors in many cities.",
  ],
  B2: [
    "Urban planners increasingly argue that pedestrian-friendly design improves both public health and local business. By prioritising walkers and cyclists, cities reduce congestion while increasing street-level activity.",
    "The gig economy offers flexibility but sharply reduces job security. Workers can choose when to work, yet they often sacrifice stable income and the benefits that full-time roles provide.",
  ],
  C1: [
    "The rise of algorithmic curation reshapes how audiences encounter information. It maximises engagement, yet it risks generating echo chambers that narrow, rather than broaden, public discourse.",
    "Asymmetric information, where one party knows more than another, underpins many modern economic problems. Trust remains the fragile condition that lets markets work.",
  ],
};

const LISTENING: Record<CefrLevel, Array<{ text: string; question: string }>> = {
  A1: [
    { text: "My name is Carlos. I am from Panama, and I work as a teacher.", question: "Where is Carlos from?" },
    { text: "The train leaves at nine o'clock in the morning from the main station.", question: "When does the train leave?" },
  ],
  A2: [
    { text: "Hi, I'm calling to cancel my appointment on Thursday because I have an early meeting it.", question: "Why is the caller cancelling?" },
    { text: "I usually cook dinner at home, but on Fridays I meet friends at a restaurant near the park.", question: "What does she do on Fridays?" },
  ],
  B1: [
    { text: "To join, all you need is a valid passport and a recent photo. Applications open at the town hall on the first working day of each month.", question: "What is required to join?" },
    { text: "The hotel room costs eighty euros a night, breakfast included, but we only have two rooms free for the dates you asked about.", question: "What is the hotel situation?" },
  ],
  B2: [
    { text: "The committee concluded that while the proposal would cut costs, it would mostly affect new employees, so they postponed a decision until next quarter.", question: "Why did the committee postpone a decision?" },
    { text: "Even after the market recovered, the firm kept a cautious view, arguing that short-term gains rarely outweigh long-term risk.", question: "What best describes the firm's position?" },
  ],
  C1: [
    { text: "The author argues that unilateral regulation can split an industry that already lacks coordination.", question: "What does the author claim about unilateral regulation?" },
    { text: "While the results look conclusive, some research caveats cast doubt on the link, so we need replication first.", question: "Why is the finding uncertain?" },
  ],
};

const GAPFILLS: Record<CefrLevel, Array<{ prompt: string; key: string }>> = {
  A1: [
    { prompt: "I ___ a student at this school.", key: "am" },
    { prompt: "She ___ two cats at home.", key: "has" },
    { prompt: "We ___ watching a film tonight.", key: "are" },
    { prompt: "He ___ coffee every morning.", key: "drinks" },
  ],
  A2: [
    { prompt: "Yesterday they ___ to the market together.", key: "went" },
    { prompt: "I ___ a book last night before bed.", key: "read" },
    { prompt: "She is ___ than her brother.", key: "taller" },
    { prompt: "We ___ be at school at eight tomorrow.", key: "will" },
  ],
  B1: [
    { prompt: "If it rains, I ___ stay at home.", key: "will" },
    { prompt: "I haven't seen him ___ last summer.", key: "since" },
    { prompt: "He suggested ___ a short break.", key: "taking" },
    { prompt: "They ___ been working here for years.", key: "have" },
  ],
  B2: [
    { prompt: "Hardly ___ she arrived when it started to rain.", key: "had" },
    { prompt: "The project, ___ took months, was a huge success.", key: "which" },
    { prompt: "Despite the weather, the event ___ ahead.", key: "went" },
    { prompt: "It's high time we ___ this problem carefully.", key: "addressed" },
  ],
  C1: [
    { prompt: "No sooner had we sat down ___ the phone rang.", key: "than" },
    { prompt: "Should ___ be any complications, contact us immediately.", key: "there" },
    { prompt: "The new policy is tantamount ___ a complete ban.", key: "to" },
    { prompt: "Not only ___ he meet the deadline, but he exceeded it.", key: "did" },
  ],
};

const WRITING: Record<CefrLevel, Array<{ prompt: string; hint: string }>> = {
  A1: [
    { prompt: "Describe your day in 3–4 simple sentences.", hint: "Start with 'I wake up…', then 'I go…', 'I eat…'." },
    { prompt: "Tell me about your family in 3 sentences.", hint: "Use 'My mother is…', 'I have…'." },
  ],
  A2: [
    { prompt: "Write about your last weekend in 4–5 sentences.", hint: "Use the past simple: 'I went…', 'We watched…'." },
    { prompt: "Describe your favourite place to visit.", hint: "Say where it is, what you do there, and why you like it." },
  ],
  B1: [
    { prompt: "Write a short paragraph about a habit you have.", hint: "Explain what you do, how often, and the benefit it brings." },
    { prompt: "Describe a decision you are proud of and why.", hint: "Give the background, the choice you made, and the result." },
  ],
  B2: [
    { prompt: "Write a short argument for or against smartphones at school.", hint: "Give one strong reason and one counterargument." },
    { prompt: "Describe how remote work affects people you know.", hint: "Cover both the benefits and the difficulties." },
  ],
  C1: [
    { prompt: "Write a concise paragraph on why limiting free data collection is necessary.", hint: "Use precise, abstract vocabulary and a clear logical link." },
    { prompt: "Summarise the main shortfall of current urban-sustainability approaches.", hint: "Balance ambition against feasibility in your wording." },
  ],
};

const SPEECH: Record<CefrLevel, string[]> = {
  A1: [
    "Hello, my name is Carlos and I am from Spain.",
    "I have one brother and two sisters, and we live in a small town.",
    "Today is Monday and the sun is shining.",
    "I like breakfast, and I eat dinner every day.",
  ],
  A2: [
    "Yesterday I went to the market to buy some fresh vegetables.",
    "My favourite place to relax is the park by the river.",
    "I am learning English because I practise every evening.",
    "When the weather is nice, we have dinner outside.",
  ],
  B1: [
    "The weather has been thoroughly unpredictable throughout the year.",
    "Although the film was entertaining, I found the ending quite predictable.",
    "In my opinion, learning a language changes how you see the world.",
    "If I had more free time, I would travel across the country.",
  ],
  B2: [
    "One could argue that the environment should take priority over economic growth.",
    "Despite the downturn, the company stayed healthy thanks to cost discipline.",
    "The implications of automation are complex and deserve careful discussion.",
    "A flexible schedule lets people balance professional and personal life.",
  ],
  C1: [
    "The juxtaposition of old and new methods underscores a clear shift in practice.",
    "Notwithstanding technological change, the human role remains essential.",
    "A nuanced reading of the evidence reveals that these factors interrelate.",
    "The ramifications of such a decision extend beyond the immediate case.",
  ],
};

// Options used for listen/read main-idea steps so an answer is always selectable.
const MAIN_IDEA_OPTIONS: Record<CefrLevel, string[]> = {
  A1: ["The main idea in the text", "A detail not mentioned", "An unrelated topic", "An opposite claim"],
  A2: ["The main idea in the text", "A detail not mentioned", "An unrelated topic", "An opposite claim"],
  B1: ["The main idea in the text", "A side detail", "An unrelated topic", "The opposite claim"],
  B2: ["The central point of the text", "A supporting detail only", "An unrelated topic", "The opposite claim"],
  C1: ["The central argument of the text", "A peripheral detail", "An unrelated topic", "A contrary view"],
};

function bankFor(level: CefrLevel) {
  return questionBankByLevel[level];
}

function pick<T>(list: T[], offset: number): T {
  return list[Math.abs(offset) % list.length]!;
}

/** Build an mcq step from a bank question. */
function mcqOf(q: { question: string; options: string[]; answerIndex: number; explanation: string }): LessonStep {
  return {
    kind: "mcq",
    question: q.question,
    options: q.options,
    answerIndex: q.answerIndex,
    explanation: q.explanation,
  };
}

/** Build a gapfill step, always placing the correct word first with 3 distractors. */
function gapStep(g: { prompt: string; key: string }, offset: number): LessonStep {
  const distractors = [
    "am", "are", "has", "have", "will", "which", "than", "to", "there", "did",
    "went", "taking", "taller", "read", "had", "addressed", "since", "one",
  ].filter((d) => d !== g.key);
  const picked = Array.from({ length: 3 }, (_, i) => pick(distractors, offset + i));
  const options = [g.key, ...picked];
  return {
    kind: "gapfill",
    prompt: g.prompt,
    options,
    answerIndex: 0, // correct word is first
    explanation: `Fill the blank with the correct word: “${g.key}”.`,
  };
}

function listenStep(l: { text: string; question: string }, level: CefrLevel): LessonStep {
  return {
    kind: "listen",
    text: l.text,
    question: l.question,
    options: MAIN_IDEA_OPTIONS[level],
    answerIndex: 0,
    explanation: "The speaker states this directly — listen for the key detail.",
  };
}

function readStep(passage: string, level: CefrLevel): LessonStep {
  return {
    kind: "read",
    passage,
    question: "Read the passage, then choose the main idea.",
    options: MAIN_IDEA_OPTIONS[level],
    answerIndex: 0,
    explanation: "The passage states this idea most fully.",
  };
}

/** Build the ordered lesson steps for a lesson. Deterministic on (type, level, index). */
export function buildLessonSteps(lesson: Lesson): LessonStep[] {
  const level = lesson.level;
  const bank = bankFor(level);
  const off = lesson.index;
  const head = TYPE_HEADS[lesson.type];

  const intro: LessonStep = {
    kind: "intro",
    heading: head?.heading ?? "Lesson",
    body: head?.body ?? "Work through the steps.",
    example: head?.example,
  };

  const q = (n: number) => pick(bank, off + n);
  const gap = (n: number) => pick(GAPFILLS[level], off + n);
  const lis = (n: number) => pick(LISTENING[level], off + n);
  const wrt = (n: number) => pick(WRITING[level], off + n);
  const read = (n: number) => pick(READINGS[level], off + n);
  const spk = (n: number) => pick(SPEECH[level], off + n);

  const full = { kind: "finish", summary: "Lesson complete!" } as const;

  switch (lesson.type) {
    case "vocabulary":
      return [intro, mcqOf(q(0)), gapStep(gap(0), off), mcqOf(q(1)), full];
    case "grammar":
      return [intro, gapStep(gap(0), off), mcqOf(q(0)), gapStep(gap(1), off + 2), full];
    case "listening":
      return [intro, listenStep(lis(0), level), mcqOf(q(0)), full];
    case "speaking":
      return [intro, { kind: "speak", text: spk(0) }, { kind: "speak", text: spk(1) }, full];
    case "reading":
      return [intro, readStep(read(0), level), mcqOf(q(0)), full];
    case "writing":
      return [
        intro,
        { kind: "write", prompt: wrt(0).prompt, hint: wrt(0).hint },
        { kind: "finish", summary: "Nice work — keep practising your writing!" },
      ];
    case "quiz":
      return [
        intro,
        mcqOf(q(0)),
        mcqOf(q(1)),
        mcqOf(q(2)),
        { kind: "finish", summary: "Checkpoint complete — you've reviewed the key ideas!" },
      ];
    default:
      return [intro, mcqOf(q(0)), mcqOf(q(1)), full];
  }
}