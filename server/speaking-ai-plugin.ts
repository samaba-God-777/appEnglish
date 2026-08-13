import { loadEnv, type Plugin } from "vite";
import { readBody, sendJson } from "./review-plugin";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const CHAT_MODEL = "llama-3.3-70b-versatile";
const WHISPER_MODEL = "whisper-large-v3";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const SPEAKING_METRICS = [
  "Pronunciation",
  "Fluency",
  "Intonation",
  "Grammar",
  "Vocabulary",
  "Naturalness",
];

function assessSystem(target: string, level: string): string {
  return `You are an expert ESL speaking assessor for Spanish-speaking learners (target level ${level}).
A student read this sentence aloud: "${target}".
Below is the transcript of what they actually said.
Score each of the six dimensions as an integer 0-100, relative to the student's level. Be honest and specific.

Return ONLY JSON with exactly this shape (no markdown, no extra keys):
{"metrics":[{"label":"Pronunciation","score":<0-100>,"feedback":"..."}, ...exactly six, one per label],
 "feedback":"1-2 encouraging sentences in simple English summarizing performance",
 "strengths":["...","..."],
 "improvements":["...","..."]}

Rules:
- The six labels, in order: ${SPEAKING_METRICS.join(", ")}.
- "Pronunciation" should compare the transcript to the target: note words that were mispronounced, added, or missing.
- Score lower when the transcript diverges a lot from the target or is short/incomplete.
- strengths (2-3) and improvements (2-3) must be specific to this sentence and easy for a learner to act on.`;
}

async function transcribeAudio(apiKey: string, audioBase64: string, mimeType?: string): Promise<string> {
  const buffer = Buffer.from(audioBase64, "base64");
  const ext = mimeType?.includes("webm")
    ? "webm"
    : mimeType?.includes("wav")
      ? "wav"
      : mimeType?.includes("mp4")
        ? "m4a"
        : "mp3";
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mimeType ?? "audio/webm" }), `recording.${ext}`);
  form.append("model", WHISPER_MODEL);
  form.append("language", "en");
  form.append("response_format", "json");

  const r = await fetch(GROQ_TRANSCRIBE_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!r.ok) {
    const detail = await r.text();
    throw new Error(`Groq transcribe ${r.status}: ${detail.slice(0, 200)}`);
  }
  const data = (await r.json()) as { text?: string };
  return (data.text ?? "").trim();
}

async function chatComplete(apiKey: string, system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      temperature: 0.4,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq chat ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty completion");
  return content.trim();
}

