import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { sql } from "drizzle-orm";
import {
  establishments,
  locations,
  formations,
  costs,
  pedagogyTypes
} from "@db/schemas/formations";
import { eq, and, or, ilike, asc } from "drizzle-orm";
import { quizSessions, tempUsers } from "@db/schema";
import { desc } from "drizzle-orm";

declare module 'express-session' {
  interface SessionData {
    tempUserId: string | undefined;
  }

  app.post('/api/users/temp', async (req, res) => {
    try {
      // Check existing session
      if (req.session.tempUserId) {
        const existingUser = await db.query.tempUsers.findFirst({
          where: (users, { eq }) => eq(users.id, req.session.tempUserId)
        });

        if (existingUser) {
          console.log('Using existing temp user:', existingUser.id);
          return res.json({ success: true, id: existingUser.id });
        }
      }

      // Create new user only if no valid session exists
      const { username } = req.body;
      const [user] = await db.insert(tempUsers)
        .values({
          username: username || 'Anonymous',
          createdAt: new Date()
        })
        .returning();

      if (!user?.id) {
        throw new Error('Failed to create temp user');
      }

      // Regenerate session before saving new user ID
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) reject(err);
          req.session.tempUserId = user.id;
          req.session.save((err) => {
            if (err) {
              console.error('Session save error:', err);
              reject(err);
            } else {
              console.log('New session created with tempUserId:', user.id);
              resolve();
            }
          });
        });
      });

      res.json({ 
        success: true,
        id: user.id,
        sessionId: req.sessionID
      });
    } catch (error) {
      console.error('Error creating temp user:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });


}

export function registerRoutes(app: Express): Server {
  // Create temporary user session
  app.post("/api/users/temp", async (req, res) => {
    try {
      const { username } = req.body;

      if (!req.session) {
        throw new Error('Session not initialized');
      }

      // Check if user already exists in session
      if (req.session.tempUserId) {
        const existingUser = await db.query.tempUsers.findFirst({
          where: (users, { eq }) => eq(users.id, req.session.tempUserId)
        });

        if (existingUser) {
          console.log('Using existing temp user:', existingUser.id);
          return res.json({ success: true, id: existingUser.id });
        }
        // If user not found in DB, clear the session
        delete req.session.tempUserId;
      }

      // Create new temp user
      const [tempUser] = await db.insert(tempUsers)
        .values({
          username: username || 'Anonymous',
          createdAt: new Date()
        })
        .returning();

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user');
      }

      // Set session data with stronger configuration
      req.session.tempUserId = tempUser.id;
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
      req.session.cookie.secure = process.env.NODE_ENV === 'production';
      req.session.cookie.httpOnly = true;
      req.session.cookie.sameSite = 'lax';
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Failed to save session:', err);
            reject(err);
          } else {
            console.log('Session saved with tempUserId:', tempUser.id);
            resolve();
          }
        });
      });

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user');
      }

      // Set session data and save immediately
      req.session.tempUserId = tempUser.id;

      // Force session save and wait for completion
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            reject(err);
          } else {
            console.log('Session saved successfully:', {
              sessionId: req.sessionID,
              tempUserId: tempUser.id,
              createdAt: req.session.createdAt
            });
            resolve();
          }
        });
      });

      res.status(201).json({
        success: true,
        id: tempUser.id,
        sessionId: req.sessionID
      });
    } catch (error) {
      console.error('Error creating temporary user:', error);
      res.status(500).json({
        error: "Failed to create temporary user",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Start a new quiz session
  app.post("/api/quiz/session", async (req, res) => {
    console.log('Session data:', req.session);
    if (!req.session.tempUserId) {
      console.error('No temp user ID in session');
      return res.status(400).json({ error: "No valid user ID found" });
    }

    try {
      console.log('Creating quiz session for temp user:', req.session.tempUserId);

      // Create new session
      const [newSession] = await db.insert(quizSessions)
        .values({
          tempUserId: req.session.tempUserId,
          status: 'in_progress',
          currentQuestionId: 'Q1',
          completedQuestions: [],
          answers: {}
        })
        .returning();

      console.log('Created new session:', newSession.id);
      res.json(newSession);
    } catch (error) {
      console.error('Error creating quiz session:', error);
      res.status(500).json({ error: "Failed to create quiz session" });
    }
  });

  // Update quiz session with answer
  app.patch("/api/quiz/session/:sessionId", async (req, res) => {
    console.log('Update session - Session data:', req.session);
    console.log('Update session - Request body:', req.body);

    const { sessionId } = req.params;
    const { questionId, answer, nextQuestionId } = req.body;

    if (!req.session.tempUserId) {
      console.error('No temp user ID in session during update');
      return res.status(400).json({ error: "No valid user ID found" });
    }

    try {
      // First, verify the session belongs to this user
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { and, eq }) =>
          and(
            eq(sessions.id, sessionId),
            eq(sessions.tempUserId, req.session.tempUserId),
            eq(sessions.status, 'in_progress')
          )
      });

      if (!session) {
        console.error('Session not found or not accessible:', sessionId);
        return res.status(404).json({ error: "Session not found" });
      }

      console.log('Updating session:', sessionId, 'with answer for question:', questionId);

      // Update the session
      const [updatedSession] = await db.update(quizSessions)
        .set({
          answers: { ...session.answers, [questionId]: answer },
          completedQuestions: [...session.completedQuestions, questionId],
          currentQuestionId: nextQuestionId,
          lastUpdated: new Date()
        })
        .where(eq(quizSessions.id, sessionId))
        .returning();

      console.log('Session updated successfully');
      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating quiz session:', error);
      res.status(500).json({ error: "Failed to update quiz session" });
    }
  });

  // Get current quiz session
  app.get("/api/quiz/session/current", async (req, res) => {
    console.log('Get current session - Session data:', req.session);

    if (!req.session.tempUserId) {
      console.error('No temp user ID in session during get current');
      return res.status(400).json({ error: "No valid user ID found" });
    }

    try {
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { and, eq }) =>
          and(
            eq(sessions.tempUserId, req.session.tempUserId),
            eq(sessions.status, 'in_progress')
          ),
        orderBy: desc(quizSessions.startedAt)
      });

      console.log('Found current session:', session?.id);
      res.json(session || null);
    } catch (error) {
      console.error('Error fetching current session:', error);
      res.status(500).json({ error: "Failed to fetch current session" });
    }
  });

  // Submit quiz
  app.post("/api/quiz/submit", async (req, res) => {
    if (!req.session.tempUserId) {
      return res.status(400).send("No valid user ID found");
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).send("Session ID is required");
    }

    try {
      // Get session data
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { eq, and }) =>
          and(
            eq(sessions.id, sessionId),
            eq(sessions.tempUserId, req.session.tempUserId)
          )
      });

      if (!session) {
        return res.status(404).send("Session not found");
      }

      if (session.status !== 'in_progress') {
        return res.status(400).send("Session is already completed");
      }

      // Update session status
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
  // Get quiz results history
  app.get("/api/quiz/results", async (req, res) => {
    let userId;
    if (req.session.tempUserId) {
      userId = req.session.tempUserId;
    } else {
      return res.status(400).send("No valid user ID found");
    }
    try {
      const results = await db.query.quizResults.findMany({
        where: (results, { eq }) => eq(results.userId, userId),
        orderBy: desc(quizResults.createdAt)
      });

      res.json(results);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).send("Failed to fetch quiz results");
    }
  });

  // Get profile completion status
  app.get("/api/profile/completion", async (req, res) => {
    let userId;
    if (req.session.tempUserId) {
      userId = req.session.tempUserId;
    } else {
      return res.status(400).send("No valid user ID found");
    }

    try {
      const [status] = await db.select()
        .from(profileCompletion)
        .where(eq(profileCompletion.userId, userId))
        .limit(1);

      if (!status) {
        // Create initial profile completion status if it doesn't exist
        const [newStatus] = await db.insert(profileCompletion)
          .values({
            userId: userId,
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
    let userId;
    if (req.session.tempUserId) {
      userId = req.session.tempUserId;
    } else {
      return res.status(400).send("No valid user ID found");
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
        .where(eq(profileCompletion.userId, userId))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error('Error updating profile completion:', error);
      res.status(500).send("Failed to update profile completion status");
    }
  });

  // Formation search endpoint
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q?.toString() || '';
      const ville = req.query.ville?.toString();
      const selectedDomains = req.query.tags?.toString().split(',').filter(Boolean) || [];

      console.log('Search params:', { query, ville, selectedDomains });

      // Build where conditions
      const conditions = [];

      if (query?.trim()) {
        const terms = query.trim().split(/\s+/).filter(Boolean);
        terms.forEach(term => {
          conditions.push(
            or(
              ilike(formations.formation, `%${term}%`),
              ilike(establishments.name, `%${term}%`),
              ilike(locations.ville, `%${term}%`),
              ilike(locations.region, `%${term}%`),
              sql`${formations.domaines}::text[] && ARRAY[${term}]::text[]`
            )
          );
        });
      }

      if (ville?.trim()) {
        conditions.push(eq(locations.ville, ville.trim()));
      }

      // Handle domain filtering at the SQL level
      if (selectedDomains.length > 0) {
        conditions.push(
          sql`array[${sql.join(selectedDomains)}]::text[] && ${formations.domaines}`
        );
      }

      // Execute the query
      const results = await db
        .select({
          id: formations.id,
          formation: formations.formation,
          etablissement: establishments.name,
          ville: locations.ville,
          region: locations.region,
          niveau: formations.niveau,
          type: formations.type,
          domaines: formations.domaines,
          duree: formations.duree,
          lien: establishments.lien,
          facebook: establishments.facebook,
          instagram: establishments.instagram,
          linkedin: establishments.linkedin
        })
        .from(formations)
        .leftJoin(establishments, eq(formations.etablissementId, establishments.id))
        .leftJoin(locations, eq(formations.locationId, locations.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(50);

      // Log query results
      console.log(`Found ${results.length} results`);

      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Erreur lors de la recherche de formations' });
    }
  });

  // Get unique formation domains
  app.get('/api/domains', async (req, res) => {
    try {
      const results = await db.query.formations.findMany({
        columns: { domaines: true }
      });

      // Extract unique domains from the results
      const uniqueDomains = new Set<string>();
      results.forEach(result => {
        result.domaines.forEach(domain => uniqueDomains.add(domain));
      });

      const domainsList = Array.from(uniqueDomains).sort();
      res.json(domainsList);
    } catch (error) {
      console.error('Error fetching domains:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des domaines' });
    }
  });

  // Get unique cities
  app.get('/api/cities', async (req, res) => {
    try {
      const results = await db
        .select({ ville: locations.ville })
        .from(locations)
        .orderBy(asc(locations.ville));

      const uniqueCities = [...new Set(results.map(r => r.ville))];
      res.json(uniqueCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des villes' });
    }
  });

  // Get table statistics
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = {
        formations: await db.select({ count: sql`count(*)` }).from(formations),
        establishments: await db.select({ count: sql`count(*)` }).from(establishments),
        locations: await db.select({ count: sql`count(*)` }).from(locations),
        costs: await db.select({ count: sql`count(*)` }).from(costs),
        pedagogy_types: await db.select({ count: sql`count(*)` }).from(pedagogyTypes)
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch table statistics' });
    }
  });

  // Add the chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "Tu es un assistant spécialisé dans l'orientation scolaire et professionnelle, nommé GURU. Tu dois répondre en français de manière concise et pertinente aux questions des utilisateurs concernant leur orientation."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Deepseek API error:', error);
        throw new Error('Failed to get response from Deepseek API');
      }

      const data = await response.json();
      res.json({
        message: data.choices[0].message.content
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: "Une erreur est survenue lors du traitement de votre message",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}