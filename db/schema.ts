import { pgTable, text, timestamp, uuid, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Core tables only
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Using temp_users table name to match database
export const tempUsers = pgTable("temp_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

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

// Relations
export const userRelations = relations(users, ({ many }) => ({
  quizSessions: many(quizSessions)
}));

export const tempUserRelations = relations(tempUsers, ({ many }) => ({
  quizSessions: many(quizSessions)
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

// Schema generation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertTempUserSchema = createInsertSchema(tempUsers);
export const selectTempUserSchema = createSelectSchema(tempUsers);

export const insertQuizSessionSchema = createInsertSchema(quizSessions);
export const selectQuizSessionSchema = createSelectSchema(quizSessions);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type TempUser = typeof tempUsers.$inferSelect;
export type NewTempUser = typeof tempUsers.$inferInsert;

export type QuizSession = typeof quizSessions.$inferSelect;
export type NewQuizSession = typeof quizSessions.$inferInsert;