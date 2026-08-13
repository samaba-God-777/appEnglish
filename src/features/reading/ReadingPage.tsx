import { Link } from "react-router-dom";
import { BookText, Clock, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllArticles } from "./reading-data";

export default function ReadingPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <PageHeader
        title="Reading"
        description="Every text comes with AI summaries, vocabulary explanations and comprehension checks."
      />

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id} className="p-5 transition-shadow duration-200 hover:shadow-lifted">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{article.level}</Badge>
              <span className="flex items-center gap-1">
                <BookText className="size-3.5" aria-hidden /> {article.type}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden /> {article.estimatedMinutes} min · {article.wordCount} words
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold tracking-tight">{article.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{article.preview}</p>
            <div className="mt-4 flex gap-2">
              <Link to={`/reading/${article.id}`}>
                <Button className="gap-2">
                  Read now →
                </Button>
              </Link>
              <Button variant="outline" className="gap-2">
                <Sparkles className="size-4" aria-hidden />
                AI summary
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
