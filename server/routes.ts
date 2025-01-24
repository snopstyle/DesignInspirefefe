import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { sql, eq, and, desc } from "drizzle-orm";
import { users, tempUsers, quizSessions } from "@db/schema";

declare module 'express-session' {
  interface SessionData {
    tempUserId?: string;
  }
}

export function registerRoutes(app: Express): Server {
  // Create temporary user session
  app.post("/api/users/temp", async (req: Request, res: Response) => {
    try {
      if (!req.session) {
        throw new Error('Session not initialized');
      }

      // Check if user already exists in session
      if (req.session.tempUserId) {
        const existingUser = await db.query.tempUsers.findFirst({
          where: eq(tempUsers.id, req.session.tempUserId)
        });

        if (existingUser) {
          return res.json({ success: true, id: existingUser.id });
        }
        // If user not found in DB, clear the session
        delete req.session.tempUserId;
      }

      // Create new temp user
      const [tempUser] = await db.insert(tempUsers)
        .values({
          createdAt: new Date()
        })
        .returning();

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user');
      }

      // Set session data
      req.session.tempUserId = tempUser.id;
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
      req.session.cookie.secure = process.env.NODE_ENV === 'production';
      req.session.cookie.httpOnly = true;
      req.session.cookie.sameSite = 'lax';

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      res.status(201).json({
        success: true,
        id: tempUser.id
      });
    } catch (error) {
      console.error('Error creating temporary user:', error);
      res.status(500).json({
        error: "Failed to create temporary user",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get current quiz session
  app.get("/api/quiz/session/current", async (req: Request, res: Response) => {
    if (!req.session.tempUserId) {
      return res.status(400).json({ error: "No valid user ID found" });
    }

    try {
      const session = await db.query.quizSessions.findFirst({
        where: and(
          eq(quizSessions.tempUserId, req.session.tempUserId),
          eq(quizSessions.status, 'in_progress')
        ),
        orderBy: [desc(quizSessions.startedAt)]
      });

      res.json(session || null);
    } catch (error) {
      console.error('Error fetching current session:', error);
      res.status(500).json({ error: "Failed to fetch current session" });
    }
  });

  // Start a new quiz session
  app.post("/api/quiz/session", async (req: Request, res: Response) => {
    if (!req.session.tempUserId) {
      return res.status(400).json({ error: "No valid user ID found" });
    }

    try {
      const [newSession] = await db.insert(quizSessions)
        .values({
          tempUserId: req.session.tempUserId,
          status: 'in_progress',
          currentQuestionId: 'Q1',
          completedQuestions: [],
          answers: {},
          startedAt: new Date(),
          lastUpdated: new Date()
        })
        .returning();

      res.json(newSession);
    } catch (error) {
      console.error('Error creating quiz session:', error);
      res.status(500).json({ error: "Failed to create quiz session" });
    }
  });

  // Update quiz session with answer
  app.patch("/api/quiz/session/:sessionId", async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { questionId, answer, nextQuestionId } = req.body;

    if (!req.session.tempUserId) {
      return res.status(400).json({ error: "No valid user ID found" });
    }

    try {
      const session = await db.query.quizSessions.findFirst({
        where: and(
          eq(quizSessions.id, sessionId),
          eq(quizSessions.tempUserId, req.session.tempUserId),
          eq(quizSessions.status, 'in_progress')
        )
      });

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const [updatedSession] = await db.update(quizSessions)
        .set({
          answers: { ...session.answers, [questionId]: answer },
          completedQuestions: [...session.completedQuestions, questionId],
          currentQuestionId: nextQuestionId,
          lastUpdated: new Date()
        })
        .where(eq(quizSessions.id, sessionId))
        .returning();

      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating quiz session:', error);
      res.status(500).json({ error: "Failed to update quiz session" });
    }
  });

  // Submit quiz
  app.post("/api/quiz/submit", async (req: Request, res: Response) => {
    if (!req.session.tempUserId) {
      return res.status(400).send("No valid user ID found");
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).send("Session ID is required");
    }

    try {
      const session = await db.query.quizSessions.findFirst({
        where: and(
          eq(quizSessions.id, sessionId),
          eq(quizSessions.tempUserId, req.session.tempUserId)
        )
      });

      if (!session) {
        return res.status(404).send("Session not found");
      }

      if (session.status !== 'in_progress') {
        return res.status(400).send("Session is already completed");
      }

      await db.update(quizSessions)
        .set({
          status: 'completed',
          completedAt: new Date()
        })
        .where(eq(quizSessions.id, sessionId));

      res.json({ success: true });
    } catch (error) {
      console.error('Quiz submission error:', error);
      res.status(500).send("Failed to submit quiz");
    }
  });

  // Verify session endpoint
  app.get('/api/users/verify', (req: Request, res: Response) => {
    if (req.session?.tempUserId) {
      res.status(200).json({ valid: true });
    } else {
      res.status(401).json({ valid: false });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}