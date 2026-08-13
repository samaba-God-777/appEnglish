import { useEffect, useMemo, useState } from "react";
import { Loader2, PenLine, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { useWritingStore } from "@/store/writing";
import { useStatsStore } from "@/store/stats";
import {
  dailyPrompt,
  essayTypeById,
  essayTypes,
  promptById,
  wordRanges,
  writingLevels,
  type WritingLevel,
} from "./prompts";
import type { WritingReview } from "./review-types";
import { buildDemoReview } from "./mockReview";
import { ReviewPanel } from "./ReviewPanel";
import { WritingHistory } from "./WritingHistory";

async function requestReview(
  text: string,
  promptText: string,
  level: WritingLevel,
  typeId: string,
): Promise<WritingReview> {
  const essayType = essayTypeById(typeId);
  const res = await fetch("/api/review", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text,
      prompt: promptText,
      level,
      essayType: essayType?.name,
      essayPurpose: essayType?.purpose,
    }),
  });
  if (!res.ok) throw new Error(`Review request failed (${res.status})`);
  return (await res.json()) as WritingReview;
}

export default function WritingPage() {
  const { draft, saveDraft, clearDraft, addEssay } = useWritingStore();
  const addActivity = useStatsStore((s) => s.addActivity);

  const [level, setLevel] = useState<WritingLevel>("B1");
  const [typeId, setTypeId] = useState<string>("descriptive");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ review: WritingReview; text: string } | null>(null);

  const prompt = useMemo(() => dailyPrompt(typeId), [typeId]);
  const essayType = essayTypeById(typeId);
  const range = wordRanges[level];

  // Restore an unfinished draft once on mount.
  useEffect(() => {
    if (!draft) return;
    const draftPrompt = promptById(draft.promptId);
    if (!draftPrompt) return;
    setTypeId(draftPrompt.typeId);
    setText(draft.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const inRange = wordCount >= range.min && wordCount <= range.max;

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.trim()) saveDraft({ promptId: prompt.id, text: value });
    else clearDraft();
  };

  const handleReview = async () => {
    setLoading(true);
    const essayText = text;
    let review: WritingReview;
    try {
      review = await requestReview(essayText, prompt.text, level, typeId);
    } catch {
      review = buildDemoReview(essayText, range.min, range.max);
    }
    addEssay({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      promptId: prompt.id,
      promptText: prompt.text,
      level,
      genre: typeId,
      text: essayText,
      review,
    });
    addActivity(Math.round(review.scores.overall / 5), Math.max(3, Math.round(wordCount / 30)), "writing");
    clearDraft();
    setResult({ review, text: essayText });
    setLoading(false);
  };

  const handleWriteAnother = () => {
    setResult(null);
    setText("");
  };

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <PageHeader
        title="Writing Studio"
        description="Write in English — the AI reviews grammar, style, vocabulary and formality."
      />

      {result ? (
        <ReviewPanel review={result.review} text={result.text} onWriteAnother={handleWriteAnother} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="size-4 text-primary" aria-hidden /> Today's prompt
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex gap-1" role="group" aria-label="CEFR level">
                {writingLevels.map((l) => (
                  <Button
                    key={l}
                    size="sm"
                    variant={l === level ? "primary" : "outline"}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </Button>
                ))}
              </div>
              <select
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                aria-label="Essay type"
                className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-semibold focus:border-ring"
              >
                {essayTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            {essayType && (
              <p className="pt-1 text-xs text-muted-foreground italic">{essayType.purpose}</p>
            )}
            <p className="pt-1 text-sm text-muted-foreground">
              {prompt.text}{" "}
              <span className="whitespace-nowrap">
                ({range.min}–{range.max} words)
              </span>
            </p>
          </CardHeader>
          <CardContent>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={10}
              placeholder="Start writing here… your draft is saved automatically."
              aria-label="Your essay"
              className="w-full resize-y rounded-xl border border-border bg-background p-4 text-sm leading-relaxed placeholder:text-muted-foreground focus:border-ring"
            />
            <div className="mt-3 flex items-center justify-between">
              <span
                className={cn(
                  "text-xs tabular-nums",
                  wordCount === 0
                    ? "text-muted-foreground"
                    : inRange
                      ? "text-success"
                      : "text-warning",
                )}
              >
                {wordCount} words
                {wordCount > 0 && !inRange && (
                  <> · aim for {range.min}–{range.max}</>
                )}
              </span>
              <div className="flex items-center gap-2">
                {draft && draft.promptId === prompt.id && text.trim() !== "" && (
                  <Badge variant="outline">Draft saved</Badge>
                )}
                <Button onClick={handleReview} disabled={wordCount < 5 || loading}>
                  {loading ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />}
                  {loading ? "Reviewing…" : "Review with AI"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <WritingHistory />
    </div>
  );
}
