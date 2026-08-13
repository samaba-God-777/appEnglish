import type { CefrLevel } from "@/types";

export type GrammarCategory =
  | "Present Tenses"
  | "Past Tenses"
  | "Future Tenses"
  | "Conditionals"
  | "Structures"
  | "Modals";

export interface GrammarStructure {
  affirmative: string;
  negative: string;
  question: string;
}

export interface GrammarUse {
  rule: string;
  example: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  level: CefrLevel;
  category: GrammarCategory;
  summary: string;
  structure: GrammarStructure;
  uses: GrammarUse[];
  signalWords: string[];
  examples: string[];
  exceptions: string[];
}

export const grammarTopics: GrammarTopic[] = [
  // ─────────────────────────────── PRESENT ───────────────────────────────
  {
    id: "present-simple",
    title: "Present Simple",
    level: "A1",
    category: "Present Tenses",
    summary: "Facts, habits, routines and permanent situations.",
    structure: {
      affirmative: "Subject + base verb (+ s/es for he/she/it)",
      negative: "Subject + do/does + not + base verb",
      question: "Do/Does + subject + base verb?",
    },
    uses: [
      { rule: "Habits and routines", example: "She drinks coffee every morning." },
      { rule: "Permanent facts and general truths", example: "Water boils at 100 °C." },
      { rule: "Timetables and schedules (fixed future)", example: "The train leaves at 6 p.m." },
      { rule: "States and feelings (with stative verbs)", example: "I love this song." },
    ],
    signalWords: ["always", "usually", "often", "sometimes", "never", "every day", "on Mondays"],
    examples: [
      "I work in a hospital.",
      "He doesn't eat meat.",
      "Do they live near here?",
    ],
    exceptions: [
      "Third person singular adds -s: work → works.",
      "Verbs ending in -o, -ss, -sh, -ch, -x add -es: go → goes, watch → watches.",
      "Consonant + y → -ies: study → studies (but play → plays after a vowel).",
      "'Be' and modal verbs do not use do/does.",
      "Stative verbs (know, want, believe, own) are normally not used in the continuous.",
    ],
  },
  {
    id: "present-continuous",
    title: "Present Continuous",
    level: "A1",
    category: "Present Tenses",
    summary: "Actions happening now or around now, and fixed future arrangements.",
    structure: {
      affirmative: "Subject + am/is/are + verb-ing",
      negative: "Subject + am/is/are + not + verb-ing",
      question: "Am/Is/Are + subject + verb-ing?",
    },
    uses: [
      { rule: "Actions in progress right now", example: "She is reading a book." },
      { rule: "Temporary situations around now", example: "I'm staying with friends this week." },
      { rule: "Fixed future arrangements", example: "We're meeting John tomorrow." },
      { rule: "Changing or developing situations", example: "The climate is getting warmer." },
    ],
    signalWords: ["now", "right now", "at the moment", "currently", "today", "this week", "Look!", "Listen!"],
    examples: [
      "They are playing football.",
      "He isn't working today.",
      "Are you listening to me?",
    ],
    exceptions: [
      "Spelling: drop silent -e before -ing: make → making.",
      "One-syllable CVC words double the final consonant: run → running, sit → sitting.",
      "-ie → -ying: lie → lying, die → dying.",
      "Stative verbs (like, know, understand) are usually not used here.",
      "Some verbs change meaning: 'I'm thinking' (process) vs 'I think' (opinion).",
    ],
  },
  {
    id: "present-perfect",
    title: "Present Perfect",
    level: "B1",
    category: "Present Tenses",
    summary: "A past action with a present result or an unfinished time period.",
    structure: {
      affirmative: "Subject + have/has + past participle",
      negative: "Subject + have/has + not + past participle",
      question: "Have/Has + subject + past participle?",
    },
    uses: [
      { rule: "Life experiences (unspecified time)", example: "I have visited Japan." },
      { rule: "Past action with a present result", example: "She has lost her keys (she can't get in now)." },
      { rule: "Unfinished time periods", example: "We have studied a lot this week." },
      { rule: "Recent actions with 'just', 'already', 'yet'", example: "They have just arrived." },
    ],
    signalWords: ["ever", "never", "just", "already", "yet", "since", "for", "recently", "so far"],
    examples: [
      "Have you ever been abroad?",
      "He has already finished his homework.",
      "I haven't seen that film yet.",
    ],
    exceptions: [
      "Use 'since' with a point in time, 'for' with a duration: since 2020 / for three years.",
      "Do NOT use with finished time words (yesterday, last year) — use Past Simple instead.",
      "American English often prefers Past Simple where British English uses Present Perfect.",
      "'Been' = went and came back; 'gone' = went and is still there.",
    ],
  },
  {
    id: "present-perfect-continuous",
    title: "Present Perfect Continuous",
    level: "B1",
    category: "Present Tenses",
    summary: "An action that started in the past and is still continuing (emphasis on duration).",
    structure: {
      affirmative: "Subject + have/has + been + verb-ing",
      negative: "Subject + have/has + not + been + verb-ing",
      question: "Have/Has + subject + been + verb-ing?",
    },
    uses: [
      { rule: "Action continuing up to now", example: "I have been studying for three hours." },
      { rule: "Recent activity with visible results", example: "You're tired because you've been running." },
      { rule: "Emphasis on how long, not how many", example: "She has been working here since May." },
    ],
    signalWords: ["for", "since", "all day", "all morning", "how long", "lately", "recently"],
    examples: [
      "It has been raining all day.",
      "How long have you been waiting?",
      "They haven't been getting along recently.",
    ],
    exceptions: [
      "Stative verbs use Present Perfect Simple, not continuous: 'I have known him for years' (not 'been knowing').",
      "Use the simple form when the result/quantity matters: 'I've read three books' vs 'I've been reading'.",
    ],
  },
  // ──────────────────────────────── PAST ────────────────────────────────
  {
    id: "past-simple",
    title: "Past Simple",
    level: "A2",
    category: "Past Tenses",
    summary: "Completed actions at a specific finished time in the past.",
    structure: {
      affirmative: "Subject + past form (verb-ed / irregular)",
      negative: "Subject + did + not + base verb",
      question: "Did + subject + base verb?",
    },
    uses: [
      { rule: "Finished actions at a definite time", example: "I visited Rome in 2019." },
      { rule: "A sequence of past events", example: "She woke up, got dressed and left." },
      { rule: "Past habits (also 'used to')", example: "We played outside every summer." },
    ],
    signalWords: ["yesterday", "last week", "ago", "in 2010", "then", "when I was young"],
    examples: [
      "They watched a film last night.",
      "He didn't call me.",
      "Did you enjoy the party?",
    ],
    exceptions: [
      "Regular verbs add -ed; consonant + y → -ied: study → studied.",
      "One-syllable CVC verbs double the consonant: stop → stopped.",
      "Many common verbs are irregular: go → went, buy → bought, see → saw.",
      "After 'did' the main verb returns to its base form: 'Did you go?' (not 'went').",
      "'Be' has two forms: was (I/he/she/it) and were (you/we/they).",
    ],
  },
  {
    id: "past-continuous",
    title: "Past Continuous",
    level: "A2",
    category: "Past Tenses",
    summary: "An action in progress at a moment in the past, often interrupted.",
    structure: {
      affirmative: "Subject + was/were + verb-ing",
      negative: "Subject + was/were + not + verb-ing",
      question: "Was/Were + subject + verb-ing?",
    },
    uses: [
      { rule: "Action in progress at a past time", example: "At 8 p.m. I was having dinner." },
      { rule: "A longer action interrupted by a shorter one", example: "I was cooking when the phone rang." },
      { rule: "Two parallel past actions", example: "She was reading while he was cooking." },
      { rule: "Background description in a story", example: "The sun was shining and birds were singing." },
    ],
    signalWords: ["while", "as", "when", "at that moment", "all day yesterday"],
    examples: [
      "They were waiting for the bus.",
      "He wasn't listening.",
      "What were you doing at midnight?",
    ],
    exceptions: [
      "Same -ing spelling rules as Present Continuous.",
      "Use 'when' + Past Simple for the interruption, 'while' + Past Continuous for the long action.",
      "Stative verbs normally use Past Simple: 'I knew the answer' (not 'was knowing').",
    ],
  },
  {
    id: "past-perfect",
    title: "Past Perfect",
    level: "B1",
    category: "Past Tenses",
    summary: "An action completed before another past action ('the past of the past').",
    structure: {
      affirmative: "Subject + had + past participle",
      negative: "Subject + had + not + past participle",
      question: "Had + subject + past participle?",
    },
    uses: [
      { rule: "Earlier of two past actions", example: "The train had left before we arrived." },
      { rule: "Cause of a past situation", example: "She was upset because she had failed." },
      { rule: "Reported speech (backshift of Past Simple/Present Perfect)", example: "He said he had finished." },
    ],
    signalWords: ["already", "before", "after", "by the time", "just", "never … before", "when"],
    examples: [
      "By 10 a.m. they had sold everything.",
      "I hadn't met him before that day.",
      "Had you eaten when I called?",
    ],
    exceptions: [
      "Only needed to show one past action happened before another — a single past action uses Past Simple.",
      "With 'after' the sequence is clear, so Past Simple is often acceptable: 'After she left, we ate.'",
    ],
  },
  {
    id: "past-perfect-continuous",
    title: "Past Perfect Continuous",
    level: "B2",
    category: "Past Tenses",
    summary: "A continuing action that had been happening before another past moment.",
    structure: {
      affirmative: "Subject + had + been + verb-ing",
      negative: "Subject + had + not + been + verb-ing",
      question: "Had + subject + been + verb-ing?",
    },
    uses: [
      { rule: "Duration of an action up to a past point", example: "She had been working there for ten years when it closed." },
      { rule: "Past cause with continuous emphasis", example: "He was tired because he had been running." },
    ],
    signalWords: ["for", "since", "before", "how long", "all day"],
    examples: [
      "They had been driving for hours before they stopped.",
      "I hadn't been sleeping well, so I felt exhausted.",
      "How long had you been waiting when the bus came?",
    ],
    exceptions: [
      "Stative verbs take Past Perfect Simple instead: 'had known', not 'had been knowing'.",
      "Use the simple form when a quantity is stated: 'She had written five reports.'",
    ],
  },
  // ─────────────────────────────── FUTURE ───────────────────────────────
  {
    id: "future-will",
    title: "Future Simple (will)",
    level: "A2",
    category: "Future Tenses",
    summary: "Predictions, instant decisions, promises and offers.",
    structure: {
      affirmative: "Subject + will + base verb",
      negative: "Subject + will + not (won't) + base verb",
      question: "Will + subject + base verb?",
    },
    uses: [
      { rule: "Predictions based on opinion", example: "I think it will rain tomorrow." },
      { rule: "Instant decisions (at the moment of speaking)", example: "I'll help you with that." },
      { rule: "Promises, offers and requests", example: "I'll always love you." },
      { rule: "Facts about the future", example: "She will be 30 next year." },
    ],
    signalWords: ["tomorrow", "next week", "soon", "in the future", "probably", "I think", "I promise"],
    examples: [
      "They will arrive at noon.",
      "He won't come to the party.",
      "Will you marry me?",
    ],
    exceptions: [
      "Use 'going to' (not 'will') for plans already decided and for evidence-based predictions.",
      "After 'if/when/before/after' use the present, not 'will': 'When I get home, I'll call you.'",
      "'Shall' is a formal alternative for I/we, mainly in offers and suggestions: 'Shall we go?'",
    ],
  },
  {
    id: "future-going-to",
    title: "Future with 'going to'",
    level: "A2",
    category: "Future Tenses",
    summary: "Plans and intentions already made, and predictions based on present evidence.",
    structure: {
      affirmative: "Subject + am/is/are + going to + base verb",
      negative: "Subject + am/is/are + not + going to + base verb",
      question: "Am/Is/Are + subject + going to + base verb?",
    },
    uses: [
      { rule: "Plans and intentions decided before speaking", example: "We are going to buy a house." },
      { rule: "Predictions based on present evidence", example: "Look at those clouds — it's going to rain." },
    ],
    signalWords: ["tonight", "next month", "this weekend", "soon", "in a minute"],
    examples: [
      "I'm going to study medicine.",
      "She isn't going to accept the offer.",
      "Are you going to tell him?",
    ],
    exceptions: [
      "With verbs of movement, present continuous is often preferred: 'We're going to go' → 'We're going.'",
      "For instant decisions use 'will', not 'going to'.",
    ],
  },
  {
    id: "future-continuous",
    title: "Future Continuous",
    level: "B1",
    category: "Future Tenses",
    summary: "An action that will be in progress at a specific future time.",
    structure: {
      affirmative: "Subject + will + be + verb-ing",
      negative: "Subject + will + not + be + verb-ing",
      question: "Will + subject + be + verb-ing?",
    },
    uses: [
      { rule: "Action in progress at a future moment", example: "This time tomorrow I'll be flying to Paris." },
      { rule: "Polite enquiries about plans", example: "Will you be using the car tonight?" },
      { rule: "Expected/planned future events", example: "I'll be seeing her at the meeting." },
    ],
    signalWords: ["this time tomorrow", "at 8 p.m. tomorrow", "in the future", "all day tomorrow"],
    examples: [
      "They'll be waiting for us.",
      "He won't be working next week.",
      "What will you be doing at noon?",
    ],
    exceptions: [
      "Stative verbs use Future Simple: 'I'll know soon' (not 'will be knowing').",
    ],
  },
  {
    id: "future-perfect",
    title: "Future Perfect",
    level: "B2",
    category: "Future Tenses",
    summary: "An action that will be completed before a specific point in the future.",
    structure: {
      affirmative: "Subject + will + have + past participle",
      negative: "Subject + will + not + have + past participle",
      question: "Will + subject + have + past participle?",
    },
    uses: [
      { rule: "Completed before a future deadline", example: "By 2030 they will have finished the bridge." },
      { rule: "Assumptions about the recent past", example: "She will have arrived by now." },
    ],
    signalWords: ["by", "by then", "by the time", "before", "in two years"],
    examples: [
      "I will have graduated by June.",
      "They won't have left before we get there.",
      "Will you have completed the report by Friday?",
    ],
    exceptions: [
      "After 'by the time' use the present simple: 'By the time you arrive, I'll have cooked dinner.'",
    ],
  },
  {
    id: "future-perfect-continuous",
    title: "Future Perfect Continuous",
    level: "C1",
    category: "Future Tenses",
    summary: "The duration of an action up to a point in the future.",
    structure: {
      affirmative: "Subject + will + have + been + verb-ing",
      negative: "Subject + will + not + have + been + verb-ing",
      question: "Will + subject + have + been + verb-ing?",
    },
    uses: [
      { rule: "How long an action will have continued", example: "By May I will have been working here for ten years." },
      { rule: "Cause of a future situation", example: "He'll be exhausted — he'll have been travelling all night." },
    ],
    signalWords: ["by", "for", "by the time", "in … years' time"],
    examples: [
      "By 2026 they will have been building it for a decade.",
      "She won't have been studying long enough to pass.",
      "How long will you have been living here by next year?",
    ],
    exceptions: [
      "Rare in everyday speech; stative verbs use Future Perfect Simple instead.",
    ],
  },
  // ────────────────────────── CONDITIONALS ──────────────────────────
  {
    id: "conditionals",
    title: "Conditionals (0–3 & Mixed)",
    level: "B1",
    category: "Conditionals",
    summary: "'If' sentences describing real, possible, unreal and past situations.",
    structure: {
      affirmative: "If + condition clause, + result clause",
      negative: "If + subject + (do not/did not/had not) …, …",
      question: "What will/would happen if …?",
    },
    uses: [
      { rule: "Zero — general truths (if + present, present)", example: "If you heat ice, it melts." },
      { rule: "First — real future (if + present, will)", example: "If it rains, I will stay home." },
      { rule: "Second — unreal present (if + past, would)", example: "If I were rich, I would travel." },
      { rule: "Third — unreal past (if + past perfect, would have)", example: "If I had studied, I would have passed." },
    ],
    signalWords: ["if", "unless", "as long as", "provided that", "in case", "were I to", "had I known"],
    examples: [
      "Unless you hurry, you'll miss the train.",
      "If I had known, I would have told you.",
      "Mixed: If I had saved money, I would be rich now.",
    ],
    exceptions: [
      "Use 'were' for all persons in the second conditional: 'If I were you…'.",
      "Do NOT use 'will' or 'would' in the if-clause.",
      "'Unless' = 'if not'.",
      "Formal inversion can replace 'if': 'Had I known…', 'Were I rich…', 'Should you need…'.",
    ],
  },
  // ────────────────────────── STRUCTURES ──────────────────────────
  {
    id: "passive-voice",
    title: "Passive Voice",
    level: "B1",
    category: "Structures",
    summary: "Focus on the action or the receiver rather than who does it.",
    structure: {
      affirmative: "Object + be (correct tense) + past participle (+ by + agent)",
      negative: "Object + be + not + past participle",
      question: "Be + object + past participle?",
    },
    uses: [
      { rule: "The doer is unknown or unimportant", example: "The window was broken." },
      { rule: "Formal, scientific or news writing", example: "The samples were analysed carefully." },
      { rule: "To keep known information first", example: "This bridge was built in 1890." },
    ],
    signalWords: ["by", "is/are made", "was/were done", "has been", "will be"],
    examples: [
      "English is spoken here.",
      "The report hasn't been finished.",
      "Were the tickets sold?",
    ],
    exceptions: [
      "Only transitive verbs (with an object) can be passive.",
      "The tense is carried by the verb 'be': is done, was done, has been done, will be done.",
      "Add 'by + agent' only when the doer is important.",
      "Intransitive verbs (arrive, sleep, happen) have no passive.",
    ],
  },
  {
    id: "reported-speech",
    title: "Reported Speech",
    level: "B2",
    category: "Structures",
    summary: "Telling what someone said, usually with a tense 'backshift'.",
    structure: {
      affirmative: "Subject + said (that) + backshifted clause",
      negative: "Subject + said (that) + subject + didn't …",
      question: "Subject + asked + if/wh- + subject + verb (no inversion)",
    },
    uses: [
      { rule: "Reporting statements", example: "\"I'm tired.\" → He said he was tired." },
      { rule: "Reporting questions (no inversion, no ?)", example: "\"Where do you live?\" → She asked where I lived." },
      { rule: "Reporting commands (tell + to-infinitive)", example: "\"Sit down.\" → He told me to sit down." },
    ],
    signalWords: ["said", "told", "asked", "explained", "that", "if", "whether"],
    examples: [
      "\"I will call you.\" → He said he would call me.",
      "\"Have you eaten?\" → She asked if I had eaten.",
      "\"Don't touch it.\" → He warned me not to touch it.",
    ],
    exceptions: [
      "Backshift: present → past, past → past perfect, will → would, can → could, must → had to.",
      "Time/place words change: now → then, today → that day, here → there, this → that.",
      "No backshift needed if the statement is still true: 'She said she likes coffee.'",
      "'Say' has no object; 'tell' needs one: say to me / tell me.",
    ],
  },
  {
    id: "inversion-emphasis",
    title: "Inversion & Emphasis",
    level: "C1",
    category: "Structures",
    summary: "Advanced word order for emphasis, formality and dramatic effect.",
    structure: {
      affirmative: "Negative adverbial + auxiliary + subject + verb",
      negative: "Not until … + did + subject + verb",
      question: "(Structure mirrors question word order)",
    },
    uses: [
      { rule: "After negative adverbials", example: "Never have I seen such a mess." },
      { rule: "After 'hardly/no sooner' with sequence", example: "No sooner had we left than it rained." },
      { rule: "Conditional inversion (formal)", example: "Had I known, I would have helped." },
      { rule: "Cleft sentences for emphasis", example: "It was John who broke it." },
    ],
    signalWords: ["never", "rarely", "seldom", "hardly", "no sooner", "not only", "little", "only then"],
    examples: [
      "Not only did she win, but she also set a record.",
      "Little did he know what was coming.",
      "Only after the meeting did I understand.",
    ],
    exceptions: [
      "Inversion is mostly used in formal or literary English.",
      "The auxiliary carries the tense: 'Never have I…', 'Rarely does she…'.",
      "'Not only … but also' inverts the first clause only.",
    ],
  },
  // ──────────────────────────── MODALS ────────────────────────────
  {
    id: "modal-verbs",
    title: "Modal Verbs",
    level: "B1",
    category: "Modals",
    summary: "Ability, permission, obligation, advice, possibility and deduction.",
    structure: {
      affirmative: "Subject + modal + base verb",
      negative: "Subject + modal + not + base verb",
      question: "Modal + subject + base verb?",
    },
    uses: [
      { rule: "Ability — can/could", example: "She can swim. / He could read at four." },
      { rule: "Obligation — must/have to; advice — should/ought to", example: "You must stop. / You should rest." },
      { rule: "Possibility & deduction — may/might/could/must/can't", example: "He must be tired. / It might rain." },
      { rule: "Permission & requests — can/could/may", example: "May I come in? / Could you help?" },
    ],
    signalWords: ["can", "could", "may", "might", "must", "shall", "should", "will", "would", "ought to"],
    examples: [
      "You mustn't smoke here.",
      "We should have left earlier.",
      "She can't be serious.",
    ],
    exceptions: [
      "Modals take no -s and are followed by the base verb (no 'to'), except 'ought to'.",
      "They have no infinitive or -ing form; use substitutes: 'be able to', 'have to'.",
      "'Must' (personal obligation) vs 'have to' (external rule); 'mustn't' (prohibition) vs 'don't have to' (no obligation).",
      "Past deduction: modal + have + past participle — 'He must have left.'",
    ],
  },
];

export const grammarCategories: GrammarCategory[] = [
  "Present Tenses",
  "Past Tenses",
  "Future Tenses",
  "Conditionals",
  "Structures",
  "Modals",
];

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return grammarTopics.find((t) => t.id === id);
}
