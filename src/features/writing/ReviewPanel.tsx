import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, PenLine, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HighlightedEssay } from "./HighlightedEssay";
import { categoryLabels, type CorrectionCategory, type WritingReview } from "./review-types";

function scoreVariant(score: number) {
  return score >= 90 ? "success" : score >= 75 ? "accent" : "destructive";
}

const subScores: { key: keyof WritingReview["scores"]; label: string }[] = [
  { key: "grammar", label: "Grammar" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "coherence", label: "Coherence" },
  { key: "taskResponse", label: "Task response" },
];

export function ReviewPanel({
  review,
  text,
  onWriteAnother,
}: {
  review: WritingReview;
  text: string;
  onWriteAnother: () => void;
}) {
  const [showImproved, setShowImproved] = useState(false);

  const byCategory = new Map<CorrectionCategory, typeof review.corrections>();
  for (const c of review.corrections) {
    byCategory.set(c.category, [...(byCategory.get(c.category) ?? []), c]);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden /> AI Review
            {review.source === "demo" && (
              <Badge variant="outline">Demo mode — set ANTHROPIC_API_KEY for real AI</Badge>
            )}
          </CardTitle>
          <Badge variant={scoreVariant(review.scores.overall)}>Score: {review.scores.overall}/100</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {subScores.map(({ key, label }) => (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{label}</span>
                  <span className="tabular-nums text-muted-foreground">{review.scores[key]}</span>
                </div>
                <Progress value={review.scores[key]} label={label} />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{review.feedback}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PenLine className="size-4 text-primary" aria-hidden />
            {showImproved ? "Model version" : "Your essay"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowImproved((v) => !v)}>
            {showImproved ? "Show my version" : "Show model version"}
          </Button>
        </CardHeader>
        <CardContent>
          {showImproved ? (
            <p className="text-sm leading-7 whitespace-pre-wrap">{review.improvedVersion}</p>
          ) : review.corrections.length > 0 ? (
            <>
              <HighlightedEssay text={text} corrections={review.corrections} />
              <p className="mt-2 text-xs text-muted-foreground">
                Hover the highlighted parts to see the correction.
              </p>
            </>
          ) : (
            <p className="text-sm leading-7 whitespace-pre-wrap">{text}</p>
          )}
        </CardContent>
      </Card>

      {review.corrections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" aria-hidden /> Corrections (
              {review.corrections.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...byCategory.entries()].map(([category, corrections]) => (
              <div key={category}>
                <Badge variant="secondary" className="mb-2">
                  {categoryLabels[category]}
                </Badge>
                <div className="space-y-2">
                  {corrections.map((c, i) => (
                    <div key={i} className="rounded-xl border border-border p-3">
                      <p className="text-sm">
                        <span className="font-semibold text-destructive line-through">{c.wrong.trim()}</span>
                        {" → "}
                        <span className="font-semibold text-success">{c.right}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{c.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {review.vocabularySuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary" aria-hidden /> Level-up vocabulary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {review.vocabularySuggestions.map((v, i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold">
                  {v.word} <span className="font-normal text-muted-foreground">— {v.translation}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground italic">"{v.example}"</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Button onClick={onWriteAnother}>
        <PenLine aria-hidden /> Write another essay
      </Button>
    </motion.div>
  );
}
