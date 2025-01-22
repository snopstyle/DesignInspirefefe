import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, jsonb, varchar, decimal, boolean, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const tempUsers = pgTable("temp_users", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

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



// Regular user table 
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Quiz session table
export const quizSessions = pgTable("quiz_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tempUserId: uuid("temp_user_id").references(() => tempUsers.id),
  status: varchar("status", { length: 20 }).notNull().default('in_progress'),
  currentQuestionId: varchar("current_question_id", { length: 10 }),
  completedQuestions: jsonb("completed_questions").$type<string[]>().default([]).notNull(),
  answers: jsonb("answers").$type<Record<string, string>>().default({}).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

// Quiz results table for storing completed quiz results
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
  dominantProfile: varchar("dominant_profile", { length: 100 }).notNull(),
  subProfile: varchar("sub_profile", { length: 100 }).notNull(),
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

// Define relations
export const userRelations = relations(users, ({ many, one }) => ({
  quizSessions: many(quizSessions),
  quizResults: many(quizResults),
  profileCompletion: one(profileCompletion, {
    fields: [users.id],
    references: [profileCompletion.userId],
  })
}));

export const tempUserRelations = relations(tempUsers, ({ many }) => ({
  quizSessions: many(quizSessions)
}));

export const quizSessionsRelations = relations(quizSessions, ({ one }) => ({
  user: one(users, {
    fields: [quizSessions.userId],
    references: [users.id],
  }),
  tempUser: one(tempUsers, {
    fields: [quizSessions.tempUserId],
    references: [tempUsers.id],
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

// Schema generation for all tables
export const insertProfileTraitsSchema = createInsertSchema(profileTraits);
export const selectProfileTraitsSchema = createSelectSchema(profileTraits);
export type ProfileTrait = typeof profileTraits.$inferSelect;
export type NewProfileTrait = typeof profileTraits.$inferInsert;

export const insertSubProfilesSchema = createInsertSchema(subProfiles);
export const selectSubProfilesSchema = createSelectSchema(subProfiles);
export type SubProfile = typeof subProfiles.$inferSelect;
export type NewSubProfile = typeof subProfiles.$inferInsert;

export const insertQuestionWeightsSchema = createInsertSchema(questionWeights);
export const selectQuestionWeightsSchema = createSelectSchema(questionWeights);
export type QuestionWeight = typeof questionWeights.$inferSelect;
export type NewQuestionWeight = typeof questionWeights.$inferInsert;

export const insertTempUserSchema = createInsertSchema(tempUsers);
export const selectTempUserSchema = createSelectSchema(tempUsers);
export type TempUser = typeof tempUsers.$inferSelect;
export type NewTempUser = typeof tempUsers.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertQuizSessionsSchema = createInsertSchema(quizSessions);
export const selectQuizSessionsSchema = createSelectSchema(quizSessions);
export type QuizSession = typeof quizSessions.$inferSelect;
export type NewQuizSession = typeof quizSessions.$inferInsert;

export const insertQuizResultsSchema = createInsertSchema(quizResults);
export const selectQuizResultsSchema = createSelectSchema(quizResults);
export type QuizResult = typeof quizResults.$inferSelect;
export type NewQuizResult = typeof quizResults.$inferInsert;

export const insertProfileCompletionSchema = createInsertSchema(profileCompletion);
export const selectProfileCompletionSchema = createSelectSchema(profileCompletion);
export type ProfileCompletion = typeof profileCompletion.$inferSelect;
export type NewProfileCompletion = typeof profileCompletion.$inferInsert;

export const formations = pgTable("formations", {
  id: uuid("id").defaultRandom().primaryKey(),
  formation: text("formation").notNull(),
  etablissementId: uuid("etablissement_id").notNull().references(() => establishments.id),
  locationId: uuid("location_id").notNull().references(() => locations.id),
  niveau: text("niveau").notNull(),
  type: text("type").notNull(),
  domaines: text("domaines").array().notNull(),
  costId: uuid("cost_id").notNull().references(() => costs.id),
  duree: text("duree").notNull(),
  pedagogyId: uuid("pedagogy_id").notNull().references(() => pedagogyTypes.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const establishments = pgTable("establishments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  statut: text("statut").notNull(),
  hebergement: boolean("hebergement").notNull(),
  lien: text("lien").notNull(),
  tel: text("tel").notNull(),
  facebook: text("facebook"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  ville: text("ville").notNull(),
  region: text("region").notNull(),
  departement: text("departement").notNull(),
  adresse: text("adresse").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const costs = pgTable("costs", {
  id: uuid("id").defaultRandom().primaryKey(),
  montant: decimal("montant").notNull(),
  devise: text("devise").notNull(),
  gratuitApprentissage: boolean("gratuit_apprentissage").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const pedagogyTypes = pgTable("pedagogy_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  tempsPlein: boolean("temps_plein").notNull(),
  presentiel: boolean("presentiel").notNull(),
  alternance: boolean("alternance").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertFormationsSchema = createInsertSchema(formations);
export const selectFormationsSchema = createSelectSchema(formations);
export type Formation = typeof formations.$inferSelect;
export type NewFormation = typeof formations.$inferInsert;

export const insertEstablishmentsSchema = createInsertSchema(establishments);
export const selectEstablishmentsSchema = createSelectSchema(establishments);
export type Establishment = typeof establishments.$inferSelect;
export type NewEstablishment = typeof establishments.$inferInsert;

export const insertLocationsSchema = createInsertSchema(locations);
export const selectLocationsSchema = createSelectSchema(locations);
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export const insertCostsSchema = createInsertSchema(costs);
export const selectCostsSchema = createSelectSchema(costs);
export type Cost = typeof costs.$inferSelect;
export type NewCost = typeof costs.$inferInsert;

export const insertPedagogyTypesSchema = createInsertSchema(pedagogyTypes);
export const selectPedagogyTypesSchema = createSelectSchema(pedagogyTypes);
export type PedagogyType = typeof pedagogyTypes.$inferSelect;
export type NewPedagogyType = typeof pedagogyTypes.$inferInsert;