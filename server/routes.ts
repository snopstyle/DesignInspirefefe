import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { quizResults, quizSessions, profileCompletion } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { calculateProfileScores, getMatchedProfile } from "../attached_assets/logic";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Start or resume a quiz session
  app.post("/api/quiz/session", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // Check for existing incomplete session
      const [existingSession] = await db.select()
        .from(quizSessions)
        .where(eq(quizSessions.userId, req.user!.id))
        .where(eq(quizSessions.status, 'in_progress'))
        .limit(1);

      if (existingSession) {
        return res.json(existingSession);
      }

      // Create new session
      const [newSession] = await db.insert(quizSessions)
        .values({
          userId: req.user!.id,
          status: 'in_progress',
          currentQuestionId: 'Q1', // Start with first question
          completedQuestions: [],
          answers: {},
          adaptivePath: {
            currentPath: ['Q1'],
            branchingPoints: {}
          }
        })
        .returning();

      res.json(newSession);
    } catch (error) {
      console.error('Error managing quiz session:', error);
      res.status(500).send("Failed to manage quiz session");
    }
  });

  // Update quiz session with new answer
  app.patch("/api/quiz/session/:sessionId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const { sessionId } = req.params;
    const { questionId, answer, nextQuestionId } = req.body;

    try {
      const [session] = await db.select()
        .from(quizSessions)
        .where(eq(quizSessions.id, sessionId))
        .where(eq(quizSessions.userId, req.user!.id))
        .limit(1);

      if (!session) {
        return res.status(404).send("Session not found");
      }

      if (session.status !== 'in_progress') {
        return res.status(400).send("Session is already completed");
      }

      // Update session with new answer and adaptive path
      const updatedAnswers = { ...session.answers, [questionId]: answer };
      const updatedPath = session.adaptivePath;
      updatedPath.currentPath.push(nextQuestionId);
      updatedPath.branchingPoints[questionId] = {
        question: questionId,
        answer,
        nextQuestion: nextQuestionId
      };

      const [updatedSession] = await db.update(quizSessions)
        .set({
          answers: updatedAnswers,
          completedQuestions: [...session.completedQuestions, questionId],
          currentQuestionId: nextQuestionId,
          adaptivePath: updatedPath,
          lastUpdated: new Date()
        })
        .where(eq(quizSessions.id, sessionId))
        .returning();

      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating quiz session:', error);
      res.status(500).send("Failed to update quiz session");
    }
  });

  // Complete quiz and save results
  app.post("/api/quiz/submit", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const { sessionId } = req.body;

    try {
      // Get session data
      const [session] = await db.select()
        .from(quizSessions)
        .where(eq(quizSessions.id, sessionId))
        .where(eq(quizSessions.userId, req.user!.id))
        .limit(1);

      if (!session) {
        return res.status(404).send("Session not found");
      }

      // Calculate results
      const profileScores = calculateProfileScores(session.answers);
      const dominantProfile = getMatchedProfile(profileScores);

      // Save quiz results
      const [result] = await db.insert(quizResults)
        .values({
          userId: req.user!.id,
          sessionId: session.id,
          answers: session.answers,
          adaptiveFlow: {
            path: session.adaptivePath.currentPath,
            branchingDecisions: session.adaptivePath.branchingPoints
          },
          traitScores: profileScores,
          dominantProfile,
          subProfile: dominantProfile, // Can be refined based on sub-profile logic
          traits: Object.entries(profileScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([trait]) => trait),
          profileMatchScores: profileScores
        })
        .returning();

      // Update session status
      await db.update(quizSessions)
        .set({
          status: 'completed',
          completedAt: new Date()
        })
        .where(eq(quizSessions.id, sessionId));

      // Update profile completion status
      await db.update(profileCompletion)
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

  // Get quiz results history
  app.get("/api/quiz/results", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const results = await db.select()
        .from(quizResults)
        .where(eq(quizResults.userId, req.user!.id))
        .orderBy(desc(quizResults.createdAt));

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

  // Get current quiz session
  app.get("/api/quiz/session/current", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [session] = await db.select()
        .from(quizSessions)
        .where(eq(quizSessions.userId, req.user!.id))
        .where(eq(quizSessions.status, 'in_progress'))
        .orderBy(desc(quizSessions.startedAt))
        .limit(1);

      res.json(session || null);
    } catch (error) {
      console.error('Error fetching current session:', error);
      res.status(500).send("Failed to fetch current session");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}