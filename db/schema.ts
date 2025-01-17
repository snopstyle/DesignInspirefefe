import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema with uuid
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
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

// Quiz results table aligned with Profile interface
export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  answers: json("answers").$type<Record<number, string | string[]>>().notNull(),
  dominantProfile: varchar("dominant_profile", { length: 100 }).notNull(),
  subProfile: varchar("sub_profile", { length: 100 }).notNull(),
  traits: json("traits").$type<string[]>().notNull(),
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

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  quizResults: many(quizResults)
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  })
}));

// Create Zod schemas for quiz results validation
export const insertQuizResultSchema = createInsertSchema(quizResults);
export const selectQuizResultSchema = createSelectSchema(quizResults);

// Define types for TypeScript
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type SelectQuizResult = z.infer<typeof selectQuizResultSchema>;