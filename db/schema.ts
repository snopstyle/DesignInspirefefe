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
  jsonb
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Établissements
export const establishments = pgTable("establishments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  statut: text("statut").notNull(),
  hebergement: boolean("hebergement").default(false),
  lien: text("lien"),
  tel: text("tel"), // Changé de varchar à text
  facebook: text("facebook"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Localisations
export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  ville: text("ville").notNull(),
  region: text("region").notNull(),
  departement: text("departement").notNull(),
  adresse: text("adresse").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Coûts
export const costs = pgTable("costs", {
  id: uuid("id").defaultRandom().primaryKey(),
  montant: decimal("montant").notNull(), // Supprimé la précision pour utiliser le type numeric par défaut
  devise: text("devise").default("EUR"), // Changé de varchar à text
  gratuitApprentissage: boolean("gratuit_apprentissage").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Types de pédagogie
export const pedagogyTypes = pgTable("pedagogy_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  tempsPlein: boolean("temps_plein").default(false),
  presentiel: boolean("presentiel").default(false),
  alternance: boolean("alternance").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Formations (table principale)
export const formations = pgTable("formations", {
  id: uuid("id").defaultRandom().primaryKey(),
  formation: text("formation").notNull(),
  etablissementId: uuid("etablissement_id").references(() => establishments.id),
  locationId: uuid("location_id").references(() => locations.id),
  niveau: text("niveau").notNull(),
  type: text("type").notNull(),
  domaines: text("domaines").array().notNull(),
  costId: uuid("cost_id").references(() => costs.id),
  duree: text("duree").notNull(),
  pedagogyId: uuid("pedagogy_id").references(() => pedagogyTypes.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Relations
export const formationRelations = relations(formations, ({ one }) => ({
  establishment: one(establishments, {
    fields: [formations.etablissementId],
    references: [establishments.id],
  }),
  location: one(locations, {
    fields: [formations.locationId],
    references: [locations.id],
  }),
  cost: one(costs, {
    fields: [formations.costId],
    references: [costs.id],
  }),
  pedagogy: one(pedagogyTypes, {
    fields: [formations.pedagogyId],
    references: [pedagogyTypes.id],
  }),
}));

// Schemas pour la validation
export const insertEstablishmentSchema = createInsertSchema(establishments);
export const selectEstablishmentSchema = createSelectSchema(establishments);

export const insertLocationSchema = createInsertSchema(locations);
export const selectLocationSchema = createSelectSchema(locations);

export const insertCostSchema = createInsertSchema(costs);
export const selectCostSchema = createSelectSchema(costs);

export const insertPedagogySchema = createInsertSchema(pedagogyTypes);
export const selectPedagogySchema = createSelectSchema(pedagogyTypes);

export const insertFormationSchema = createInsertSchema(formations);
export const selectFormationSchema = createSelectSchema(formations);

// Types pour TypeScript
export type Formation = typeof formations.$inferSelect;
export type NewFormation = typeof formations.$inferInsert;

export type Establishment = typeof establishments.$inferSelect;
export type NewEstablishment = typeof establishments.$inferInsert;

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export type Cost = typeof costs.$inferSelect;
export type NewCost = typeof costs.$inferInsert;

export type PedagogyType = typeof pedagogyTypes.$inferSelect;
export type NewPedagogyType = typeof pedagogyTypes.$inferInsert;

export const tempUsers = pgTable("temp_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Profile traits table schema


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