import { WordIllustration } from "@/features/vocabulary/WordIllustration";
import { cn } from "@/lib/cn";
import type { FlashCard } from "./flashcard-decks";

/**
 * The hero "picture" for a flashcard: a soft tinted panel washed in the word's
 * gradient colour with a large illustration tile centred on it.
 */
export function CardArt({
  card,
  compact = false,
  bleed = false,
  className,
}: {
  card: FlashCard;
  compact?: boolean;
  bleed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden",
        bleed ? "rounded-none" : "rounded-2xl",
        compact ? "py-6" : "py-10",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-15", card.color)} aria-hidden />
      <WordIllustration icon={card.icon} color={card.color} size={compact ? "lg" : "xl"} />
    </div>
  );
}