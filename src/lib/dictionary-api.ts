export interface DictMeaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictEntry {
  word: string;
  phonetic?: string;
  /** First available pronunciation audio URL, if any. */
  audio?: string;
  meanings: DictMeaning[];
  origin?: string;
}

interface RawPhonetic {
  text?: string;
  audio?: string;
}
interface RawDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}
interface RawMeaning {
  partOfSpeech: string;
  definitions: RawDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}
interface RawEntry {
  word: string;
  phonetic?: string;
  phonetics?: RawPhonetic[];
  origin?: string;
  meanings: RawMeaning[];
}

const cache = new Map<string, DictEntry | null>();

/**
 * Looks a word up in the open Free Dictionary API (dictionaryapi.dev).
 * Returns null when the word is not found. Results are cached per session.
 */
export async function lookupWord(word: string): Promise<DictEntry | null> {
  const key = word.trim().toLowerCase();
  if (!key) return null;
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);
    if (!res.ok) {
      cache.set(key, null);
      return null;
    }
    const data = (await res.json()) as RawEntry[];
    const entry = normalize(data);
    cache.set(key, entry);
    return entry;
  } catch {
    return null;
  }
}

function normalize(data: RawEntry[]): DictEntry | null {
  const first = data[0];
  if (!first) return null;

  const audio = data
    .flatMap((e) => e.phonetics ?? [])
    .map((p) => p.audio)
    .find((a) => a && a.length > 0);

  const phonetic =
    first.phonetic ?? data.flatMap((e) => e.phonetics ?? []).map((p) => p.text).find((t) => t && t.length > 0);

  const meanings: DictMeaning[] = [];
  for (const entry of data) {
    for (const m of entry.meanings ?? []) {
      meanings.push({
        partOfSpeech: m.partOfSpeech,
        definitions: (m.definitions ?? []).slice(0, 4).map((d) => ({ definition: d.definition, example: d.example })),
        synonyms: (m.synonyms ?? []).slice(0, 8),
        antonyms: (m.antonyms ?? []).slice(0, 6),
      });
    }
  }

  return {
    word: first.word,
    phonetic: phonetic ?? undefined,
    audio: audio ?? undefined,
    origin: first.origin,
    meanings,
  };
}
