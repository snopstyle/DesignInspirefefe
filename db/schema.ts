import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  psychoSocialProfile: json("psycho_social_profile").notNull(),
  dominantProfile: text("dominant_profile").notNull(),
  subProfile: text("sub_profile").notNull(),
  traits: json("traits").notNull(),
  passionsAndInterests: json("passions_and_interests"),
  educationProject: json("education_project"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  quizResults: many(quizResults),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;