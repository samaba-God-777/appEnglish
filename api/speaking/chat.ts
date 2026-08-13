import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const CHAT_MODEL = "llama-3.3-70b-versatile";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

function conversationSystem(topic: string, level: string): string {
  return `You are a warm, patient English conversation partner for a Spanish-speaking learner (target level ${level}). You are chatting about: "${topic || "something the learner enjoys"}".
Rules:
- Keep every reply SHORT: 1-3 sentences, natural spoken English.
- Always end with one simple follow-up question to keep the conversation going.
- Match the learner's level: use simple words and short sentences; never lecture or give a list of rules.
- If the learner says something wrong in English, briefly repeat the correct form once, naturally, then keep talking — do not stop to correct everything.
- If the learner writes in Spanish, reply mostly in English but you may use one short Spanish phrase to help comprehension.
- Stay on topic. Never mention that you are an AI or a language model.`;
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
    const { topic, level, messages } = req.body as { topic?: string; level?: string; messages?: ChatTurn[] };
    const chatMessages = (messages ?? []).filter((m): m is ChatTurn => m.role === "user" || m.role === "assistant");
    if (chatMessages.length === 0) return res.status(400).json({ error: "Empty messages" });

    const chatRes = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: CHAT_MODEL,
        temperature: 0.8,
        max_tokens: 300,
        messages: [{ role: "system", content: conversationSystem(topic ?? "", level ?? "B1") }, ...chatMessages],
      }),
    });
    if (!chatRes.ok) {
      const detail = await chatRes.text();
      throw new Error(`Groq chat ${chatRes.status}: ${detail.slice(0, 200)}`);
    }
    const data = (await chatRes.json()) as { choices: { message: { content: string } }[] };
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error("Groq returned an empty reply");
    return res.status(200).json({ reply: reply.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Speaking chat failed";
    console.error("[speaking-chat]", message);
    return res.status(502).json({ error: message });
  }
}
