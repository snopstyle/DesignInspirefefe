import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { quizSessions, tempUsers } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

declare module 'express-session' {
  interface SessionData {
    tempUserId: string;
  }
}

export function registerRoutes(app: Express): Server {
  // Create temporary user session
  app.post("/api/temp-user", async (req, res) => {
    try {
      // Create temp user
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
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log('Created temp user:', tempUser.id, 'Session ID:', req.sessionID);
      res.status(201).json({
        id: tempUser.id,
        sessionId: req.sessionID,
        timestamp: new Date().toISOString()
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
    if(req.session.tempUserId){
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
    if(req.session.tempUserId){
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
    if(req.session.tempUserId){
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

  // Search endpoint
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q?.toString().toLowerCase() || '';
      const ville = req.query.ville?.toString();
      const niveau = req.query.niveau?.toString();
      const diplomeEtat = req.query.diplomeEtat === 'true';
      const selectedDomains = req.query.tags?.toString().split(',') || [];

      // Build the where clause based on filters
      const whereConditions = [];

      if (query) {
        whereConditions.push(
          or(
            ilike(formations.formation, `%${query}%`),
            ilike(establishments.name, `%${query}%`)
          )
        );
      }

      if (ville) {
        whereConditions.push(eq(locations.ville, ville));
      }

      if (niveau) {
        whereConditions.push(eq(formations.niveau, niveau));
      }

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
          cout: {
            montant: costs.montant,
            devise: costs.devise,
            gratuitApprentissage: costs.gratuitApprentissage
          },
          pedagogie: {
            tempsPlein: pedagogyTypes.tempsPlein,
            presentiel: pedagogyTypes.presentiel,
            alternance: pedagogyTypes.alternance
          },
          statut: establishments.statut,
          hebergement: establishments.hebergement,
          lien: establishments.lien,
          adresse: locations.adresse,
          departement: locations.departement,
          tel: establishments.tel,
          facebook: establishments.facebook,
          instagram: establishments.instagram,
          linkedin: establishments.linkedin
        })
        .from(formations)
        .leftJoin(establishments, eq(formations.etablissementId, establishments.id))
        .leftJoin(locations, eq(formations.locationId, locations.id))
        .leftJoin(costs, eq(formations.costId, costs.id))
        .leftJoin(pedagogyTypes, eq(formations.pedagogyId, pedagogyTypes.id))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .limit(50);

      // Filter by domains if any are selected
      const filteredResults = selectedDomains.length > 0
        ? results.filter(result =>
            result.domaines.some(domain =>
              selectedDomains.includes(domain)
            )
          )
        : results;

      res.json(filteredResults);
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
      const results = await db.query.locations.findMany({
        columns: { ville: true },
        orderBy: locations.ville
      });

      const uniqueCities = new Set(results.map(r => r.ville));
      const citiesList = Array.from(uniqueCities);
      res.json(citiesList);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des villes' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { calculateProfileScores as calculateScores, getMatchedProfile as getProfile } from "../client/src/lib/profile-logic";

const dominant_profile_mapping = {
  // Example mapping -  Replace with your actual mapping
  "SubProfileA": "DominantProfileX",
  "SubProfileB": "DominantProfileY",
  "SubProfileC": "DominantProfileZ"
};

function calculateProfileScores(answers: any): any {
  const scores = calculateScores(answers);
  return scores;
}

function getMatchedProfile(profileScores: any): any {
  const profile = getProfile(profileScores);
  return profile;
}