import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Temporary users for quiz sessions
export const tempUsers = pgTable("temp_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Quiz session table
export const quizSessions = pgTable("quiz_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id"), // Optional reference to auth db user
  tempUserId: uuid("temp_user_id").references(() => tempUsers.id),
  status: text("status").notNull().default('in_progress'),
  currentQuestionId: text("current_question_id"),
  completedQuestions: jsonb("completed_questions").$type<string[]>().default([]).notNull(),
  answers: jsonb("answers").$type<Record<string, string>>().default({}).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

// Quiz results table
export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id"),
  tempUserId: uuid("temp_user_id"),
  sessionId: uuid("session_id").notNull().references(() => quizSessions.id),
  answers: jsonb("answers").$type<Record<string, string>>().notNull(),
  adaptiveFlow: jsonb("adaptive_flow").$type<{
    path: string[];
    branchingDecisions: Record<string, {
      question: string;
      answer: string;
      nextQuestion: string;
    }>
  }>().notNull(),
  traitScores: jsonb("trait_scores").$type<Record<string, number>>().notNull(),
  dominantProfile: text("dominant_profile").notNull(),
  subProfile: text("sub_profile").notNull(),
  traits: jsonb("traits").$type<string[]>().notNull(),
  profileMatchScores: jsonb("profile_match_scores").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Profile completion tracking
export const profileCompletion = pgTable("profile_completion", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  basicInfoCompleted: boolean("basic_info_completed").default(false).notNull(),
  traitsAssessmentCompleted: boolean("traits_assessment_completed").default(false).notNull(),
  personalityQuizCompleted: boolean("personality_quiz_completed").default(false).notNull(),
  interestsCompleted: boolean("interests_completed").default(false).notNull(),
  educationPrefsCompleted: boolean("education_prefs_completed").default(false).notNull(),
  overallProgress: decimal("overall_progress").default("0").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Schema generation
export const insertTempUserSchema = createInsertSchema(tempUsers);
export const selectTempUserSchema = createSelectSchema(tempUsers);
export const insertQuizSessionSchema = createInsertSchema(quizSessions);
export const selectQuizSessionSchema = createSelectSchema(quizSessions);
export const insertQuizResultSchema = createInsertSchema(quizResults);
export const selectQuizResultSchema = createSelectSchema(quizResults);
export const insertProfileCompletionSchema = createInsertSchema(profileCompletion);
export const selectProfileCompletionSchema = createSelectSchema(profileCompletion);

// Types
export type TempUser = typeof tempUsers.$inferSelect;
export type NewTempUser = typeof tempUsers.$inferInsert;
export type QuizSession = typeof quizSessions.$inferSelect;
export type NewQuizSession = typeof quizSessions.$inferInsert;
export type QuizResult = typeof quizResults.$inferSelect;
export type NewQuizResult = typeof quizResults.$inferInsert;
export type ProfileCompletion = typeof profileCompletion.$inferSelect;
export type NewProfileCompletion = typeof profileCompletion.$inferInsert;
