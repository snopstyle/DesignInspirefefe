import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as formationSchema from "./schemas/formations";
import * as authSchema from "./schemas/auth";
import * as quizSchema from "./schemas/quiz";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set for formations database");
}

if (!process.env.AUTH_DATABASE_URL) {
  throw new Error("AUTH_DATABASE_URL must be set for auth database");
}

if (!process.env.QUIZ_DATABASE_URL) {
  throw new Error("QUIZ_DATABASE_URL must be set for quiz database");
}

// Formation database connection
export const formationDb = drizzle({
  connection: process.env.DATABASE_URL,
  schema: formationSchema,
  ws: ws,
});

// Auth database connection
export const authDb = drizzle({
  connection: process.env.AUTH_DATABASE_URL,
  schema: authSchema,
  ws: ws,
});

// Quiz database connection
export const quizDb = drizzle({
  connection: process.env.QUIZ_DATABASE_URL,
  schema: quizSchema,
  ws: ws,
});