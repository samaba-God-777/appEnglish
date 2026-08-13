export type WritingLevel = "A2" | "B1" | "B2" | "C1";

export interface EssayType {
  id: string;
  name: string;
  purpose: string;
}

/** The 20 classic ESL essay types. `purpose` is also sent to the AI so it grades structure accordingly. */
export const essayTypes: EssayType[] = [
  { id: "descriptive", name: "Descriptive Essay", purpose: "Describe a person, place, object or experience using rich sensory detail." },
  { id: "narrative", name: "Narrative Essay", purpose: "Tell a story or personal experience with a clear sequence of events." },
  { id: "expository", name: "Expository Essay", purpose: "Explain a topic objectively using facts and information." },
  { id: "argumentative", name: "Argumentative Essay", purpose: "Present a position and defend it with evidence." },
  { id: "persuasive", name: "Persuasive Essay", purpose: "Convince the reader to accept an opinion or take action." },
  { id: "compare-contrast", name: "Compare and Contrast Essay", purpose: "Compare and contrast two or more subjects." },
  { id: "cause-effect", name: "Cause and Effect Essay", purpose: "Explain the causes and consequences of an event or situation." },
  { id: "process", name: "Process Essay", purpose: "Explain how to do something step by step." },
  { id: "definition", name: "Definition Essay", purpose: "Define and explain the meaning of a concept." },
  { id: "analytical", name: "Analytical Essay", purpose: "Analyze a work, topic or problem in depth." },
  { id: "critical", name: "Critical Essay", purpose: "Evaluate and critique a work, theory or idea using arguments." },
  { id: "reflective", name: "Reflective Essay", purpose: "Reflect on personal experiences and what was learned from them." },
  { id: "problem-solution", name: "Problem-Solution Essay", purpose: "Present a problem and propose possible solutions." },
  { id: "opinion", name: "Opinion Essay", purpose: "Express and justify the author's opinion on a topic." },
  { id: "advantages-disadvantages", name: "Advantages and Disadvantages Essay", purpose: "Analyze the positive and negative aspects of a topic." },
  { id: "discussion", name: "Discussion Essay", purpose: "Present different points of view before reaching a conclusion." },
  { id: "classification", name: "Classification Essay", purpose: "Organize ideas or items into categories." },
  { id: "illustration", name: "Illustration Essay", purpose: "Explain an idea using specific examples." },
  { id: "research", name: "Research Essay", purpose: "Present information based on research and sources." },
  { id: "literary-response", name: "Literary Response Essay", purpose: "Analyze and respond to a literary work." },
];

export function essayTypeById(id: string): EssayType | undefined {
  return essayTypes.find((t) => t.id === id);
}

/** Display label with graceful fallback for legacy stored essays ("opinion", "story", "email", "description"). */
export function essayTypeName(id: string): string {
  const legacy: Record<string, string> = {
    story: "Narrative Essay",
    email: "Email",
    description: "Descriptive Essay",
  };
  return essayTypeById(id)?.name ?? legacy[id] ?? id;
}

export const writingLevels: WritingLevel[] = ["A2", "B1", "B2", "C1"];

export const wordRanges: Record<WritingLevel, { min: number; max: number }> = {
  A2: { min: 40, max: 70 },
  B1: { min: 80, max: 120 },
  B2: { min: 120, max: 180 },
  C1: { min: 180, max: 250 },
};

export interface WritingPrompt {
  id: string;
  typeId: string;
  text: string;
}

