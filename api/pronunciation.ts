import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const WHISPER_MODEL = "whisper-large-v3";

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function grade(target: string, transcript: string) {
  const ref = tokens(target);
  const hyp = tokens(transcript);
  if (ref.length === 0) return { score: 0, wrongWords: [] as string[], feedback: "I didn't hear a sentence. Try again." };

  const counts = new Map<string, number>();
  for (const w of hyp) counts.set(w, (counts.get(w) ?? 0) + 1);

  const wrongWords: string[] = [];
  let hits = 0;
  for (const w of ref) {
    const remaining = counts.get(w) ?? 0;
    if (remaining > 0) {
      counts.set(w, remaining - 1);
      hits++;
    } else {
      wrongWords.push(w);
    }
  }

  const score = Math.round((100 * hits) / ref.length);
  const feedback =
    wrongWords.length === 0
      ? "Excellent! You pronounced every word clearly."
      : wrongWords.length === 1
        ? `Almost there — work on the word "${wrongWords[0]}."`
        : `Careful with: ${wrongWords.map((w) => `"${w}"`).join(", ")}.`;
  return { score, wrongWords, feedback };
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
    const { audioBase64, mimeType, target } = req.body as {
      audioBase64?: string;
      mimeType?: string;
      target?: string;
    };
    if (!audioBase64 || !target?.trim()) return res.status(400).json({ error: "audioBase64 and target are required" });

    const buffer = Buffer.from(audioBase64, "base64");
    if (buffer.length === 0) return res.status(400).json({ error: "Empty audio" });

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
      throw new Error(`Groq transcript ${r.status}: ${detail.slice(0, 200)}`);
    }
    const data = (await r.json()) as { text?: string };
    const transcript = (data.text ?? "").trim();

    const result = grade(target, transcript);
    return res.status(200).json({ transcript, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pronunciation check failed";
    console.error("[speech] pronunciation:", message);
    return res.status(502).json({ error: message });
  }
}
