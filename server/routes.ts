import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { quizResults, quizSessions, profileCompletion } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { calculateProfileScores, getMatchedProfile } from "../client/src/lib/profile-logic";
import type { User } from "@db/schema";
import path from 'path';
import xlsx from 'xlsx';

declare global {
  namespace Express {
    interface User extends User {}
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Start or resume a quiz session
  app.post("/api/quiz/session", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      console.log('Creating quiz session for user:', req.user!.id);

      // Check for existing incomplete session
      const existingSession = await db.query.quizSessions.findFirst({
        where: (sessions, { eq, and }) =>
          and(eq(sessions.userId, req.user!.id), eq(sessions.status, 'in_progress')),
        orderBy: desc(quizSessions.startedAt)
      });

      if (existingSession) {
        console.log('Found existing session:', existingSession.id);
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

      console.log('Created new session:', newSession.id);
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

    console.log('Updating session:', { sessionId, questionId, answer, nextQuestionId });

    try {
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { eq, and }) =>
          and(eq(sessions.id, sessionId), eq(sessions.userId, req.user!.id))
      });

      if (!session) {
        console.log('Session not found:', sessionId);
        return res.status(404).send("Session not found");
      }

      console.log('Found session:', session.id);

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

      console.log('Updated session successfully:', updatedSession.id);
      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating quiz session:', error);
      res.status(500).send("Failed to update quiz session");
    }
  });

  // Submit quiz and save results
  app.post("/api/quiz/submit", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).send("Session ID is required");
    }

    console.log('Submitting quiz for session:', sessionId);

    try {
      // Get session data
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { eq, and }) =>
          and(eq(sessions.id, sessionId), eq(sessions.userId, req.user!.id))
      });

      if (!session) {
        console.log('Submit: Session not found:', sessionId);
        return res.status(404).send("Session not found");
      }

      console.log('Submit: Found session:', session.id);

      if (session.status !== 'in_progress') {
        return res.status(400).send("Session is already completed");
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
          subProfile: dominantProfile,
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
        where: (pc) => eq(pc.userId, req.user!.id),
      });

      if (!currentCompletion) {
        // Create initial profile completion status
        await db.insert(profileCompletion)
          .values({
            userId: req.user!.id,
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
          .where(eq(profileCompletion.userId, req.user!.id));
      }

      console.log('Quiz submitted successfully:', result.id);
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
      const results = await db.query.quizResults.findMany({
        where: (results, { eq }) => eq(results.userId, req.user!.id),
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
      const session = await db.query.quizSessions.findFirst({
        where: (sessions, { eq, and }) =>
          and(eq(sessions.userId, req.user!.id), eq(sessions.status, 'in_progress')),
        orderBy: desc(quizSessions.startedAt)
      });

      res.json(session || null);
    } catch (error) {
      console.error('Error fetching current session:', error);
      res.status(500).send("Failed to fetch current session");
    }
  });

  const httpServer = createServer(app);

  interface FormationData {
    id: string;
    formation: string;
    etablissement: string;
    ville: string;
    region: string;
    niveau: string;
    type: string;
    domaines: string[];
    cout: {
      montant: number;
      devise: string;
      gratuitApprentissage: boolean;
    };
    duree: string;
    pedagogie: {
      tempsPlein: boolean;
      presentiel: boolean;
      alternance: boolean;
    };
    statut: string;
    hebergement: boolean;
    lien: string;
    adresse: string;
    departement: string;
    tel: string;
    coordinates: {
      lat: number;
      lng: number;
    } | null;
  }

  let cachedData: FormationData[] | null = null;

  app.get('/api/search', async (req, res) => {
    try {
      if (!cachedData) {
        const workbook = xlsx.readFile(path.join(process.cwd(), 'attached_assets/Top_250_Cities_Non_Public.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        cachedData = rawData.map(transformData);
      }

      const query = req.query.q?.toString().toLowerCase() || '';

      //Improved data transformation with validation
      function transformData(item: any): FormationData {
        // Map Excel column names to our expected fields
        const columnMap = {
          'Formation': 'formation',
          'Établissement': 'etablissement',
          'Ville': 'ville',
          'Région': 'region',
          'Niveau': 'niveau',
          'Type de Formation': 'type',
          'Domaines': 'domaines',
          'Coût': 'cout',
          'Durée': 'duree',
          'Pédagogie': 'pedagogie',
          'Statut': 'statut',
          'Hébergement': 'hebergement',
          'Lien': 'lien',
          'Adresse': 'adresse',
          'Département': 'departement',
          'Téléphone': 'tel',
          'Facebook': 'facebook',
          'Instagram': 'instagram',
          'LinkedIn': 'linkedin'
        };

        // Map item keys using the column map
        const mappedItem = Object.entries(columnMap).reduce((acc, [excelKey, dbKey]) => {
          acc[dbKey] = item[excelKey] || item[dbKey] || '';
          return acc;
        }, {} as Record<string, any>);

        // Parse cost information with better validation
        const costRegex = /(\d+(?:\s*\d+)*)\s*(euros?|€)(?:\s*\(([^)]+)\))?/i;
        const costMatch = (mappedItem.Coût || '').match(costRegex);
        const cost = {
          montant: costMatch ? parseInt(costMatch[1].replace(/\s+/g, '')) : 0,
          devise: 'EUR',
          gratuitApprentissage: /gratuit|apprentissage|alternance/i.test(mappedItem.Coût || '')
        };

        // Enhanced pedagogy parsing
        const pedagogie = {
          tempsPlein: /(temps.*plein|full.*time|présentiel)/i.test(mappedItem.Pédagogie || ''),
          presentiel: /(présentiel|on.*site|sur.*site)/i.test(mappedItem.Pédagogie || ''),
          alternance: /(altern|apprentissage|dual)/i.test(mappedItem.Pédagogie || '')
        };

        // Improved domain parsing with proper capitalization
        const domaines = mappedItem.Domaines ?
          mappedItem.Domaines.split(/[,;|]/)
            .map((d: string) => d.trim())
            .filter(Boolean)
            .map((d: string) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()) :
          ['Domaine non renseigné'];

        // Generate consistent ID
        const id = mappedItem.UAI ||
          mappedItem.ID ||
          `FORM-${Math.random().toString(36).substr(2, 9)}`;

        return {
          id,
          formation: (mappedItem.Formation || 'Formation non renseignée').toLowerCase().trim(),
          etablissement: (mappedItem.Etablissement || 'Établissement non renseigné').trim(),
          ville: (mappedItem.Ville || 'Ville non renseignée').trim(),
          region: (mappedItem.Région || 'Région non renseignée').trim(),
          niveau: (mappedItem.NIveau || 'Niveau non renseigné').trim(),
          type: (mappedItem["Type Formation"] || 'Type non renseigné').trim(),
          domaines: domaines,
          cout: cost,
          duree: (mappedItem.Durée || 'Durée non renseignée').trim(),
          pedagogie,
          statut: (mappedItem.Statut || 'Statut non renseigné').trim(),
          hebergement: /avec.*hébergement|logement|housing/i.test(mappedItem.Hebergement || ''),
          lien: (mappedItem["Lien officiel"] || 'Non renseigné').trim(),
          adresse: (mappedItem.Adresse || 'Adresse non renseignée').trim(),
          departement: (mappedItem.Département || 'Département non renseigné').trim(),
          tel: (mappedItem.Tel || 'Non renseigné').trim(),
          coordinates: mappedItem.Latitude && mappedItem.Longitude ? {
            lat: parseFloat(mappedItem.Latitude),
            lng: parseFloat(mappedItem.Longitude)
          } : null
        };
      }


      // Implement efficient search with pre-processed data
      if (!query) {
        return res.json(cachedData);
      }

      const searchableFields = ['formation', 'etablissement', 'ville', 'region', 'niveau', 'type', 'domaines'];

      const results = cachedData.filter((item) => {
        return searchableFields.some(field => {
          const value = item[field];
          if (Array.isArray(value)) {
            return value.some(v => v.toLowerCase().includes(query));
          }
          return value.toLowerCase().includes(query);
        });
      });

      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Erreur lors de la recherche de formations' });
    }
  });

  // Get unique formation domains
  app.get('/api/domains', async (req, res) => {
    try {
      if (!cachedData) {
        const workbook = xlsx.readFile(path.join(process.cwd(), 'attached_assets/Top_250_Cities_Non_Public.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        cachedData = rawData.map(transformData);
      }

      // Extract all unique domains with proper capitalization
      const uniqueDomains = new Set<string>();
      cachedData.forEach(item => {
        if (Array.isArray(item.domaines)) {
          item.domaines.forEach((domaine: string) => {
            if (domaine && domaine !== 'Domaine non renseigné') {
              uniqueDomains.add(domaine);
            }
          });
        }
      });

      const domainsList = Array.from(uniqueDomains).sort();
      res.json(domainsList);
    } catch (error) {
      console.error('Error fetching domains:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des domaines' });
    }
  });

  return httpServer;
}