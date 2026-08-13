import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Volume2, Gauge, Check, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { vocabularyWords } from "@/data/mock";
import { vocabTopics } from "@/data/vocabulary/topics";
import { useVocabStore, useMasteredCount, useLearningCount, totalWords, masteredThreshold } from "@/store/vocab";
import { useStatsStore } from "@/store/stats";
import { useAuthStore } from "@/store/auth";
import { speak } from "@/lib/speech";
import { WordIllustration } from "./WordIllustration";
import { DictionarySearch } from "./DictionarySearch";

const PAGE_SIZE = 48;

/** Topics that actually have words, with their counts. */
const topicCounts: Record<string, number> = vocabularyWords.reduce((acc, w) => {
  acc[w.topic] = (acc[w.topic] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);
const activeTopics = vocabTopics.filter((t) => (topicCounts[t.id] ?? 0) > 0);

export default function VocabularyPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const masteryByWord = useVocabStore((s) => s.masteryByWord);
  const practice = useVocabStore((s) => s.practice);
  const mastered = useMasteredCount();
  const learning = useLearningCount();
  const addActivity = useStatsStore((s) => s.addActivity);
  const addXp = useAuthStore((s) => s.addXp);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vocabularyWords.filter((w) => {
      if (topic !== "all" && w.topic !== topic) return false;
      if (!q) return true;
      return (
        w.word.toLowerCase().includes(q) ||
        w.definition.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q)
      );
    });
  }, [query, topic]);

  // Reset pagination when the filter changes.
  useEffect(() => setLimit(PAGE_SIZE), [query, topic]);

  const visible = filtered.slice(0, limit);

  const handlePractice = (wordId: string, known: boolean) => {
    practice(wordId, known);
    const xp = known ? 10 : 4;
    addXp(xp);
    addActivity(xp, 1, "vocabulary");
  };

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <PageHeader
        title="Vocabulary"
        description={`${totalWords} words in your deck · ${mastered} mastered · ${learning} in progress`}
        actions={
          <Link
            to="/flashcards"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
          >
            Practice with flashcards
          </Link>
        }
      />

      <DictionarySearch />

      {/* Topic filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setTopic("all")}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            topic === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/50"
          }`}
        >
          All <span className="tabular-nums opacity-70">{vocabularyWords.length}</span>
        </button>
        {activeTopics.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopic(t.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              topic === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
          >
            <span aria-hidden>{t.emoji}</span> {t.label}{" "}
            <span className="tabular-nums opacity-70">{topicCounts[t.id]}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight">
          {topic === "all" ? "Your deck" : activeTopics.find((t) => t.id === topic)?.label}
          <span className="ml-2 text-sm font-medium text-muted-foreground tabular-nums">
            {filtered.length} word{filtered.length === 1 ? "" : "s"}
          </span>
        </h2>
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your words…"
            aria-label="Search your deck"
            className="h-10 w-full rounded-xl border border-border bg-card pr-4 pl-10 text-sm placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((word) => {
          const mastery = masteryByWord[word.id] ?? 0;
          const isMastered = mastery >= masteredThreshold;
          return (
            <Card key={word.id} className="flex flex-col p-5 transition-shadow duration-200 hover:shadow-lifted">
              <div className="flex items-start gap-3">
                <WordIllustration icon={word.icon} color={word.color} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-extrabold tracking-tight">{word.word}</h3>
                      <p className="text-xs text-muted-foreground">
                        {word.phonetic} · <em>{word.partOfSpeech}</em>
                      </p>
                    </div>
                    <Badge variant="secondary">{word.level}</Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2"
                      aria-label={`Listen to ${word.word}`}
                      onClick={() => speak(word.word)}
                    >
                      <Volume2 aria-hidden /> Listen
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      aria-label={`Listen to ${word.word} slowly`}
                      onClick={() => speak(word.word, { slow: true })}
                    >
                      <Gauge aria-hidden />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm">{word.definition}</p>
              {word.example && (
                <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground italic">
                  “{word.example}”
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="accent">{word.translation}</Badge>
                {word.synonyms?.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">Mastery</span>
                <Progress
                  value={mastery}
                  className="h-1.5 flex-1"
                  barClassName={isMastered ? "bg-success" : undefined}
                  label={`Mastery of ${word.word}`}
                />
                <span className="w-9 text-right text-xs font-bold tabular-nums">{mastery}%</span>
              </div>

              <div className="mt-3 flex gap-2">
                {isMastered ? (
                  <span className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-success/10 text-sm font-semibold text-success">
                    <CheckCircle2 className="size-4" aria-hidden /> Mastered
                  </span>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handlePractice(word.id, false)}>
                      Still learning
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handlePractice(word.id, true)}>
                      <Check aria-hidden /> I know it
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
        {visible.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No words match your search. Try a different word or topic.
          </p>
        )}
      </div>

      {filtered.length > limit && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
            Load more ({filtered.length - limit} left)
          </Button>
        </div>
      )}
    </div>
  );
}
