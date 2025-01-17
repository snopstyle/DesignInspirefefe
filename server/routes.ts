import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { quizResults } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/quiz/submit", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { answers, dominantProfile, subProfile, traits } = req.body;
      const [result] = await db.insert(quizResults)
        .values({
          userId: req.user.id,
          psychoSocialProfile: answers,
          dominantProfile,
          subProfile, 
          traits,
          passionsAndInterests: {},
          educationProject: {}
        })
        .returning();

      res.json(result);
    } catch (error) {
      console.error('Quiz submission error:', error);
      res.status(500).send("Failed to save quiz results");
    }
  });

  app.get("/api/quiz/results", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const results = await db.select()
        .from(quizResults)
        .where(eq(quizResults.userId, req.user.id))
        .orderBy(quizResults.createdAt);

      res.json(results);
    } catch (error) {
      res.status(500).send("Failed to fetch quiz results");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
