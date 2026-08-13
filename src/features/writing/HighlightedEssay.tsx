import type { Correction } from "./review-types";

interface Segment {
  text: string;
  correction?: Correction;
}

/** Split the essay into plain and highlighted segments (first match per correction, no overlaps). */
function segment(text: string, corrections: Correction[]): Segment[] {
  const lower = text.toLowerCase();
  const matches: { start: number; end: number; correction: Correction }[] = [];

  for (const c of corrections) {
    const needle = c.wrong.toLowerCase();
    if (!needle.trim()) continue;
    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(needle, from);
      if (idx === -1) break;
      const end = idx + needle.length;
      if (!matches.some((m) => idx < m.end && end > m.start)) {
        matches.push({ start: idx, end, correction: c });
        break; // highlight only the first non-overlapping occurrence
      }
      from = end;
    }
  }

  matches.sort((a, b) => a.start - b.start);
  const segments: Segment[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start > cursor) segments.push({ text: text.slice(cursor, m.start) });
    segments.push({ text: text.slice(m.start, m.end), correction: m.correction });
    cursor = m.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}

export function HighlightedEssay({ text, corrections }: { text: string; corrections: Correction[] }) {
  const segments = segment(text, corrections);
  return (
    <p className="text-sm leading-7 whitespace-pre-wrap">
      {segments.map((s, i) =>
        s.correction ? (
          <span key={i} className="group relative inline">
            <mark className="rounded bg-destructive/15 px-0.5 text-destructive underline decoration-destructive decoration-wavy underline-offset-4">
              {s.text}
            </mark>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden w-max max-w-64 -translate-x-1/2 rounded-lg border border-border bg-popover p-2 text-xs shadow-lg group-hover:block"
            >
              <span className="font-semibold text-success">{s.correction.right}</span>
              <span className="mt-0.5 block text-muted-foreground">{s.correction.explanation}</span>
            </span>
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </p>
  );
}
