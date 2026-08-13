import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { PageSkeleton } from "@/components/ui/skeleton";

const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const SignUpPage = lazy(() => import("@/features/auth/SignUpPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const CoursesPage = lazy(() => import("@/features/courses/CoursesPage"));
const CourseDetailPage = lazy(() => import("@/features/courses/CourseDetailPage"));
const VocabularyPage = lazy(() => import("@/features/vocabulary/VocabularyPage"));
const GrammarPage = lazy(() => import("@/features/grammar/GrammarPage"));
const GrammarTopicPage = lazy(() => import("@/features/grammar/GrammarTopicPage"));
const GrammarGamePage = lazy(() => import("@/features/grammar/GrammarGamePage"));
const GrammarAiQuizPage = lazy(() => import("@/features/grammar/GrammarAiQuizPage"));
const ListeningPage = lazy(() => import("@/features/listening/ListeningPage"));
const ListeningDetailPage = lazy(() => import("@/features/listening/ListeningDetailPage"));
const SpeakingPage = lazy(() => import("@/features/speaking/SpeakingPage"));
const ReadingPage = lazy(() => import("@/features/reading/ReadingPage"));
const ReadingDetailPage = lazy(() => import("@/features/reading/ReadingDetailPage"));
const WritingPage = lazy(() => import("@/features/writing/WritingPage"));
const AiTutorPage = lazy(() => import("@/features/ai-tutor/AiTutorPage"));
const FlashcardsPage = lazy(() => import("@/features/flashcards/FlashcardsPage"));
const GamesPage = lazy(() => import("@/features/games/GamesPage"));
const LeaderboardPage = lazy(() => import("@/features/leaderboard/LeaderboardPage"));
const AchievementsPage = lazy(() => import("@/features/achievements/AchievementsPage"));
const CertificatesPage = lazy(() => import("@/features/certificates/CertificatesPage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <SignUpPage />
      </Suspense>
    ),
  },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/courses", element: <CoursesPage /> },
      { path: "/courses/:courseId", element: <CourseDetailPage /> },
      { path: "/vocabulary", element: <VocabularyPage /> },
      { path: "/grammar", element: <GrammarPage /> },
      { path: "/grammar/:topicId", element: <GrammarTopicPage /> },
      {
        path: "/grammar/:topicId/activity",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <GrammarGamePage mode="activity" />
          </Suspense>
        ),
      },
      {
        path: "/grammar/:topicId/test",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <GrammarGamePage mode="test" />
          </Suspense>
        ),
      },
      {
        path: "/grammar/:topicId/assignment",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <GrammarGamePage mode="assignment" />
          </Suspense>
        ),
      },
      {
        path: "/grammar/:topicId/ai",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <GrammarAiQuizPage />
          </Suspense>
        ),
      },
      { path: "/listening", element: <ListeningPage /> },
      { path: "/listening/:audioId", element: <ListeningDetailPage /> },
      { path: "/speaking", element: <SpeakingPage /> },
      { path: "/reading", element: <ReadingPage /> },
      { path: "/reading/:articleId", element: <ReadingDetailPage /> },
      { path: "/writing", element: <WritingPage /> },
      { path: "/ai-tutor", element: <AiTutorPage /> },
      { path: "/flashcards", element: <FlashcardsPage /> },
      { path: "/games", element: <GamesPage /> },
      { path: "/leaderboard", element: <LeaderboardPage /> },
      { path: "/achievements", element: <AchievementsPage /> },
      { path: "/certificates", element: <CertificatesPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
