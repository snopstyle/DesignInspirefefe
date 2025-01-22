import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { quizSessions, quizResults, profileCompletion } from "@db/schema";
import { eq, desc, and, or, isNull } from "drizzle-orm";

declare module 'express-session' {
  interface SessionData {
    tempUserId: string;
  }
}

export function registerRoutes(app: Express): Server {
  // Create temporary user
  app.post("/api/temp-user", async (req, res) => {
    if (!req.session.tempUserId) {
      req.session.tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    res.json({ id: req.session.tempUserId });
  });

  // Start or resume a quiz session
  app.post("/api/quiz/session", async (req, res) => {
    if (!req.session.tempUserId) {
      req.session.tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    const tempUserId = req.session.tempUserId;

    try {
      // Check for existing incomplete session
      const existingSession = await db.query.quizSessions.findFirst({
        where: (sessions, { and, eq }) =>
          and(
            eq(sessions.tempUserId, tempUserId),
            eq(sessions.status, 'in_progress'),
            isNull(sessions.userId)
          ),
        orderBy: desc(quizSessions.startedAt)
      });

      if (existingSession) {
        return res.json(existingSession);
      }

      // Create new session
      const [newSession] = await db.insert(quizSessions)
        .values({
          tempUserId: tempUserId,
          status: 'in_progress',
          currentQuestionId: 'Q1',
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
    const { sessionId } = req.params;
    const { questionId, answer, nextQuestionId } = req.body;
    let userId;
    if(req.session.tempUserId){
        userId = req.session.tempUserId;
    } else {
        return res.status(400).send("No valid user ID found");
    }

    try {
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { eq, and }) =>
          and(eq(sessions.id, sessionId), eq(sessions.userId, userId))
      });

      if (!session) {
        return res.status(404).send("Session not found");
      }

      if (session.status !== 'in_progress') {
        return res.status(400).send("Session is already completed");
      }

      // Update session with new answer and adaptive path
      const updatedAnswers = { ...session.answers, [questionId]: answer };
      const updatedPath = {
        ...session.adaptivePath,
        currentPath: [...session.adaptivePath.currentPath, nextQuestionId],
        branchingPoints: {
          ...session.adaptivePath.branchingPoints,
          [questionId]: {
            question: questionId,
            answer,
            nextQuestion: nextQuestionId
          }
        }
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

  // Submit quiz and save results
  app.post("/api/quiz/submit", async (req, res) => {
    let userId;
    if (req.session.tempUserId) {
      userId = req.session.tempUserId;
    } else {
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
          and(eq(sessions.id, sessionId), eq(sessions.userId, userId))
      });

      if (!session) {
        return res.status(404).send("Session not found");
      }

      if (session.status !== 'in_progress') {
        return res.status(400).send("Session is already completed");
      }

      // Calculate results
      const profileScores = calculateProfileScores(session.answers);
      const subProfile = getMatchedProfile(profileScores);
      const dominantProfile = dominant_profile_mapping[subProfile] || "Profil Non Défini";

      // Save quiz results
      const [result] = await db.insert(quizResults)
        .values({
          userId: userId,
          sessionId: session.id,
          answers: session.answers,
          adaptiveFlow: {
            path: session.adaptivePath.currentPath,
            branchingDecisions: session.adaptivePath.branchingPoints
          },
          traitScores: profileScores,
          dominantProfile,
          subProfile: subProfile,
          traits: Object.entries(profileScores)
            .sort(([, a], [, b]) => b - a)
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

      // Get current completion status
      const currentCompletion = await db.query.profileCompletion.findFirst({
        where: (pc) => eq(pc.userId, userId),
      });

      if (!currentCompletion) {
        // Create initial profile completion status
        await db.insert(profileCompletion)
          .values({
            userId: userId,
            personalityQuizCompleted: true,
            overallProgress: 20, // 20% for completing personality quiz
          });
      } else {
        // Update existing completion status
        await db.update(profileCompletion)
          .set({
            personalityQuizCompleted: true,
            lastUpdated: new Date(),
            overallProgress: currentCompletion.overallProgress + (!currentCompletion.personalityQuizCompleted ? 20 : 0)
          })
          .where(eq(profileCompletion.userId, userId));
      }

      res.json(result);
    } catch (error) {
      console.error('Quiz submission error:', error);
      res.status(500).send("Failed to save quiz results");
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

  // Get current quiz session
  app.get("/api/quiz/session/current", async (req, res) => {
    if (!req.session.tempUserId) {
      return res.status(400).send("No valid user ID found");
    }

    try {
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { and, eq }) =>
          and(
            eq(sessions.tempUserId, req.session.tempUserId),
            eq(sessions.status, 'in_progress'),
            isNull(sessions.userId)
          ),
        orderBy: desc(quizSessions.startedAt)
      });

      res.json(session || null);
    } catch (error) {
      console.error('Error fetching current session:', error);
      res.status(500).send("Failed to fetch current session");
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