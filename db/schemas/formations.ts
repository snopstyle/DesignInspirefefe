import { relations } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  decimal, 
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Établissements
export const establishments = pgTable("formation_establishments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  statut: text("statut").notNull(),
  hebergement: boolean("hebergement").default(false),
  lien: text("lien"), // Nullable and unique when not null
  tel: text("tel"), // Nullable and unique when not null
  facebook: text("facebook"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Localisations
export const locations = pgTable("formation_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  ville: text("ville").notNull(),
  region: text("region").notNull(),
  departement: text("departement").notNull(),
  adresse: text("adresse").notNull(), // Unique when not null
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Coûts
export const costs = pgTable("formation_costs", {
  id: uuid("id").defaultRandom().primaryKey(),
  montant: decimal("montant").notNull(),
  devise: text("devise").default("EUR"),
  gratuitApprentissage: boolean("gratuit_apprentissage").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Types de pédagogie
export const pedagogyTypes = pgTable("formation_pedagogy_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  tempsPlein: boolean("temps_plein").default(false),
  presentiel: boolean("presentiel").default(false),
  alternance: boolean("alternance").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Formations (table principale)
export const formations = pgTable("formation_formations", {
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

// Types
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

// Schema generation
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