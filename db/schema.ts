import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, json, varchar, decimal, boolean, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema with serial id
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Create Zod schemas for user validation
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3).max(64),
  password: z.string().min(6)
});
export const selectUserSchema = createSelectSchema(users);

// Define types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

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

// Quiz results table aligned with Profile interface
export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  answers: json("answers").$type<Record<string, string | string[]>>().notNull(),
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
  adaptiveFlow: json("adaptive_flow").$type<{
    path: string[];
    branchingDecisions: Record<string, string>;
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
  overallProgress: decimal("overall_progress").default("0").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Define relations
export const userRelations = relations(users, ({ many, one }) => ({
  quizResults: many(quizResults),
  profileCompletion: one(profileCompletion, {
    fields: [users.id],
    references: [profileCompletion.userId],
  })
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  })
}));

export const profileCompletionRelations = relations(profileCompletion, ({ one }) => ({
  user: one(users, {
    fields: [profileCompletion.userId],
    references: [users.id],
  })
}));

// Create Zod schemas for trait validation
export const insertTraitSchema = createInsertSchema(profileTraits);
export const selectTraitSchema = createSelectSchema(profileTraits);

// Create Zod schemas for sub-profile validation
export const insertSubProfileSchema = createInsertSchema(subProfiles);
export const selectSubProfileSchema = createSelectSchema(subProfiles);

// Create Zod schemas for question weights validation
export const insertQuestionWeightSchema = createInsertSchema(questionWeights);
export const selectQuestionWeightSchema = createSelectSchema(questionWeights);

// Create Zod schemas for quiz results validation
export const insertQuizResultSchema = createInsertSchema(quizResults, {
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  traitScores: z.record(z.string(), z.number()),
  traits: z.array(z.string()),
  profileMatchScores: z.record(z.string(), z.number()),
  passionsAndInterests: z.object({
    hobbies: z.array(z.string()),
    academicInterests: z.array(z.string()),
    unwantedIndustries: z.array(z.string()),
    workEnvironment: z.string(),
    motivations: z.array(z.string()),
    learningStyle: z.string(),
    careerGoal: z.string()
  }),
  educationProject: z.object({
    budget: z.string(),
    duration: z.string(),
    locations: z.array(z.string()),
    mobility: z.string(),
    criteria: z.array(z.string())
  }),
  adaptiveFlow: z.object({
    path: z.array(z.string()),
    branchingDecisions: z.record(z.string(), z.string())
  })
});
export const selectQuizResultSchema = createSelectSchema(quizResults);

// Create Zod schema for profile completion
export const insertProfileCompletionSchema = createInsertSchema(profileCompletion);
export const selectProfileCompletionSchema = createSelectSchema(profileCompletion);

// Define types for TypeScript
export type InsertTrait = z.infer<typeof insertTraitSchema>;
export type SelectTrait = z.infer<typeof selectTraitSchema>;
export type InsertSubProfile = z.infer<typeof insertSubProfileSchema>;
export type SelectSubProfile = z.infer<typeof selectSubProfileSchema>;
export type InsertQuestionWeight = z.infer<typeof insertQuestionWeightSchema>;
export type SelectQuestionWeight = z.infer<typeof selectQuestionWeightSchema>;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type SelectQuizResult = z.infer<typeof selectQuizResultSchema>;
export type InsertProfileCompletion = z.infer<typeof insertProfileCompletionSchema>;
export type SelectProfileCompletion = z.infer<typeof selectProfileCompletionSchema>;