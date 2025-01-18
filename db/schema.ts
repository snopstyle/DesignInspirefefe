import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, jsonb, varchar, decimal, boolean, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Profile traits table schema
export const profileTraits = pgTable("profile_traits", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  baseScore: decimal("base_score").default("0").notNull(),
  category: varchar("category", { length: 50 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const subProfiles = pgTable("sub_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  traits: jsonb("traits").$type<string[]>().notNull(),
  weights: jsonb("weights").$type<Record<string, number>>().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const questionWeights = pgTable("question_weights", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: varchar("question_id", { length: 10 }).notNull(),
  weights: jsonb("weights").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Quiz session table for tracking ongoing quizzes
export const quizSessions = pgTable("quiz_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: varchar("status", { length: 20 }).notNull().default('in_progress'),
  currentQuestionId: varchar("current_question_id", { length: 10 }),
  completedQuestions: jsonb("completed_questions").$type<string[]>().default([]).notNull(),
  answers: jsonb("answers").$type<Record<string, string>>().default({}).notNull(),
  adaptivePath: jsonb("adaptive_path").$type<{
    currentPath: string[];
    branchingPoints: Record<string, {
      question: string;
      answer: string;
      nextQuestion: string;
    }>
  }>().default({ currentPath: [], branchingPoints: {} }).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

// Quiz results table for storing completed quiz results
export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
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
  dominantProfile: varchar("dominant_profile", { length: 100 }).notNull(),
  subProfile: varchar("sub_profile", { length: 100 }).notNull(),
  traits: jsonb("traits").$type<string[]>().notNull(),
  profileMatchScores: jsonb("profile_match_scores").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Profile completion tracking
export const profileCompletion = pgTable("profile_completion", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  basicInfoCompleted: boolean("basic_info_completed").default(false).notNull(),
  traitsAssessmentCompleted: boolean("traits_assessment_completed").default(false).notNull(),
  personalityQuizCompleted: boolean("personality_quiz_completed").default(false).notNull(),
  interestsCompleted: boolean("interests_completed").default(false).notNull(),
  educationPrefsCompleted: boolean("education_prefs_completed").default(false).notNull(),
  overallProgress: decimal("overall_progress").default("0").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Define relations
export const userRelations = relations(users, ({ many, one }) => ({
  quizSessions: many(quizSessions),
  quizResults: many(quizResults),
  profileCompletion: one(profileCompletion, {
    fields: [users.id],
    references: [profileCompletion.userId],
  })
}));

export const quizSessionsRelations = relations(quizSessions, ({ one }) => ({
  user: one(users, {
    fields: [quizSessions.userId],
    references: [users.id],
  })
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
  session: one(quizSessions, {
    fields: [quizResults.sessionId],
    references: [quizSessions.id],
  })
}));

export const profileCompletionRelations = relations(profileCompletion, ({ one }) => ({
  user: one(users, {
    fields: [profileCompletion.userId],
    references: [users.id],
  })
}));