function sanitizeMetrics(metrics: unknown): Array<{ label: string; score: number; feedback: string }> {
  if (!Array.isArray(metrics)) return [];
  return SPEAKING_METRICS.map((label) => {
    const m = (metrics as Array<Record<string, unknown>>).find(
      (item) =>
        item && typeof item === "object" && String(item.label).toLowerCase() === label.toLowerCase(),
    );
    if (!m) return { label, score: 0, feedback: "Not measured." };
    const score = Number(m.score);
    return {
      label,
      score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
      feedback: typeof m.feedback === "string" && m.feedback.trim() ? m.feedback : "No feedback.",
    };
  });
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

/** Dev-server endpoints for the AI conversation mode in the Speaking Lab. */
export function speakingAiPlugin(): Plugin {
  let apiKey: string | undefined;
  return {
    name: "englishai-speaking-ai",
    config(_config, { mode }) {
      apiKey = loadEnv(mode, process.cwd(), "").GROQ_API_KEY || process.env.GROQ_API_KEY;
    },
    configureServer(server) {
      // POST /api/speaking/chat { topic, level, messages } → { reply }
      server.middlewares.use("/api/speaking/chat", async (req, res) => {
        if (!apiKey) return sendJson(res, 503, { error: "GROQ_API_KEY not set" });
        if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
        try {
          const { topic, level, messages } = JSON.parse(await readBody(req)) as {
            topic?: string;
            level?: string;
            messages?: ChatTurn[];
          };
          const chatMessages = (messages ?? []).filter(
            (m): m is ChatTurn => m.role === "user" || m.role === "assistant",
          );
          const chatRes = await fetch(GROQ_CHAT_URL, {
            method: "POST",
            headers: {
              authorization: `Bearer ${apiKey}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              model: CHAT_MODEL,
              temperature: 0.8,
              max_tokens: 300,
              messages: [
                { role: "system", content: conversationSystem(topic ?? "", level ?? "B1") },
                ...chatMessages,
              ],
            }),
          });
          if (!chatRes.ok) {
            const detail = await chatRes.text();
            throw new Error(`Groq chat ${chatRes.status}: ${detail.slice(0, 200)}`);
          }
          const data = (await chatRes.json()) as {
            choices: { message: { content: string } }[];
          };
          const reply = data.choices?.[0]?.message?.content;
          if (!reply) throw new Error("Groq returned an empty reply");
          sendJson(res, 200, { reply: reply.trim() });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Conversation reply failed";
          console.error("[speaking-ai] chat:", message);
          sendJson(res, 502, { error: message });
        }
      });

      // POST /api/speaking/transcribe { audioBase64, mimeType } → { text }
      server.middlewares.use("/api/speaking/transcribe", async (req, res) => {
        if (!apiKey) return sendJson(res, 503, { error: "GROQ_API_KEY not set" });
        if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
        try {
          const { audioBase64, mimeType } = JSON.parse(await readBody(req)) as {
            audioBase64?: string;
            mimeType?: string;
          };
          if (!audioBase64) return sendJson(res, 400, { error: "audioBase64 is required" });
          if (Buffer.from(audioBase64, "base64").length === 0) return sendJson(res, 400, { error: "Empty audio" });

          const text = await transcribeAudio(apiKey, audioBase64, mimeType);
          sendJson(res, 200, { text });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Transcription failed";
          console.error("[speaking-ai] transcribe:", message);
          sendJson(res, 502, { error: message });
        }
      });

      // POST /api/speaking/assess { audioBase64, mimeType, target, level } → full rubric
      server.middlewares.use("/api/speaking/assess", async (req, res) => {
        if (!apiKey) return sendJson(res, 503, { error: "GROQ_API_KEY not set" });
        if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
        try {
          const { audioBase64, mimeType, target, level } = JSON.parse(await readBody(req)) as {
            audioBase64?: string;
            mimeType?: string;
            target?: string;
            level?: string;
          };
          if (!audioBase64 || !target?.trim()) {
            return sendJson(res, 400, { error: "audioBase64 and target are required" });
          }
          const transcript = await transcribeAudio(apiKey, audioBase64, mimeType);

          if (!transcript) {
            const metrics = SPEAKING_METRICS.map((label) => ({
              label,
              score: 0,
              feedback: "I couldn't hear this clearly.",
            }));
            sendJson(res, 200, {
              transcript: "",
              overall: 0,
              metrics,
              feedback: "I couldn't hear you clearly. Please try again.",
              strengths: [],
              improvements: [],
            });
            return;
          }

          const raw = await chatComplete(
            apiKey,
            assessSystem(target.trim(), level ?? "B1"),
            `Student's actual words: "${transcript}"`,
            900,
          );
          const parsed = JSON.parse(raw) as {
            metrics?: unknown;
            feedback?: string;
            strengths?: unknown;
            improvements?: unknown;
          };
          const metrics = sanitizeMetrics(parsed.metrics);
          const overall =
            metrics.length > 0
              ? Math.round(metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length)
              : 0;
          const strings = (value: unknown): string[] =>
            Array.isArray(value)
              ? value.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
              : [];
          sendJson(res, 200, {
            transcript,
            overall,
            metrics,
            feedback:
              typeof parsed.feedback === "string" && parsed.feedback.trim()
                ? parsed.feedback
                : "Nice work reading aloud. Keep practising to sharpen your rhythm and clarity.",
            strengths: strings(parsed.strengths),
            improvements: strings(parsed.improvements),
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Assessment failed";
          console.error("[speaking-ai] assess:", message);
          sendJson(res, 502, { error: message });
        }
      });
    },
  };
}