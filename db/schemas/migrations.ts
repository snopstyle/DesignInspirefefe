import { pgTable, uuid, integer, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

// Temporary users for quiz sessions (new schema)
export const tempUsersNew = pgTable("temp_users_new", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Quiz sessions (new schema)
export const quizSessionsNew = pgTable("quiz_sessions_new", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id"),
  tempUserId: uuid("temp_user_id"),
  status: text("status").notNull().default('in_progress'),
  currentQuestionId: text("current_question_id"),
  completedQuestions: jsonb("completed_questions").$type<string[]>().default([]).notNull(),
  answers: jsonb("answers").$type<Record<string, string>>().default({}).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

// Quiz results (new schema)
export const quizResultsNew = pgTable("quiz_results_new", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id"),
  tempUserId: uuid("temp_user_id"),
  sessionId: uuid("session_id"),
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
