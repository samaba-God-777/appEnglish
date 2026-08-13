import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Lightbulb, Tag, Swords, PartyPopper, Trophy, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grammarTopics, getGrammarTopic } from "./grammar-content";
import { useGrammarProgress } from "./useGrammarProgress";
import { GrammarAssistant } from "./GrammarAssistant";
import { cn } from "@/lib/cn";

export default function GrammarTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = getGrammarTopic(topicId ?? "");

  const { prev, next } = useMemo(() => {
    const i = grammarTopics.findIndex((t) => t.id === topicId);
    return { prev: i > 0 ? grammarTopics[i - 1] : null, next: i < grammarTopics.length - 1 ? grammarTopics[i + 1] : null };
  }, [topicId]);

  if (!topic) return <Navigate to="/grammar" replace />;

  return (
    <div className="mx-auto max-w-3xl p-4 lg:p-8">
      <Link
        to="/grammar"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All grammar
      </Link>

      <PageHeader
        title={topic.title}
        description={topic.summary}
        actions={
          <div className="flex items-center gap-2">
            <Badge>{topic.level}</Badge>
            <Badge variant="secondary">{topic.category}</Badge>
          </div>
        }
      />

      {/* Structure */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {(
            [
              ["Affirmative", topic.structure.affirmative, "text-success"],
              ["Negative", topic.structure.negative, "text-destructive"],
              ["Question", topic.structure.question, "text-primary"],
            ] as const
          ).map(([label, value, color]) => (
            <div key={label} className="rounded-xl border border-border bg-muted/50 p-3">
              <p className={`text-xs font-bold tracking-wide uppercase ${color}`}>{label}</p>
              <p className="mt-1 font-mono text-sm">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Uses */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-4 text-accent" aria-hidden /> When to use it
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topic.uses.map((use) => (
            <div key={use.rule} className="flex gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              <div>
                <p className="text-sm font-semibold">{use.rule}</p>
                <p className="text-sm text-muted-foreground italic">“{use.example}”</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Signal words + Examples */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="size-4 text-primary" aria-hidden /> Signal words
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {topic.signalWords.map((word) => (
              <Badge key={word} variant="outline">
                {word}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topic.examples.map((ex) => (
              <p key={ex} className="rounded-lg bg-muted px-3 py-2 text-sm">
                {ex}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Exceptions */}
      <Card className="mb-6 border-warning/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleAlert className="size-4 text-warning" aria-hidden /> Rules &amp; exceptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {topic.exceptions.map((ex) => (
              <li key={ex} className="flex gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" aria-hidden />
                {ex}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <GrammarAssistant
        topic={{ title: topic.title, level: topic.level, signalWords: topic.signalWords }}
      />

      <PracticeCard topicId={topic.id} />

      {/* Prev / next navigation */}
      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            to={`/grammar/${prev.id}`}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span className="max-w-[9rem] truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/grammar/${next.id}`}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <span className="max-w-[9rem] truncate">{next.title}</span>
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}

function PracticeCard({ topicId }: { topicId: string }) {
  const progress = useGrammarProgress((s) => s.completed[topicId]);

  const modes = [
    {
      id: "activity" as const,
      name: "Challenge",
      blurb: "5 quick questions",
      to: `/grammar/${topicId}/activity`,
      icon: PartyPopper,
      accent: "text-accent",
      badge:
        progress && progress.bestActivity > 0
          ? { label: `Best ${progress.bestActivity}/5`, variant: "accent" as const }
          : null,
    },
    {
      id: "test" as const,
      name: "Test",
      blurb: "Track your best score",
      to: `/grammar/${topicId}/test`,
      icon: Trophy,
      accent: "text-primary",
      badge:
        progress && progress.bestTestScore > 0
          ? { label: `Best ${progress.bestTestScore}/6`, variant: "secondary" as const }
          : null,
    },
    {
      id: "assignment" as const,
      name: "Assignment",
      blurb: "Pass at 70% to complete",
      to: `/grammar/${topicId}/assignment`,
      icon: Swords,
      accent: "text-destructive",
      badge:
        progress && progress.assignmentPassed
          ? { label: "Passed", variant: "success" as const }
          : null,
    },
  ];

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Swords className="size-4 text-primary" aria-hidden /> Practice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.id}
                to={m.to}
                className={cn(
                  "group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-150",
                  "hover:-translate-y-0.5 hover:border-primary hover:shadow-soft",
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon className={cn("size-6 transition-transform group-hover:scale-110", m.accent)} aria-hidden />
                  {m.badge && <Badge variant={m.badge.variant}>{m.badge.label}</Badge>}
                </div>
                <div>
                  <p className="text-sm font-bold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.blurb}</p>
                </div>
                <span className="text-xs font-semibold text-primary">Start →</span>
              </Link>
            );
          })}
        </div>

        <Link
          to={`/grammar/${topicId}/ai`}
          className="group mt-3 flex items-center gap-4 rounded-xl border border-dashed border-primary/40 bg-gradient-to-r from-primary/10 to-transparent p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold">AI Practice</span>
            <span className="block text-xs text-muted-foreground">Fresh questions, generated by AI for this topic</span>
          </span>
          <span className="text-sm font-semibold text-primary">Generate →</span>
        </Link>
      </CardContent>
    </Card>
  );
}
