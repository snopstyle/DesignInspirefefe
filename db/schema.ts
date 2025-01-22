import { relations } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  decimal, 
  boolean,
  serial,
  integer,
  jsonb,
  varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Regular user table 
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Temporary users for quiz sessions
export const tempUsers = pgTable("temp_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Quiz session table
export const quizSessions = pgTable("quiz_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id),
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
  userId: integer("user_id").references(() => users.id),
  tempUserId: uuid("temp_user_id").references(() => tempUsers.id),
  sessionId: uuid("session_id").references(() => quizSessions.id),
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

// Relations
export const userRelations = relations(users, ({ many }) => ({
  quizSessions: many(quizSessions),
  quizResults: many(quizResults)
}));

export const tempUserRelations = relations(tempUsers, ({ many }) => ({
  quizSessions: many(quizSessions),
  quizResults: many(quizResults)
}));

export const quizSessionRelations = relations(quizSessions, ({ one }) => ({
  user: one(users, {
    fields: [quizSessions.userId],
    references: [users.id],
  }),
  tempUser: one(tempUsers, {
    fields: [quizSessions.tempUserId],
    references: [tempUsers.id],
  })
}));

export const quizResultRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
  tempUser: one(tempUsers, {
    fields: [quizResults.tempUserId],
    references: [tempUsers.id],
  }),
  session: one(quizSessions, {
    fields: [quizResults.sessionId],
    references: [quizSessions.id],
  })
}));

// Schema generation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertTempUserSchema = createInsertSchema(tempUsers);
export const selectTempUserSchema = createSelectSchema(tempUsers);

export const insertQuizSessionSchema = createInsertSchema(quizSessions);
export const selectQuizSessionSchema = createSelectSchema(quizSessions);

export const insertQuizResultSchema = createInsertSchema(quizResults);
export const selectQuizResultSchema = createSelectSchema(quizResults);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TempUser = typeof tempUsers.$inferSelect;
export type NewTempUser = typeof tempUsers.$inferInsert;

export type QuizSession = typeof quizSessions.$inferSelect;
export type NewQuizSession = typeof quizSessions.$inferInsert;

export type QuizResult = typeof quizResults.$inferSelect;
export type NewQuizResult = typeof quizResults.$inferInsert;