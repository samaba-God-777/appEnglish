import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";

const REVIEW_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["corrections", "scores", "feedback", "improvedVersion", "vocabularySuggestions"],
  properties: {
    corrections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["wrong", "right", "category", "explanation"],
        properties: {
          wrong: { type: "string", description: "Exact substring copied verbatim from the student's text" },
          right: { type: "string", description: "The corrected version" },
          category: { type: "string", enum: ["grammar", "vocabulary", "collocation", "spelling", "punctuation"] },
          explanation: { type: "string", description: "Short rule explanation in simple English (max ~20 words)" },
        },
      },
    },
    scores: {
      type: "object",
      additionalProperties: false,
      required: ["grammar", "vocabulary", "coherence", "taskResponse", "overall"],
      properties: {
        grammar: { type: "integer" },
        vocabulary: { type: "integer" },
        coherence: { type: "integer" },
        taskResponse: { type: "integer" },
        overall: { type: "integer" },
      },
    },
    feedback: { type: "string", description: "2-3 encouraging sentences in simple English about strengths and what to improve" },
    improvedVersion: { type: "string", description: "The essay rewritten at the student's target level, keeping their ideas and voice" },
    vocabularySuggestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["word", "translation", "example"],
        properties: {
          word: { type: "string", description: "Useful word or connector relevant to the topic" },
          translation: { type: "string", description: "Spanish translation" },
          example: { type: "string", description: "Example sentence using the word" },
        },
      },
    },
  },
} as const;

const SYSTEM = `You are an expert ESL writing tutor for Spanish-speaking learners of English.
Review the student's essay and return structured feedback.

Rules:
- In "corrections", the "wrong" field MUST be an exact substring copied verbatim from the student's text (same casing and spacing) so the app can highlight it. Keep it as short as possible while unambiguous.
- Pay special attention to typical Spanish-speaker errors: false friends, missing subject pronouns, "peoples"/"informations", "make" vs "have/do" collocations, lowercase "i", preposition transfer from Spanish.
- All scores are integers 0-100. "taskResponse" measures how well the essay answers the prompt, follows the conventions of the requested essay type (structure, register, purpose), and respects the requested length. "overall" weighs everything, considering the student's target CEFR level.
- Explanations must be short and in simple English a learner at that level can read.
- "improvedVersion" keeps the student's ideas and personal voice — do not invent new content; write it slightly above their current level so it is a realistic model.
- Suggest 3 "vocabularySuggestions" (words or connectors) that would enrich this specific essay, with Spanish translations.
- If the text is not in English or is gibberish, give low scores, no corrections, and explain the issue in "feedback".`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text, prompt, level, essayType, essayPurpose } = req.body as {
      text: string;
      prompt: string;
      level: string;
      essayType?: string;
      essayPurpose?: string;
    };
    if (!text?.trim()) return res.status(400).json({ error: "Empty text" });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      output_config: { format: { type: "json_schema", schema: REVIEW_SCHEMA } },
      messages: [
        {
          role: "user",
          content: [
            `Target CEFR level: ${level}`,
            essayType ? `Essay type: ${essayType}${essayPurpose ? ` — ${essayPurpose}` : ""}` : null,
            `Writing prompt: ${prompt}`,
            "",
            "Student's essay:",
            text,
          ]
            .filter((line): line is string => line !== null)
            .join("\n"),
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) return res.status(502).json({ error: `No review produced (stop_reason: ${response.stop_reason})` });
    const review = JSON.parse(textBlock.text);
    return res.status(200).json({ ...review, source: "ai" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Review failed";
    console.error("[review-api]", message);
    return res.status(502).json({ error: message });
  }
}
