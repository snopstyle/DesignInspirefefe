import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

// Vérification des variables d'environnement requises
if (!process.env.PGHOST || !process.env.PGPORT || !process.env.PGDATABASE || !process.env.PGUSER || !process.env.PGPASSWORD) {
  throw new Error("Les variables d'environnement PostgreSQL ne sont pas toutes définies");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
});