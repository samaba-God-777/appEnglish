import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

async function complete(apiKey: string, system: string, messages: ChatTurn[], json: boolean): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1200,
      ...(json ? { response_format: { type: "json_object" } } : {}),
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty completion");
  return content;
}

const TUTOR_SYSTEM = (topic: { title: string; level: string; signalWords: string[] }) =>
  `You are an expert ESL grammar tutor for Spanish-speaking learners, now helping with the topic "${topic.title}" (target level ${topic.level}).
Rules:
- Explain rules clearly in simple English, with one short example sentence each.
- Use bold **like this** for the key grammar structure / any term worth remembering.
- Reference the topic's signal words: ${topic.signalWords.join(", ")}, to help recognition.
- If the learner asks in Spanish ("explica en español"), switch to clear Spanish.
- If the learner pastes a sentence, correct it and explain the grammar point, not just the words.
- Keep answers focused: typically 2-5 short paragraphs or a short bulleted list. No long essays.`;

const GENERATOR_PROMPT = (topicTitle: string, topicId: string, count: number) =>
  `Create ${count} English language-learning quiz questions for the grammar topic "${topicTitle}".
Return ONLY JSON with this exact shape:
{"questions":[{"id":"q1","topicId":"${topicId}","kind":"mcq","prompt":"...","options":["a","b","c","d"],"correctIndex":0,"explanation":"..."}]}
- id must be unique per question.
- kind: "mcq" or "gapfill". For gapfill, the prompt's blank MUST be written with "___" (e.g. "She ___ to work every morning.") and options must fit the blank.
- exactly 4 options per question.
- correctIndex is the 0-based index of the right option.
- explanation is one short sentence explaining the rule, in simple English.
- Focus on choosing the correct tense/structure/form for the topic. Make one or two distractors common learner mistakes.
- Do not include markdown or extra keys.`;

const isQuestion = (value: unknown): value is { prompt: string; options: string[]; correctIndex: number; kind: string; explanation: string } => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.prompt === "string" &&
    Array.isArray(v.options) &&
    v.options.length === 4 &&
    typeof v.correctIndex === "number" &&
    v.correctIndex >= 0 &&
    v.correctIndex < 4 &&
    (v.kind === "mcq" || v.kind === "gapfill") &&
    typeof v.explanation === "string"
  );
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "GROQ_API_KEY not set" });

  const url = new URL(req.url ?? "/", `https://${req.headers.host}`);
  const action = url.pathname.split("/").pop();

  try {
    if (action === "chat") {
      const body = req.body as {
        topic?: { title: string; level: string; signalWords: string[] };
        messages?: ChatTurn[];
      };
      const topic = body.topic ?? { title: "English grammar", level: "B1", signalWords: [] };
      const messages = body.messages ?? [];
      if (messages.length === 0) return res.status(400).json({ error: "Empty messages" });
      const reply = await complete(apiKey, TUTOR_SYSTEM(topic), messages, false);
      return res.status(200).json({ reply });
    }

    if (action === "generate") {
      const { topicId, topicTitle, count } = req.body as { topicId?: string; topicTitle?: string; count?: number };
      if (!topicId || !topicTitle) return res.status(400).json({ error: "topicId and topicTitle required" });
      const n = Math.min(Math.max(Number(count) || 5, 3), 8);
      const raw = await complete(apiKey, GENERATOR_PROMPT(topicTitle, topicId, n), [], true);
      const parsed = JSON.parse(raw) as { questions?: unknown[] };
      const questions = (parsed.questions ?? [])
        .filter(isQuestion)
        .slice(0, n)
        .map((q, i) => {
          const prompt = q.prompt.replace(/_{2,}/g, "___");
          return { ...q, prompt, id: `${topicId}-ai-${i + 1}`, topicId, kind: prompt.includes("___") ? "gapfill" : "mcq" };
        });
      if (questions.length === 0) return res.status(502).json({ error: "No valid questions generated" });
      return res.status(200).json({ questions });
    }

    return res.status(400).json({ error: "Unknown action. Use /api/grammar/chat or /api/grammar/generate" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Grammar AI failed";
    console.error("[grammar-ai]", message);
    return res.status(502).json({ error: message });
  }
}
