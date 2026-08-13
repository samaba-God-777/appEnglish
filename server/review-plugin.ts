import { loadEnv, type Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import Anthropic from "@anthropic-ai/sdk";
import type { WritingReview } from "../src/features/writing/review-types";

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
          wrong: {
            type: "string",
            description: "Exact substring copied verbatim from the student's text",
          },
          right: { type: "string", description: "The corrected version" },
          category: {
            type: "string",
            enum: ["grammar", "vocabulary", "collocation", "spelling", "punctuation"],
          },
          explanation: {
            type: "string",
            description: "Short rule explanation in simple English (max ~20 words)",
          },
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
    feedback: {
      type: "string",
      description: "2-3 encouraging sentences in simple English about strengths and what to improve",
    },
    improvedVersion: {
      type: "string",
      description: "The essay rewritten at the student's target level, keeping their ideas and voice",
    },
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

export function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

export function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(payload));
}

/** Dev-server endpoint: POST /api/review { text, prompt, level } → WritingReview. */
export function reviewApiPlugin(): Plugin {
  let apiKey: string | undefined;
  return {
    name: "englishai-review-api",
    config(_config, { mode }) {
      // .env.local takes precedence over the shell env so a broken exported key can't shadow it.
      apiKey = loadEnv(mode, process.cwd(), "").ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
    },
    configureServer(server) {
      server.middlewares.use("/api/review", async (req, res) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" });
          return;
        }
        try {
          const { text, prompt, level, essayType, essayPurpose } = JSON.parse(
            await readBody(req),
          ) as {
            text: string;
            prompt: string;
            level: string;
            essayType?: string;
            essayPurpose?: string;
          };
          if (!text?.trim()) {
            sendJson(res, 400, { error: "Empty text" });
            return;
          }

          const client = new Anthropic({ apiKey });
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
          if (!textBlock) {
            sendJson(res, 502, { error: `No review produced (stop_reason: ${response.stop_reason})` });
            return;
          }
          const review = JSON.parse(textBlock.text) as Omit<WritingReview, "source">;
          sendJson(res, 200, { ...review, source: "ai" } satisfies WritingReview);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Review failed";
          console.error("[review-api]", message);
          sendJson(res, 502, { error: message });
        }
      });
    },
  };
}
