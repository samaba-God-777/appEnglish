import { Award, Download, Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CefrLevel } from "@/types";
import { cn } from "@/lib/cn";

interface Certificate {
  level: CefrLevel;
  title: string;
  earnedOn: string | null;
}

const certificates: Certificate[] = [
  { level: "A1", title: "Beginner English Certificate", earnedOn: "March 12, 2026" },
  { level: "A2", title: "Elementary English Certificate", earnedOn: "June 3, 2026" },
  { level: "B1", title: "Intermediate English Certificate", earnedOn: null },
  { level: "B2", title: "Upper-Intermediate English Certificate", earnedOn: null },
  { level: "C1", title: "Advanced English Certificate", earnedOn: null },
];

export default function CertificatesPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <PageHeader
        title="Certificates"
        description="Official EnglishAI Pro certificates — earned by passing each level's final exam."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {certificates.map((cert) => {
          const earned = cert.earnedOn !== null;
          return (
            <Card
              key={cert.level}
              className={cn(
                "relative overflow-hidden p-6 transition-shadow duration-200",
                earned ? "hover:shadow-lifted" : "opacity-70",
              )}
            >
              <div className="absolute -top-6 -right-6 size-24 rounded-full bg-primary/5" aria-hidden />
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl",
                  earned ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground",
                )}
              >
                {earned ? <Award className="size-6" aria-hidden /> : <Lock className="size-5" aria-hidden />}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant={earned ? "accent" : "outline"}>{cert.level}</Badge>
                {earned && <Badge variant="success">Earned</Badge>}
              </div>
              <h3 className="mt-2 text-base font-bold tracking-tight">{cert.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {earned ? `Earned on ${cert.earnedOn}` : "Pass the final exam to unlock this certificate."}
              </p>
              {earned && (
                <Button variant="outline" className="mt-4">
                  <Download aria-hidden /> Download PDF
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
