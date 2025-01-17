import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { quizResults, quizSessions, profileCompletion } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/quiz/submit", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // First create or update quiz session
      const [session] = await db.insert(quizSessions)
        .values({
          userId: req.user!.id,
          currentQuestionId: req.body.currentQuestionId,
          completedQuestions: req.body.completedQuestions || [],
          answers: req.body.answers || {},
          adaptivePath: req.body.adaptivePath || [],
          status: 'completed'
        })
        .returning();

      // Then save quiz results
      const [result] = await db.insert(quizResults)
        .values({
          userId: req.user!.id,
          sessionId: session.id,
          answers: req.body.answers,
          dominantProfile: req.body.dominantProfile,
          subProfile: req.body.subProfile,
          traits: req.body.traits,
          traitScores: req.body.traitScores || {},
          profileMatchScores: req.body.profileMatchScores || {},
          passionsAndInterests: req.body.passionsAndInterests || {},
          educationProject: req.body.educationProject || {},
          adaptiveFlow: req.body.adaptiveFlow || { path: [], branchingDecisions: {} }
        })
        .returning();

      // Update profile completion status
      await db
        .update(profileCompletion)
        .set({
          personalityQuizCompleted: true,
          lastUpdated: new Date(),
          overallProgress: db.raw(`
            CASE 
              WHEN basic_info_completed AND traits_assessment_completed AND interests_completed AND education_prefs_completed 
              THEN 100 
              ELSE (
                (CASE WHEN basic_info_completed THEN 20 ELSE 0 END) +
                (CASE WHEN traits_assessment_completed THEN 20 ELSE 0 END) +
                (CASE WHEN personality_quiz_completed THEN 20 ELSE 0 END) +
                (CASE WHEN interests_completed THEN 20 ELSE 0 END) +
                (CASE WHEN education_prefs_completed THEN 20 ELSE 0 END)
              )
            END
          `)
        })
        .where(eq(profileCompletion.userId, req.user!.id));

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
        .where(eq(quizResults.userId, req.user!.id))
        .orderBy(quizResults.createdAt);

      res.json(results);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).send("Failed to fetch quiz results");
    }
  });

  // Get profile completion status
  app.get("/api/profile/completion", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [status] = await db.select()
        .from(profileCompletion)
        .where(eq(profileCompletion.userId, req.user!.id))
        .limit(1);

      if (!status) {
        // Create initial profile completion status if it doesn't exist
        const [newStatus] = await db.insert(profileCompletion)
          .values({
            userId: req.user!.id,
            basicInfoCompleted: false,
            traitsAssessmentCompleted: false,
            personalityQuizCompleted: false,
            interestsCompleted: false,
            educationPrefsCompleted: false,
            overallProgress: 0
          })
          .returning();

        return res.json(newStatus);
      }

      res.json(status);
    } catch (error) {
      console.error('Error fetching profile completion:', error);
      res.status(500).send("Failed to fetch profile completion status");
    }
  });

  // Update specific completion fields
  app.patch("/api/profile/completion", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const validFields = [
        'basicInfoCompleted',
        'traitsAssessmentCompleted',
        'personalityQuizCompleted',
        'interestsCompleted',
        'educationPrefsCompleted'
      ];

      const updates = Object.entries(req.body)
        .filter(([key]) => validFields.includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      if (Object.keys(updates).length === 0) {
        return res.status(400).send("No valid fields to update");
      }

      const [updated] = await db
        .update(profileCompletion)
        .set({
          ...updates,
          lastUpdated: new Date(),
          overallProgress: db.raw(`
            CASE 
              WHEN basic_info_completed AND traits_assessment_completed AND personality_quiz_completed AND interests_completed AND education_prefs_completed 
              THEN 100 
              ELSE (
                (CASE WHEN basic_info_completed THEN 20 ELSE 0 END) +
                (CASE WHEN traits_assessment_completed THEN 20 ELSE 0 END) +
                (CASE WHEN personality_quiz_completed THEN 20 ELSE 0 END) +
                (CASE WHEN interests_completed THEN 20 ELSE 0 END) +
                (CASE WHEN education_prefs_completed THEN 20 ELSE 0 END)
              )
            END
          `)
        })
        .where(eq(profileCompletion.userId, req.user!.id))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error('Error updating profile completion:', error);
      res.status(500).send("Failed to update profile completion status");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}