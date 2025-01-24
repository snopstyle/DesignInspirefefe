import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { tempUsers } from "@db/schema";

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

      console.log('Session verification:', req.session);
      res.json({ valid: !!req.session.tempUserId, id: req.session.tempUserId });
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

      // Return existing temp user if already in session
      if (req.session.tempUserId) {
        console.log('Using existing temp user:', req.session.tempUserId);
        return res.json({ id: req.session.tempUserId });
      }

      // Create new temp user
      const [tempUser] = await db.insert(tempUsers)
        .values({})
        .returning();

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user');
      }

      // Save temp user ID to session
      req.session.tempUserId = tempUser.id;

      // Save session and wait for completion
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log('Created new temp user:', { id: tempUser.id, session: req.sessionID });
      res.json({ id: tempUser.id });

    } catch (error) {
      console.error('Error in temp user creation:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Failed to create temporary user' 
      });
    }
  });

  return createServer(app);
}