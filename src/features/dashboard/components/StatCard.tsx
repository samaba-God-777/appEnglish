import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string;
  sublabel: string;
  icon: LucideIcon;
  iconClassName?: string;
  delay?: number;
  to?: string;
}

export function StatCard({ label, value, sublabel, icon: Icon, iconClassName, delay = 0, to }: StatCardProps) {
  const card = (
    <Card
      className={cn(
        "p-5 transition-shadow duration-200 hover:shadow-lifted",
        to && "h-full cursor-pointer transition-transform hover:-translate-y-0.5",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-tight tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary", iconClassName)}>
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {to ? (
        <Link to={to} aria-label={`${label}: ${value} — open`} className="block h-full">
          {card}
        </Link>
      ) : (
        card
      )}
    </motion.div>
  );
}
