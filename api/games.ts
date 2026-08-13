import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const DEFAULT_COUNT: Record<string, number> = {
  quiz: 8, "sentence-builder": 6, "typing-race": 6, "word-scramble": 8,
  hangman: 8, "memory-match": 8, idiom: 8, dictation: 8, story: 8,
};

async function complete(apiKey: string, system: string, maxTokens: number): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, temperature: 0.8, max_tokens: maxTokens, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }] }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty completion");
  return content.trim();
}

const BASE = (level: string) =>
  `You generate fresh English learning content for a Spanish-speaking learner at CEFR level ${level}. Use vocabulary and grammar appropriate for that level. Return ONLY JSON. No markdown.`;

function promptFor(game: string, level: string, count: number): { system: string; maxTokens: number } {
  switch (game) {
    case "quiz":
      return {
        system: `${BASE(level)} Create ${count} multiple-choice English questions for a Quiz Battle game.
Return exactly this JSON shape:
{"items":[{"question":"...","options":["a","b","c","d"],"answerIndex":0,"explanation":"..."}]}
- "question" may contain a blank written as "___".
- Exactly 4 options. "answerIndex" is the 0-based index of the correct option.
- "explanation" is one short sentence in simple English explaining the answer.
- Make one or two distractors common learner mistakes. Level-appropriate grammar/vocabulary.`,
        maxTokens: 1600,
      };
    case "sentence-builder":
    case "typing-race":
      return {
        system: `${BASE(level)} Create ${count} short English sentences for a sentence-ordering game. JSON exactly:
{"items":["Sentence one.","Sentence two."]}
- Each sentence 6-9 words. Plain ASCII: letters, spaces, and an ending period only (no quotes, commas, digits, symbols, URLs).
- Common, everyday, level-appropriate English.`,
        maxTokens: 800,
      };
    case "dictation":
      return {
        system: `${BASE(level)} Create ${count} English sentences for a listening dictation game (typed back after being read aloud). JSON exactly:
{"items":["...","..."]}
- Each sentence 10-15 words, plain ASCII letters with only a final period (no commas, numbers, symbols, emoji, or abbreviations).
- Write words in normal spelling so text-to-speech pronounces them cleanly. Level-appropriate.`,
        maxTokens: 900,
      };
    case "word-scramble":
    case "hangman":
    case "memory-match":
      return {
        system: `${BASE(level)} Create ${count} word-with-meaning pairs. JSON exactly:
{"items":[{"word":"...","meaning":"..."}]}
- "word" must be a SINGLE word: letters a-z only, 4-9 letters, no hyphens, spaces, or digits.
- "meaning" is a short phrase (no more than 8 words) defining the word in simple English.
- All words must be distinct. Level-appropriate vocabulary.`,
        maxTokens: 1100,
      };
    case "idiom":
      return {
        system: `${BASE(level)} Create ${count} common English idioms with their meanings. JSON exactly:
{"items":[{"idiom":"...","meaning":"..."}]}
- "idiom" is 2-4 words, a real everyday idiom.
- "meaning" is one short plain-English sentence explaining it.
- ALL meanings must be DIFFERENT from each other (they become wrong-answer choices).`,
        maxTokens: 1000,
      };
    case "story":
      return {
        system: `${BASE(level)} Write a short branching adventure story with a start decision path: a linear story of exactly (count) nodes set in an English-speaking city. JSON exactly:
{"items":[{"text":"...","choices":["option A","option B"]}, ...] }
- item 0 is the start (give it 3 choices). Middle items: 2 choices. The ROOT; every choice in any node leads forward to the NEXT item in the array. The FINAL item has "choices":[] (it is an ending).
- "text" is 1-3 sentences, written as an ESL story at the learner's level (clear, common vocabulary). Each "choice" is a short label.
- Ensure every node has a valid forward path so the story always resolves.`,
        maxTokens: 2200,
      };
    default:
      throw new Error(`Unknown game: ${game}`);
  }
}

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

function isMultiChoice(item: unknown): item is { question: string; options: string[]; answerIndex: number; explanation: string } {
  if (!item || typeof item !== "object") return false;
  const q = item as Record<string, unknown>;
  return isStr(q.question) && Array.isArray(q.options) && q.options.length === 4 && q.options.every(isStr) && typeof q.answerIndex === "number" && q.answerIndex >= 0 && q.answerIndex < 4 && isStr(q.explanation);
}

function isWordPair(item: unknown): item is { word: string; meaning: string } {
  if (!item || typeof item !== "object") return false;
  const w = item as Record<string, unknown>;
  return isStr(w.word) && /^[a-z]{4,9}$/i.test(w.word) && isStr(w.meaning);
}

function isIdiom(item: unknown): item is { idiom: string; meaning: string } {
  if (!item || typeof item !== "object") return false;
  const i = item as Record<string, unknown>;
  return isStr(i.idiom) && isStr(i.meaning);
}

function isSentence(item: unknown): item is string {
  return isStr(item) && /^[A-Za-z][A-Za-z .]*\.$/s.test(item);
}

function isStoryItem(item: unknown): item is { text: string; choices: string[] } {
  if (!item || typeof item !== "object") return false;
  const s = item as Record<string, unknown>;
  return isStr(s.text) && Array.isArray(s.choices) && s.choices.every(isStr);
}

function sanitize(game: string, items: unknown): unknown[] {
  if (!Array.isArray(items)) return [];
  switch (game) {
    case "quiz": return items.filter(isMultiChoice).slice(0, 8);
    case "sentence-builder": case "typing-race": case "dictation": return items.filter(isSentence).slice(0, 8);
    case "word-scramble": case "hangman": case "memory-match": return items.filter(isWordPair).slice(0, 8);
    case "idiom": {
      const seen = new Set<string>();
      const out: unknown[] = [];
      for (const i of items) { if (!isIdiom(i) || seen.has(i.meaning.toLowerCase())) continue; seen.add(i.meaning.toLowerCase()); out.push(i); if (out.length >= 8) break; }
      return out;
    }
    case "story": { const nodes = items.filter(isStoryItem).slice(0, 12); return nodes.map((n, i) => ({ ...n, index: i })); }
    default: return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "GROQ_API_KEY not set" });

  try {
    const { game, level, count } = req.body as { game?: string; level?: string; count?: number };
    if (!game) return res.status(400).json({ error: "game is required" });
    const lvl = /^A[12]|B[12]|C1$/.test(level ?? "") ? (level as string) : "B1";
    const n = Math.min(Math.max(Number(count) || DEFAULT_COUNT[game] || 8, 5), 24);
    const { system, maxTokens } = promptFor(game, lvl, n);
    const raw = await complete(apiKey, system, maxTokens);
    const parsed = JSON.parse(raw) as { items?: unknown[] };
    const items = sanitize(game, parsed.items);
    if (items.length === 0) return res.status(502).json({ error: "No valid items generated" });
    return res.status(200).json({ game, level: lvl, items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("[games-ai] generate:", message);
    return res.status(502).json({ error: message });
  }
}
