import { courses, vocabularyWords, games } from "@/data/mock";
import { navSections } from "@/layouts/nav-config";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  kind: "Page" | "Course" | "Word" | "Game";
  path: string;
}

const index: SearchResult[] = [
  ...navSections.flatMap((section) =>
    section.items.map((item) => ({
      id: `nav-${item.path}`,
      title: item.label,
      subtitle: `${section.title} · page`,
      kind: "Page" as const,
      path: item.path,
    })),
  ),
  ...courses.map((course) => ({
    id: course.id,
    title: course.title,
    subtitle: `${course.level} course · ${course.lessons} lessons`,
    kind: "Course" as const,
    path: "/courses",
  })),
  ...vocabularyWords.map((word) => ({
    id: word.id,
    title: word.word,
    subtitle: `${word.level} · ${word.definition}`,
    kind: "Word" as const,
    path: "/vocabulary",
  })),
  ...games.map((game) => ({
    id: game.id,
    title: game.title,
    subtitle: `Game · ${game.difficulty}`,
    kind: "Game" as const,
    path: "/games",
  })),
];

export function searchAll(query: string, limit = 7): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const starts = index.filter((r) => r.title.toLowerCase().startsWith(q));
  const contains = index.filter(
    (r) => !starts.includes(r) && (r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)),
  );
  return [...starts, ...contains].slice(0, limit);
}
