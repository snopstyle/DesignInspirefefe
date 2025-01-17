import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, json, varchar, decimal, boolean, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema with serial id
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = z.object({
  username: z.string().min(3).max(64),
  email: z.string().email().max(255),
  password: z.string().min(6),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Profile traits table to store the key_traits
export const profileTraits = pgTable("profile_traits", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  baseScore: decimal("base_score").default("0").notNull(),
  category: varchar("category", { length: 50 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Sub-profiles table to store the profile types
export const subProfiles = pgTable("sub_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  traits: json("traits").$type<string[]>().notNull(),
  weights: json("weights").$type<Record<string, number>>().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Question weights table
export const questionWeights = pgTable("question_weights", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: varchar("question_id", { length: 10 }).notNull(),
  weights: json("weights").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Quiz session progress and answers
export const quizSessions = pgTable("quiz_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentQuestionId: varchar("current_question_id", { length: 10 }),
  completedQuestions: json("completed_questions").$type<string[]>().notNull(),
  answers: json("answers").$type<Record<string, string>>().notNull(),
  adaptivePath: json("adaptive_path").$type<string[]>().notNull(),
  status: text("status", { enum: ["in_progress", "completed", "abandoned"] }).notNull(), // Enum for status
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});

// Quiz results table aligned with Profile interface and scoring system
export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: uuid("session_id").references(() => quizSessions.id),
  answers: json("answers").$type<Record<string, string>>().notNull(),
  adaptiveFlow: json("adaptive_flow").$type<{
    path: string[];
    branchingDecisions: Record<string, string>;
  }>().notNull(),
  traitScores: json("trait_scores").$type<Record<string, number>>().notNull(),
  dominantProfile: varchar("dominant_profile", { length: 100 }).notNull(),
  subProfile: varchar("sub_profile", { length: 100 }).notNull(),
  traits: json("traits").$type<string[]>().notNull(),
  profileMatchScores: json("profile_match_scores").$type<Record<string, number>>().notNull(),
  passionsAndInterests: json("passions_and_interests").$type<{
    hobbies: string[];
    academicInterests: string[];
    unwantedIndustries: string[];
    workEnvironment: string;
    motivations: string[];
    learningStyle: string;
    careerGoal: string;
  }>().notNull(),
  educationProject: json("education_project").$type<{
    budget: string;
    duration: string;
    locations: string[];
    mobility: string;
    criteria: string[];
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Profile completion tracking table
export const profileCompletion = pgTable("profile_completion", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  basicInfoCompleted: boolean("basic_info_completed").default(false).notNull(),
  traitsAssessmentCompleted: boolean("traits_assessment_completed").default(false).notNull(),
  personalityQuizCompleted: boolean("personality_quiz_completed").default(false).notNull(),
  interestsCompleted: boolean("interests_completed").default(false).notNull(),
  educationPrefsCompleted: boolean("education_prefs_completed").default(false).notNull(),
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

export const quizSessionsRelations = relations(quizSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [quizSessions.userId],
    references: [users.id],
  }),
  results: many(quizResults, {
    fields: [quizSessions.id],
    references: [quizResults.sessionId],
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