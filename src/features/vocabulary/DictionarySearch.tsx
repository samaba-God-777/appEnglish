import { useMemo, useState } from "react";
import { Search, Loader2, BookOpen, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWordList } from "./useWordList";
import { WordDetailModal } from "./WordDetailModal";

export function DictionarySearch() {
  const { ready, total, search } = useWordList();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const results = useMemo(() => search(query), [search, query]);
  const trimmed = query.trim();

  return (
    <Card className="mb-8 p-5 lg:p-6">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="size-5 text-primary" aria-hidden />
        <h2 className="text-base font-bold tracking-tight">Dictionary</h2>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {ready ? `${total.toLocaleString()} words` : "loading…"}
        </span>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Look up any English word…"
          aria-label="Search the dictionary"
          className="h-12 w-full rounded-xl border border-border bg-background pr-4 pl-10 text-sm placeholder:text-muted-foreground focus:border-ring"
        />
        {!ready && trimmed.length >= 2 && (
          <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
        )}
      </div>

      {trimmed.length >= 2 && (
        <div className="mt-3">
          {results.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {ready ? `No words start with “${trimmed}”.` : "Loading the dictionary…"}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2" role="list">
              {results.map((word) => (
                <button
                  key={word}
                  role="listitem"
                  onClick={() => setSelected(word)}
                  className="group inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
                >
                  {word}
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {trimmed.length < 2 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Type at least 2 letters. Click any word to hear its audio and see how it's used in context.
        </p>
      )}

      {selected && <WordDetailModal word={selected} onClose={() => setSelected(null)} />}
    </Card>
  );
}
