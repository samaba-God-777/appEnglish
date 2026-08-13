import type { CefrLevel, Course, SkillKey } from "@/types";
import { unitTopicsByLevel } from "./level-content";

export type LessonType = SkillKey | "quiz";

export interface Lesson {
  /** 0-based index across the whole course; order defines unlocking. */
  index: number;
  title: string;
  type: LessonType;
  minutes: number;
  xp: number;
  /** CEFR level of the parent course; selects the exercise bank. */
  level: CefrLevel;
}

export interface CourseUnit {
  number: number;
  title: string;
  lessons: Lesson[];
}

const lessonThemes: Record<LessonType, readonly string[]> = {
  vocabulary: ["Key words", "Word families", "Collocations", "Phrasal verbs"],
  grammar: ["Structure focus", "Common mistakes", "Patterns in context"],
  listening: ["Short dialogue", "Podcast clip", "Real-world audio"],
  speaking: ["Pronunciation drill", "Role-play", "Describe & discuss"],
  reading: ["Short text", "Skim & scan", "Detail hunting"],
  writing: ["Guided writing", "Sentence upgrade", "Free practice"],
  quiz: ["Unit checkpoint"],
};

const typeCycle: readonly LessonType[] = [
  "vocabulary",
  "grammar",
  "listening",
  "speaking",
  "reading",
  "writing",
];

/** Deterministically expands a course into units and lessons, themed by CEFR level. */
export function buildCourseUnits(course: Course): CourseUnit[] {
  const perUnit = Math.max(2, Math.round(course.lessons / course.units));
  const topics = unitTopicsByLevel[course.level];
  const units: CourseUnit[] = [];
  let index = 0;

  for (let u = 0; u < course.units && index < course.lessons; u++) {
    const remaining = course.lessons - index;
    const unitsLeft = course.units - u;
    const count = u === course.units - 1 ? remaining : Math.min(perUnit, remaining - (unitsLeft - 1));
    const lessons: Lesson[] = [];

    for (let l = 0; l < count; l++) {
      const isCheckpoint = l === count - 1;
      const type = isCheckpoint ? "quiz" : (typeCycle[(index + l) % typeCycle.length] ?? "vocabulary");
      const themes = lessonThemes[type];
      const theme = themes[(u + l) % themes.length] ?? themes[0] ?? "Lesson";
      lessons.push({
        index: index + l,
        title: isCheckpoint ? `Checkpoint: Unit ${u + 1} review` : `${theme}`,
        type,
        minutes: 5 + ((u + l * 3) % 11),
        xp: isCheckpoint ? 40 : 15 + ((l * 7) % 16),
        level: course.level,
      });
    }

    units.push({
      number: u + 1,
      title: `Unit ${u + 1}: ${topics[u % topics.length]}`,
      lessons,
    });
    index += count;
  }

  return units;
}
