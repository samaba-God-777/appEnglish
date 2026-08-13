import { Link } from "react-router-dom";
import { Headphones, Play } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllListeningExercises } from "./listening-data";

export default function ListeningPage() {
  const items = getAllListeningExercises();

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <PageHeader
        title="Listening"
        description="Real accents, real speed — AI generates comprehension questions for every audio."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden transition-shadow duration-200 hover:shadow-lifted">
            <div className="relative h-36 overflow-hidden">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge className="absolute top-3 left-3 bg-card/90 text-foreground backdrop-blur-sm">{item.level}</Badge>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Headphones className="size-3.5" aria-hidden />
                {item.kind} · {item.accent} accent · {item.minutes} min
              </div>
              <h3 className="mt-1 text-base font-bold tracking-tight">{item.title}</h3>
              <Link to={`/listening/${item.id}`} className="mt-4 block">
                <Button className="w-full">
                  <Play aria-hidden /> Listen & answer
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
