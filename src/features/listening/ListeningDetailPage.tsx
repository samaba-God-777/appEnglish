import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Volume2, Eye, EyeOff, Check, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getListeningExercise } from "./listening-data";
import { TtsPlayer, splitSentences } from "./TtsPlayer";

interface AnswerState {
  [questionId: string]: number | null;
}

export default function ListeningDetailPage() {
  const { audioId } = useParams<{ audioId: string }>();
  const exercise = getListeningExercise(audioId ?? "");

  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(-1);

  const sentences = useMemo(
    () => (exercise ? splitSentences(exercise.transcript) : []),
    [exercise],
  );

  if (!exercise) return <Navigate to="/listening" replace />;

  const score = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    exercise.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return { correct, total: exercise.questions.length };
  }, [submitted, answers, exercise.questions]);

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
  };

  const isAnswered = (questionId: string) => answers[questionId] !== null && answers[questionId] !== undefined;
  const allAnswered = exercise.questions.every((q) => isAnswered(q.id));

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <Link
        to="/listening"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All listening exercises
      </Link>

      <PageHeader
        title={exercise.title}
        description={`${exercise.kind} · ${exercise.accent} accent · ${exercise.minutes} min`}
        actions={<Badge>{exercise.level}</Badge>}
      />

      {/* Audio Player */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="size-4 text-accent" aria-hidden />
            Listen to the audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TtsPlayer exercise={exercise} onSentenceChange={setCurrentSentence} />
          <p className="text-sm text-muted-foreground">
            Listen carefully — you can slow the voice down, replay sentence by sentence, and toggle the
            transcript below to follow along.
          </p>
        </CardContent>
      </Card>

      {/* Transcript Toggle */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant={showTranscript ? "primary" : "outline"}
          onClick={() => setShowTranscript(!showTranscript)}
          className="gap-2"
        >
          {showTranscript ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
          {showTranscript ? "Hide" : "Show"} Transcript
        </Button>
      </div>

      {/* Transcript */}
      {showTranscript && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7">
              {sentences.map((s, i) => (
                <span
                  key={i}
                  className={`transition-colors ${i === currentSentence ? "rounded bg-primary/20 font-medium" : ""}`}
                >
                  {s}{" "}
                </span>
              ))}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comprehension Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Comprehension Questions</h2>
          {submitted && score && (
            <div className="text-sm font-semibold">
              Score: <span className="text-success">{score.correct}</span>/{score.total}
            </div>
          )}
        </div>

        {exercise.questions.map((question, qIndex) => {
          const isCorrect = answers[question.id] === question.correctAnswer;
          const isAnsweredQuestion = isAnswered(question.id);

          return (
            <Card key={question.id} className={submitted ? (isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5") : ""}>
              <CardHeader>
                <CardTitle className="text-base">
                  Question {qIndex + 1}: {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isSelected = answers[question.id] === oIndex;
                    const isCorrectOption = oIndex === question.correctAnswer;
                    const showResult = submitted && isAnsweredQuestion;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswer(question.id, oIndex)}
                        disabled={submitted}
                        className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                          isSelected
                            ? showResult
                              ? isCorrect
                                ? "border-success bg-success/10"
                                : "border-destructive bg-destructive/10"
                              : "border-primary bg-primary/10"
                            : showResult && isCorrectOption
                              ? "border-success bg-success/10"
                              : "border-border hover:border-muted-foreground"
                        } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              isSelected
                                ? showResult
                                  ? isCorrect
                                    ? "border-success bg-success"
                                    : "border-destructive bg-destructive"
                                  : "border-primary bg-primary"
                                : showResult && isCorrectOption
                                  ? "border-success bg-success"
                                  : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && showResult ? (
                              isCorrect ? (
                                <Check className="size-3 text-white" aria-hidden />
                              ) : (
                                <X className="size-3 text-white" aria-hidden />
                              )
                            ) : showResult && isCorrectOption ? (
                              <Check className="size-3 text-white" aria-hidden />
                            ) : null}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {submitted && isAnsweredQuestion && (
                  <div className={`rounded-lg p-3 text-sm ${isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex gap-3">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!allAnswered} className="gap-2" size="lg">
            <Check aria-hidden /> Submit Answers
          </Button>
        ) : (
          <Button onClick={handleReset} variant="outline" className="gap-2" size="lg">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
