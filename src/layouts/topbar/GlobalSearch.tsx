import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, BookOpen, FileText, Gamepad2, BookMarked, type LucideIcon } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { searchAll, type SearchResult } from "@/lib/search-index";

const kindIcons: Record<SearchResult["kind"], LucideIcon> = {
  Page: FileText,
  Course: BookOpen,
  Word: BookMarked,
  Game: Gamepad2,
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const results = useMemo(() => searchAll(query), [query]);

  const go = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(result.path);
  };

  return (
    <div ref={ref} className="relative hidden max-w-md flex-1 md:block">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) go(results[0]);
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Search lessons, words, courses…"
        aria-label="Global search"
        aria-expanded={open && results.length > 0}
        className="h-10 w-full rounded-xl border border-border bg-card pr-4 pl-10 text-sm transition-colors placeholder:text-muted-foreground focus:border-ring"
      />
      <AnimatePresence>
        {open && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 left-0 z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lifted"
            role="listbox"
            aria-label="Search results"
          >
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No results for “{query.trim()}”
              </p>
            ) : (
              results.map((result) => {
                const Icon = kindIcons[result.kind];
                return (
                  <button
                    key={result.id}
                    role="option"
                    aria-selected={false}
                    onClick={() => go(result)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{result.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{result.subtitle}</span>
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                      {result.kind}
                    </span>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