export const writingPrompts: WritingPrompt[] = [
  { id: "descriptive-1", typeId: "descriptive", text: "Describe your ideal weekend. What do you do, who are you with, and why does it make you happy?" },
  { id: "descriptive-2", typeId: "descriptive", text: "Describe a place from your childhood that you remember vividly. Use the five senses." },
  { id: "narrative-1", typeId: "narrative", text: "Tell the story of a time when a plan went wrong but everything ended well." },
  { id: "narrative-2", typeId: "narrative", text: "Write about a journey (real or imagined) that changed how you see the world." },
  { id: "expository-1", typeId: "expository", text: "Explain how social media has changed the way people communicate." },
  { id: "expository-2", typeId: "expository", text: "Explain why sleep is important for learning and memory." },
  { id: "argumentative-1", typeId: "argumentative", text: "Should homework be banned in schools? Take a position and defend it with evidence." },
  { id: "argumentative-2", typeId: "argumentative", text: "Is technology making people more or less connected? Defend your position." },
  { id: "persuasive-1", typeId: "persuasive", text: "Convince your reader to adopt one healthy habit this month." },
  { id: "persuasive-2", typeId: "persuasive", text: "Persuade your city to create more green spaces instead of parking lots." },
  { id: "compare-contrast-1", typeId: "compare-contrast", text: "Compare living in a big city with living in a small town." },
  { id: "compare-contrast-2", typeId: "compare-contrast", text: "Compare studying online with studying in a classroom." },
  { id: "cause-effect-1", typeId: "cause-effect", text: "Explain the causes and effects of stress in modern life." },
  { id: "cause-effect-2", typeId: "cause-effect", text: "What are the causes and consequences of fast fashion?" },
  { id: "process-1", typeId: "process", text: "Explain step by step how to prepare your favourite dish." },
  { id: "process-2", typeId: "process", text: "Explain how to learn a new language effectively, step by step." },
  { id: "definition-1", typeId: "definition", text: "What does 'success' really mean? Define it beyond money and fame." },
  { id: "definition-2", typeId: "definition", text: "Define 'friendship' and explain what separates a true friend from an acquaintance." },
  { id: "analytical-1", typeId: "analytical", text: "Analyze why streaming services have replaced traditional television for many people." },
  { id: "analytical-2", typeId: "analytical", text: "Analyze the role of music in shaping a person's identity." },
  { id: "critical-1", typeId: "critical", text: "Write a critical review of a film or series you watched recently." },
  { id: "critical-2", typeId: "critical", text: "Critically evaluate the idea that 'money can't buy happiness'." },
  { id: "reflective-1", typeId: "reflective", text: "Reflect on a mistake you made and what it taught you." },
  { id: "reflective-2", typeId: "reflective", text: "Reflect on how you have changed in the last five years." },
  { id: "problem-solution-1", typeId: "problem-solution", text: "Traffic in big cities is getting worse. Present the problem and propose solutions." },
  { id: "problem-solution-2", typeId: "problem-solution", text: "Many young people spend too much time on their phones. Propose realistic solutions." },
  { id: "opinion-1", typeId: "opinion", text: "Some people think students should wear uniforms at school. What is your opinion?" },
  { id: "opinion-2", typeId: "opinion", text: "In your opinion, is it better to travel alone or with friends?" },
  { id: "advantages-disadvantages-1", typeId: "advantages-disadvantages", text: "Discuss the advantages and disadvantages of working from home." },
  { id: "advantages-disadvantages-2", typeId: "advantages-disadvantages", text: "Discuss the advantages and disadvantages of learning English online." },
  { id: "discussion-1", typeId: "discussion", text: "Some believe zoos protect animals; others believe they harm them. Discuss both views and conclude." },
  { id: "discussion-2", typeId: "discussion", text: "Should university education be free? Discuss different points of view before concluding." },
  { id: "classification-1", typeId: "classification", text: "Classify the different types of friends people have, with examples of each category." },
  { id: "classification-2", typeId: "classification", text: "Classify the ways people spend their free time into categories and describe each." },
  { id: "illustration-1", typeId: "illustration", text: "Show, with specific examples, how small daily habits can change a person's life." },
  { id: "illustration-2", typeId: "illustration", text: "Illustrate with examples how kindness can spread through a community." },
  { id: "research-1", typeId: "research", text: "Based on what you know or have read, present information about climate change in your country." },
  { id: "research-2", typeId: "research", text: "Present what you have learned about a historical figure you admire, citing where you learned it." },
  { id: "literary-response-1", typeId: "literary-response", text: "Write about a book or story that impressed you. Analyze its characters, message and your response to it." },
  { id: "literary-response-2", typeId: "literary-response", text: "Respond to a poem or song lyric you find meaningful: what does it say, and how does it achieve its effect?" },
];

/** Deterministic daily rotation within an essay type. */
export function dailyPrompt(typeId: string, date = new Date()): WritingPrompt {
  const pool = writingPrompts.filter((p) => p.typeId === typeId);
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return pool[dayOfYear % pool.length] ?? writingPrompts[0]!;
}

export function promptById(id: string): WritingPrompt | undefined {
  return writingPrompts.find((p) => p.id === id);
}
