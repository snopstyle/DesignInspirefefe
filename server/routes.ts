import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { tempUsers, quizSessions, quizResults } from "@db/schema";
import { eq } from "drizzle-orm";

declare module 'express-session' {
  interface SessionData {
    tempUserId: string | undefined;
  }
}

export function registerRoutes(app: Express): Server {
  // Verify session endpoint
  app.get('/api/users/verify', (req, res) => {
    try {
      if (!req.session) {
        throw new Error('Session not initialized');
      }

      const isValid = !!req.session.tempUserId;
      res.json({ valid: isValid, id: req.session.tempUserId });

    } catch (error) {
      console.error('Session verification error:', error);
      res.status(500).json({ error: true, message: 'Session verification failed' });
    }
  });

  // Create temporary user
  app.post('/api/users/temp', async (req, res) => {
    try {
      if (!req.session) {
        throw new Error('Session not initialized');
      }

      // Check for existing session
      if (req.session.tempUserId) {
        const existingUser = await db.select().from(tempUsers)
          .where(eq(tempUsers.id, req.session.tempUserId))
          .limit(1);

        if (existingUser.length > 0) {
          console.log('Using existing temp user:', existingUser[0].id);
          return res.json({ id: existingUser[0].id });
        }
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

      // Store in session
      req.session.tempUserId = tempUser.id;

      // Save session explicitly
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      console.log('Created temp user:', {
        id: tempUser.id,
        session: req.sessionID
      });

      res.json({ id: tempUser.id });

    } catch (error) {
      console.error('Error in temp user creation:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Failed to create temporary user' 
      });
    }
  });

  // Quiz session endpoints
  app.post("/api/quiz/session", async (req, res) => {
    try {
      if (!req.session?.tempUserId) {
        return res.status(401).json({ error: "No temporary user found" });
      }

      const [session] = await db.insert(quizSessions)
        .values({
          tempUserId: req.session.tempUserId,
          status: 'in_progress',
          completedQuestions: [],
          answers: {},
          startedAt: new Date(),
          lastUpdated: new Date()
        })
        .returning();

      res.json(session);
    } catch (error) {
      console.error('Error creating quiz session:', error);
      res.status(500).json({ error: "Failed to create quiz session" });
    }
  });

  app.patch("/api/quiz/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { questionId, answer, nextQuestionId } = req.body;

      if (!req.session?.tempUserId) {
        return res.status(401).json({ error: "No temporary user found" });
      }

      const [session] = await db
        .select()
        .from(quizSessions)
        .where(eq(quizSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (session.tempUserId !== req.session.tempUserId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updatedAnswers = { ...session.answers, [questionId]: answer };
      const updatedCompletedQuestions = [...(session.completedQuestions || []), questionId];

      const [updatedSession] = await db
        .update(quizSessions)
        .set({
          currentQuestionId: nextQuestionId || null,
          completedQuestions: updatedCompletedQuestions,
          answers: updatedAnswers,
          lastUpdated: new Date(),
          status: nextQuestionId ? 'in_progress' : 'completed',
          completedAt: nextQuestionId ? null : new Date()
        })
        .where(eq(quizSessions.id, sessionId))
        .returning();

      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating quiz session:', error);
      res.status(500).json({ error: "Failed to update quiz session" });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Generate contextual responses in French
      let response;
      if (message.toLowerCase().includes('formation') || message.toLowerCase().includes('étude')) {
        response = {
          message: "Je peux vous aider à trouver la formation qui vous correspond. Quels sont vos centres d'intérêt ?"
        };
      } else if (message.toLowerCase().includes('métier') || message.toLowerCase().includes('carrière')) {
        response = {
          message: "Il existe de nombreuses opportunités professionnelles. Parlons de vos compétences et de vos aspirations."
        };
      } else if (message.toLowerCase().includes('profil') || message.toLowerCase().includes('personnalité')) {
        response = {
          message: "Votre profil est unique. Je peux vous aider à mieux comprendre vos points forts et vos domaines de développement."
        };
      } else {
        response = {
          message: "Je suis là pour vous guider dans votre orientation. Posez-moi des questions sur les formations, les métiers ou votre profil."
        };
      }

      res.json(response);
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!req.session?.tempUserId) {
        return res.status(401).json({ error: "No temporary user found" });
      }

      const [session] = await db
        .select()
        .from(quizSessions)
        .where(eq(quizSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (session.tempUserId !== req.session.tempUserId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Mark session as completed
      await db
        .update(quizSessions)
        .set({
          status: 'completed',
          completedAt: new Date(),
          lastUpdated: new Date()
        })
        .where(eq(quizSessions.id, sessionId));

      // Create quiz results
      const [result] = await db
        .insert(quizResults)
        .values({
          tempUserId: req.session.tempUserId,
          sessionId: sessionId,
          answers: session.answers,
          adaptiveFlow: {
            path: session.completedQuestions,
            branchingDecisions: {}
          },
          traitScores: {},
          dominantProfile: "pending",
          subProfile: "pending",
          traits: [],
          profileMatchScores: {}
        })
        .returning();

      res.json(result);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  return createServer(app);
}