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
      const isValid = !!req.session?.tempUserId;
      console.log('Session verification:', { isValid, id: req.session?.tempUserId });
      res.json({ valid: isValid, id: req.session?.tempUserId });
    } catch (error) {
      console.error('Verify session error:', error);
      res.status(500).json({ error: 'Session verification failed' });
    }
  });

  // Create temporary user
  app.post('/api/users/temp', async (req, res) => {
    try {
      console.log('Creating temp user, current session:', req.session);

      // If user already has a session, return it
      if (req.session.tempUserId) {
        console.log('Existing session found:', req.session.tempUserId);
        return res.json({ id: req.session.tempUserId });
      }

      console.log('Creating new temp user');

      // Create new temp user
      const [tempUser] = await db.insert(tempUsers)
        .values({})
        .returning();

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user record');
      }

      // Set the ID in session
      req.session.tempUserId = tempUser.id;

      // Save session explicitly
      await new Promise<void>((resolve, reject) => {
        req.session.save(err => {
          if (err) {
            console.error('Session save error:', err);
            reject(err);
          } else {
            console.log('Session saved successfully');
            resolve();
          }
        });
      });

      console.log('Created temp user:', tempUser.id);
      res.json({ id: tempUser.id });

    } catch (error) {
      console.error('Error creating temp user:', error);
      res.status(500).json({ 
        error: true,
        message: 'Failed to create temporary user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return createServer(app);
}