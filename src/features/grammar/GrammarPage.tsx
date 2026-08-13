import { Link } from "react-router-dom";
import { ChevronRight, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { grammarTopics, grammarCategories } from "./grammar-content";

export default function GrammarPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <PageHeader
        title="Grammar"
        description="A complete reference — every English verb tense plus core structures, with rules and exceptions."
      />

      <div className="space-y-8">
        {grammarCategories.map((category) => {
          const topics = grammarTopics.filter((t) => t.category === category);
          if (topics.length === 0) return null;
          return (
            <section key={category}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                <BookOpen className="size-4" aria-hidden />
                {category}
              </h2>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <Link key={topic.id} to={`/grammar/${topic.id}`} className="block">
                    <Card className="flex items-center gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">
                        {topic.level}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{topic.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{topic.summary}</p>
                      </div>
                      <Badge variant="secondary">{topic.uses.length} uses</Badge>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
