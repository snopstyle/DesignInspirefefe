import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: PGHOST || "",
    user: PGUSER || "",
    password: PGPASSWORD || "",
    database: PGDATABASE || "",
  },
  verbose: true,
  strict: true
});