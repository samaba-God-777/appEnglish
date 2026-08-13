import { supabase } from "./supabase";
import type { SkillKey, TeacherClass, StudentWithScores } from "@/types";

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// ── Profiles ──────────────────────────────────────────────────

export async function fetchProfile(userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

export async function updateProfile(userId: string, patch: Record<string, unknown>) {
  await supabase.from("profiles").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", userId);
}

// ── Daily Activity ────────────────────────────────────────────

export async function upsertDailyActivity(xp: number, minutes: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.rpc("upsert_daily_activity", { p_user_id: uid, p_xp: xp, p_minutes: minutes });
}

export async function fetchDailyActivity(userId: string) {
  const { data } = await supabase
    .from("daily_activity")
    .select("activity_date, xp, minutes")
    .eq("user_id", userId)
    .order("activity_date", { ascending: true });
  return data ?? [];
}

// ── Skill XP ──────────────────────────────────────────────────

export async function upsertSkillXp(skill: SkillKey, xp: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase
    .from("skill_xp")
    .upsert({ user_id: uid, skill, xp, updated_at: new Date().toISOString() }, { onConflict: "user_id,skill" });
}

export async function fetchSkillXp(userId: string) {
  const { data } = await supabase.from("skill_xp").select("skill, xp").eq("user_id", userId);
  return data ?? [];
}

// ── Course Progress ───────────────────────────────────────────

export async function upsertCourseProgress(courseId: string, completedLessons: number, totalLessons: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("course_progress").upsert(
    {
      user_id: uid,
      course_id: courseId,
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id" },
  );
}

export async function fetchCourseProgress(userId: string) {
  const { data } = await supabase.from("course_progress").select("*").eq("user_id", userId);
  return data ?? [];
}

// ── Vocabulary Progress ───────────────────────────────────────

export async function upsertVocabularyProgress(wordId: string, word: string, mastery: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("vocabulary_progress").upsert(
    {
      user_id: uid,
      word_id: wordId,
      word,
      mastery,
      times_practiced: 1,
      last_practiced_at: new Date().toISOString(),
    },
    { onConflict: "user_id,word_id" },
  );
}

export async function fetchVocabularyProgress(userId: string) {
  const { data } = await supabase.from("vocabulary_progress").select("word_id, mastery").eq("user_id", userId);
  return data ?? [];
}

// ── Grammar Progress ──────────────────────────────────────────

export async function upsertGrammarProgress(
  topicId: string,
  topicTitle: string,
  score: number,
  questionsAttempted: number,
  questionsCorrect: number,
) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("grammar_progress").upsert(
    {
      user_id: uid,
      topic_id: topicId,
      topic_title: topicTitle,
      score,
      questions_attempted: questionsAttempted,
      questions_correct: questionsCorrect,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,topic_id" },
  );
}

export async function fetchGrammarProgress(userId: string) {
  const { data } = await supabase.from("grammar_progress").select("*").eq("user_id", userId);
  return data ?? [];
}

// ── Listening Progress ────────────────────────────────────────

export async function upsertListeningProgress(audioId: string, completed: boolean, score?: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("listening_progress").upsert(
    {
      user_id: uid,
      audio_id: audioId,
      completed,
      score,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,audio_id" },
  );
}

export async function fetchListeningProgress(userId: string) {
  const { data } = await supabase.from("listening_progress").select("*").eq("user_id", userId);
  return data ?? [];
}

// ── Speaking Sessions ─────────────────────────────────────────

export async function insertSpeakingSession(session: {
  mode: string;
  level?: string;
  target_sentence?: string;
  transcript?: string;
  overall_score?: number;
  pronunciation_score?: number;
  fluency_score?: number;
  intonation_score?: number;
  grammar_score?: number;
  vocabulary_score?: number;
  naturalness_score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
}) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("speaking_sessions").insert({ user_id: uid, ...session });
}

export async function fetchSpeakingSessions(userId: string, limit = 50) {
  const { data } = await supabase
    .from("speaking_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ── Reading Progress ──────────────────────────────────────────

export async function upsertReadingProgress(articleId: string, completed: boolean, score?: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("reading_progress").upsert(
    {
      user_id: uid,
      article_id: articleId,
      completed,
      comprehension_score: score,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,article_id" },
  );
}

export async function fetchReadingProgress(userId: string) {
  const { data } = await supabase.from("reading_progress").select("*").eq("user_id", userId);
  return data ?? [];
}

// ── Writing Essays ────────────────────────────────────────────

export async function insertWritingEssay(essay: {
  essay_id: string;
  prompt_id?: string;
  prompt_text?: string;
  level?: string;
  genre?: string;
  text: string;
  overall_score?: number;
  grammar_score?: number;
  vocabulary_score?: number;
  coherence_score?: number;
  task_response_score?: number;
  corrections?: unknown[];
  feedback?: string;
  improved_version?: string;
  vocabulary_suggestions?: unknown[];
}) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("writing_essays").insert({ user_id: uid, ...essay });
}

export async function fetchWritingEssays(userId: string, limit = 50) {
  const { data } = await supabase
    .from("writing_essays")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ── AI Tutor Chats ────────────────────────────────────────────

export async function insertAiTutorChat(topic: string, messages: unknown[]) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("ai_tutor_chats").insert({ user_id: uid, topic, messages });
}

export async function fetchAiTutorChats(userId: string, limit = 20) {
  const { data } = await supabase
    .from("ai_tutor_chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ── Flashcard Decks ───────────────────────────────────────────

export async function upsertFlashcardDeck(deckId: string, deckName: string, cardsStudied: number, cardsMastered: number, totalCards: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("flashcard_decks").upsert(
    {
      user_id: uid,
      deck_id: deckId,
      deck_name: deckName,
      cards_studied: cardsStudied,
      cards_mastered: cardsMastered,
      total_cards: totalCards,
      last_studied_at: new Date().toISOString(),
    },
    { onConflict: "user_id,deck_id" },
  );
}

export async function fetchFlashcardDecks(userId: string) {
  const { data } = await supabase.from("flashcard_decks").select("*").eq("user_id", userId);
  return data ?? [];
}

// ── Game Sessions ─────────────────────────────────────────────

export async function insertGameSession(session: {
  game_type: string;
  level?: string;
  score: number;
  rounds_played: number;
  rounds_correct: number;
  xp_earned: number;
  duration_seconds?: number;
}) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("game_sessions").insert({ user_id: uid, ...session });
}

export async function fetchGameSessions(userId: string, limit = 50) {
  const { data } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ── Achievements ──────────────────────────────────────────────

export async function upsertAchievement(achievementId: string, unlocked: boolean, progress: number, target: number) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("user_achievements").upsert(
    {
      user_id: uid,
      achievement_id: achievementId,
      unlocked,
      progress,
      target,
      unlocked_at: unlocked ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,achievement_id" },
  );
}

export async function fetchAchievements(userId: string) {
  const { data } = await supabase.from("user_achievements").select("*").eq("user_id", userId);
  return data ?? [];
}

// ── Certificates ──────────────────────────────────────────────

export async function insertCertificate(certificateId: string, title: string, level: string) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("user_certificates").insert({ user_id: uid, certificate_id: certificateId, title, level });
}

export async function fetchCertificates(userId: string) {
  const { data } = await supabase.from("user_certificates").select("*").eq("user_id", userId);
  return data ?? [];
}

// ── User Settings ─────────────────────────────────────────────

export async function upsertUserSettings(settings: {
  theme?: string;
  native_language?: string;
  target_level?: string;
  daily_goal_minutes?: number;
  notifications_enabled?: boolean;
  sound_effects_enabled?: boolean;
}) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("user_settings").upsert({ user_id: uid, ...settings, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
}

export async function fetchUserSettings(userId: string) {
  const { data } = await supabase.from("user_settings").select("*").eq("user_id", userId).single();
  return data;
}

// ── Classes (Teacher) ─────────────────────────────────────────

function generateClassCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createClass(className: string, description?: string, level?: string, activities?: string[]) {
  const uid = await getUserId();
  if (!uid) return null;
  const classCode = generateClassCode();
  const { data, error } = await supabase
    .from("classes")
    .insert({ teacher_id: uid, class_name: className, class_code: classCode, description, level: level || "B1", activities: activities || [] })
    .select()
    .single();
  if (error) return null;
  return {
    id: data.id,
    teacherId: data.teacher_id,
    className: data.class_name,
    classCode: data.class_code,
    description: data.description,
    level: data.level,
    activities: data.activities,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as TeacherClass;
}

export async function fetchTeacherClasses() {
  const uid = await getUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", uid)
    .order("created_at", { ascending: false });
  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    teacherId: row.teacher_id,
    className: row.class_name,
    classCode: row.class_code,
    description: row.description,
    level: row.level,
    activities: row.activities,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })) as TeacherClass[];
}

export async function deleteClass(classId: string) {
  await supabase.from("classes").delete().eq("id", classId);
}

export async function fetchClassByCode(code: string) {
  const { data } = await supabase
    .from("classes")
    .select("*")
    .eq("class_code", code.toUpperCase())
    .single();
  if (!data) return null;
  return {
    id: data.id,
    teacherId: data.teacher_id,
    className: data.class_name,
    classCode: data.class_code,
    description: data.description,
    level: data.level,
    activities: data.activities,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as TeacherClass;
}

// ── Enrollments (Student joins class) ─────────────────────────

export async function joinClass(classCode: string) {
  const uid = await getUserId();
  if (!uid) return { error: "Not authenticated" };
  const cls = await fetchClassByCode(classCode);
  if (!cls) return { error: "Class not found. Check the code and try again." };
  const { error } = await supabase
    .from("enrollments")
    .insert({ class_id: cls.id, student_id: uid });
  if (error) {
    if (error.code === "23505") return { error: "You are already enrolled in this class." };
    return { error: "Failed to join class." };
  }
  return { class: cls };
}

export async function fetchStudentEnrollments() {
  const uid = await getUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("enrollments")
    .select("*, classes(*)")
    .eq("student_id", uid)
    .order("joined_at", { ascending: false });
  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    classId: row.class_id,
    studentId: row.student_id,
    joinedAt: row.joined_at,
    class: row.classes
      ? {
          id: row.classes.id,
          teacherId: row.classes.teacher_id,
          className: row.classes.class_name,
          classCode: row.classes.class_code,
          description: row.classes.description,
          createdAt: row.classes.created_at,
          updatedAt: row.classes.updated_at,
        }
      : null,
  }));
}

export async function fetchClassStudents(classId: string): Promise<StudentWithScores[]> {
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id, joined_at")
    .eq("class_id", classId);
  if (!enrollments || enrollments.length === 0) return [];

  const studentIds = enrollments.map((e) => e.student_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_initials, level, xp, words_learned, minutes_studied_today, streak_days")
    .in("id", studentIds);
  if (!profiles) return [];

  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  return enrollments
    .map((enrollment) => {
      const profile = profileMap.get(enrollment.student_id);
      if (!profile) return null;
      return {
        studentId: profile.id,
        studentName: profile.full_name || "Unknown",
        studentEmail: profile.email || "",
        avatarInitials: profile.avatar_initials || "??",
        xp: profile.xp || 0,
        level: profile.level || "A1",
        wordsLearned: profile.words_learned || 0,
        minutesStudied: profile.minutes_studied_today || 0,
        streakDays: profile.streak_days || 0,
        joinedAt: enrollment.joined_at,
      } as StudentWithScores;
    })
    .filter(Boolean) as StudentWithScores[];
}

export async function removeStudentFromClass(classId: string, studentId: string) {
  await supabase
    .from("enrollments")
    .delete()
    .eq("class_id", classId)
    .eq("student_id", studentId);
}
