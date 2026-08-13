import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const WHISPER_MODEL = "whisper-large-v3";

async function transcribeAudio(apiKey: string, audioBase64: string, mimeType?: string): Promise<string> {
  const buffer = Buffer.from(audioBase64, "base64");
  const ext = mimeType?.includes("webm") ? "webm" : mimeType?.includes("wav") ? "wav" : mimeType?.includes("mp4") ? "m4a" : "mp3";
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "GROQ_API_KEY not set" });

  try {
    const { audioBase64, mimeType } = req.body as { audioBase64?: string; mimeType?: string };
    if (!audioBase64) return res.status(400).json({ error: "audioBase64 is required" });
    if (Buffer.from(audioBase64, "base64").length === 0) return res.status(400).json({ error: "Empty audio" });
    const text = await transcribeAudio(apiKey, audioBase64, mimeType);
    return res.status(200).json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Speaking transcribe failed";
    console.error("[speaking-transcribe]", message);
    return res.status(502).json({ error: message });
  }
}
