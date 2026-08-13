let cachedVoice: SpeechSynthesisVoice | null | undefined;

/** Preference order: natural en-US/en-GB voices, then any English voice. */
function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null; // not loaded yet — try again on next call

  const preferred = [
    /Google US English/i,
    /Samantha/i,
    /Google UK English Female/i,
    /Microsoft (Aria|Jenny|Zira|Guy)/i,
    /en[-_]US/i,
    /en[-_]GB/i,
  ];
  for (const pattern of preferred) {
    const match = voices.find((v) => pattern.test(v.name) || pattern.test(v.lang));
    if (match) return (cachedVoice = match);
  }
  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  return (cachedVoice = anyEnglish ?? null);
}

// Voices load asynchronously in most browsers; refresh the cache when they arrive.
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    cachedVoice = undefined;
    pickVoice();
  });
}

interface SpeakOptions {
  /** Slow, clear pronunciation for learning. */
  slow?: boolean;
}

/** Speaks English text with a natural voice, cancelling anything already playing. */
export function speak(text: string, { slow = false }: SpeakOptions = {}): void {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = slow ? 0.6 : 0.92;
  utterance.pitch = 1;
  synth.speak(utterance);
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
