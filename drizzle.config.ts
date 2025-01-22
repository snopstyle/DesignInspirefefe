import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

// Vérification des variables d'environnement requises
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL (formations) must be set");
}

if (!process.env.AUTH_DATABASE_URL) {
  throw new Error("AUTH_DATABASE_URL (users) must be set");
}

if (!process.env.QUIZ_DATABASE_URL) {
  throw new Error("QUIZ_DATABASE_URL (quiz) must be set");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});