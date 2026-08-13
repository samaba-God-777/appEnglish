import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  SpellCheck2,
  Headphones,
  Mic,
  BookText,
  PenLine,
  Sparkles,
  Layers,
  Gamepad2,
  Trophy,
  Medal,
  Award,
  Settings,
  Users,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
      { label: "My Courses", path: "/courses", icon: BookOpen },
    ],
  },
  {
    title: "Learn",
    items: [
      { label: "Vocabulary", path: "/vocabulary", icon: BookMarked },
      { label: "Grammar", path: "/grammar", icon: SpellCheck2 },
      { label: "Listening", path: "/listening", icon: Headphones },
      { label: "Speaking", path: "/speaking", icon: Mic },
      { label: "Reading", path: "/reading", icon: BookText },
      { label: "Writing", path: "/writing", icon: PenLine },
    ],
  },
  {
    title: "AI",
    items: [
      { label: "AI Tutor", path: "/ai-tutor", icon: Sparkles, badge: "New" },
      { label: "Flashcards", path: "/flashcards", icon: Layers },
    ],
  },
  {
    title: "Play",
    items: [
      { label: "Games", path: "/games", icon: Gamepad2 },
      { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
      { label: "Achievements", path: "/achievements", icon: Medal },
      { label: "Certificates", path: "/certificates", icon: Award },
    ],
  },
  {
    title: "Classroom",
    items: [
      { label: "Teacher Panel", path: "/teacher-panel", icon: Users },
      { label: "Join Class", path: "/join-class", icon: KeyRound },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", path: "/settings", icon: Settings }],
  },
];
