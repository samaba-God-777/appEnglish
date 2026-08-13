import { useEffect, useRef, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Users, Volume2, Eye, EyeOff, Check, X, Mic } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getArticleById } from "./reading-data";
import { PronunciationFlow } from "./PronunciationFlow";
import { cn } from "@/lib/cn";
import type { ReadingArticle } from "./reading-data";

type Phase = "reading" | "pronunciation" | "vocabulary" | "comprehension" | "results";

interface AnswerState {
  [questionId: string]: number | null;
}

export default function ReadingDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const article = getArticleById(articleId ?? "");
  const contentRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("reading");
  const [readingTime, setReadingTime] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null);

  if (!article) return <Navigate to="/reading" replace />;

  // Calculate reading statistics
  const wordsPerMinute = 200;
  const estimatedReadingTime = Math.ceil(article.wordCount / wordsPerMinute);
  const comprehensionScore =
    Object.keys(answers).length > 0
      ? Math.round(
          (Object.values(answers).filter((ans, idx) => ans === article.comprehensionQuestions[idx]?.correctAnswer).length /
            article.comprehensionQuestions.length) *
            100
        )
      : 0;

  const handleAnswer = (questionId: string, answerIndex: number) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setPhase("comprehension");
  };

  const allAnswered = article.comprehensionQuestions.every((q) => answers[q.id] !== null && answers[q.id] !== undefined);

  const toggleHighlight = (word: string) => {
    setHighlightedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <Link
        to="/reading"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to Reading
      </Link>

      <PageHeader
        title={article.title}
        description={`${article.type} · ${article.estimatedMinutes} min read · ${article.wordCount} words`}
        actions={<Badge>{article.level}</Badge>}
      />

      {/* Reading Phase */}
      {phase === "reading" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5 text-accent" aria-hidden />
                  Reading Time
                </CardTitle>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-4" aria-hidden />
                    {estimatedReadingTime} min
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="size-4" aria-hidden />
                    {article.wordCount} words
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Article Text */}
          <Card>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none p-8">
              <div
                ref={contentRef}
                className="space-y-4 leading-relaxed text-base"
                style={{ wordSpacing: "0.1em", lineHeight: "1.8" }}
              >
                {article.fullText.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>
                    {paragraph.split(/\b/).map((word, wordIdx) => {
                      const isVocabWord = article.vocabulary.some(
                        (v) => v.word.toLowerCase() === word.toLowerCase()
                      );
                      const isHighlighted = highlightedWords.includes(word.toLowerCase());

                      return (
                        <span
                          key={wordIdx}
                          onClick={() => {
                            if (isVocabWord) {
                              setSelectedVocab(word.toLowerCase());
                              toggleHighlight(word.toLowerCase());
                            }
                          }}
                          className={cn(
                            isVocabWord && "cursor-pointer underline decoration-dotted decoration-primary",
                            isHighlighted && "bg-yellow-200 dark:bg-yellow-700 px-1 rounded",
                            "transition-colors"
                          )}
                          title={
                            isVocabWord
                              ? article.vocabulary.find(
                                  (v) => v.word.toLowerCase() === word.toLowerCase()
                                )?.definition
                              : ""
                          }
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vocabulary Tooltip */}
          {selectedVocab && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Vocabulary: {selectedVocab}</CardTitle>
              </CardHeader>
              <CardContent>
                {article.vocabulary.find((v) => v.word.toLowerCase() === selectedVocab)?.definition}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setPhase("pronunciation")}>
              <Mic aria-hidden /> Practice Pronunciation
            </Button>
            <Button variant="outline" onClick={() => setPhase("vocabulary")}>
              📚 Vocabulary Review
            </Button>
            <Button onClick={() => setPhase("comprehension")} className="flex-1">
              Check Comprehension →
            </Button>
          </div>
        </div>
      )}

      {/* Pronunciation Phase */}
      {phase === "pronunciation" && (
        <PronunciationFlow article={article} onExit={() => setPhase("reading")} />
      )}

      {/* Vocabulary Phase */}
      {phase === "vocabulary" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Vocabulary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {article.vocabulary.map((item) => (
                <div key={item.word} className="rounded-lg border border-border p-4">
                  <p className="font-semibold text-primary">{item.word}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.definition}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPhase("reading")}>
              ← Back to Reading
            </Button>
            <Button onClick={() => setPhase("comprehension")} className="flex-1">
              Continue to Questions →
            </Button>
          </div>
        </div>
      )}

      {/* Comprehension Phase */}
      {phase === "comprehension" && !submitted && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprehension Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {article.comprehensionQuestions.map((question, qIdx) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-semibold">
                    Question {qIdx + 1}: {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(question.id, oIdx)}
                        className={cn(
                          "w-full rounded-lg border-2 p-3 text-left transition-all",
                          answers[question.id] === oIdx
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                              answers[question.id] === oIdx
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            )}
                          />
                          <span className="text-sm">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPhase("reading")}>
              ← Back to Article
            </Button>
            <Button onClick={handleSubmit} disabled={!allAnswered} className="flex-1">
              Submit Answers
            </Button>
          </div>
        </div>
      )}

      {/* Results Phase */}
      {phase === "comprehension" && submitted && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div
                className="flex size-36 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(var(--color-primary) ${comprehensionScore * 3.6}deg, var(--color-muted) 0deg)`,
                }}
              >
                <div className="flex size-28 flex-col items-center justify-center rounded-full bg-card">
                  <span className="text-3xl font-extrabold">{comprehensionScore}</span>
                  <span className="text-xs text-muted-foreground">Score</span>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {comprehensionScore >= 80
                  ? "Excellent comprehension!"
                  : comprehensionScore >= 60
                    ? "Good understanding. Review the explanations below."
                    : "Review the article and explanations carefully."}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Answers */}
          <Card>
            <CardHeader>
              <CardTitle>Review Your Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.comprehensionQuestions.map((question, qIdx) => {
                const isCorrect = answers[question.id] === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className={cn(
                      "rounded-lg border p-4",
                      isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="font-semibold">{question.question}</h4>
                      {isCorrect ? (
                        <Check className="size-5 text-success" />
                      ) : (
                        <X className="size-5 text-destructive" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your answer: <span className="font-semibold">{question.options[answers[question.id] ?? -1]}</span>
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Correct answer: <span className="font-semibold">{question.options[question.correctAnswer]}</span>
                      </p>
                    )}
                    <div className="mt-2 rounded bg-muted/50 p-2 text-sm text-muted-foreground">
                      <p className="font-semibold mb-1">Explanation:</p>
                      {question.explanation}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPhase("reading")}>
              ← Read Again
            </Button>
            <Button onClick={handleReset}>Try Another Article</Button>
          </div>
        </div>
      )}
    </div>
  );
}
