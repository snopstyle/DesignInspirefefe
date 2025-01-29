import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { tempUsers, quizSessions, quizResults } from "@db/schema";
import { eq } from "drizzle-orm";
import { getJson } from "serpapi";

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

      // Using DeepSeek API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": `${process.env.OPENROUTER_REFERER || 'https://chat.openai.com'}`,
          "X-Title": "Career Quiz Analysis"
        },
        body: JSON.stringify({
          model: "anthropic/claude-2",
          messages: [{
            role: "user",
            content: message
          }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('OpenRouter API error:', data);
        throw new Error(`OpenRouter API error: ${data.error || 'Unknown error'}`);
      }

      if (data.choices && data.choices[0]?.message?.content) {
        res.json({ message: data.choices[0].message.content });
      } else if (data.error) {
        throw new Error(`API error: ${data.error}`);
      } else {
        console.error('Unexpected OpenRouter response:', data);
        throw new Error('Invalid API response format');
      }
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

  app.get("/api/serp-search", async (req, res) => {
    try {
      const { q } = req.query;
      const response = await getJson({
        api_key: process.env.SERPAPI_API_KEY,
        engine: "google",
        q: q as string,
        location: "France",
        google_domain: "google.fr",
        gl: "fr",
        hl: "fr",
      });

      res.json(response);
    } catch (error) {
      console.error('SerpAPI error:', error);
      res.status(500).json({ error: "Failed to fetch search results" });
    }
  });

  return createServer(app);
}