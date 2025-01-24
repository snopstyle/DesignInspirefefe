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

      const isValid = !!req.session.tempUserId;
      console.log('Session verification:', { 
        sessionID: req.sessionID,
        tempUserId: req.session.tempUserId,
        isValid
      });
      res.json({ valid: isValid, id: req.session.tempUserId });
    } catch (error) {
      console.error('Verify session error:', error);
      res.status(500).json({ error: 'Session verification failed' });
    }
  });

  // Create temporary user
  app.post('/api/users/temp', async (req, res) => {
    try {
      // Check session initialization
      if (!req.session) {
        throw new Error('Session not initialized');
      }

      console.log('Creating temp user, session state:', {
        sessionID: req.sessionID,
        currentTempUserId: req.session.tempUserId
      });

      // Return existing user if session exists
      if (req.session.tempUserId) {
        console.log('Found existing temp user:', req.session.tempUserId);
        return res.json({ id: req.session.tempUserId });
      }

      // Create new temp user
      console.log('Creating new temp user');
      const [tempUser] = await db.insert(tempUsers)
        .values({})
        .returning();

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user record');
      }

      // Set session data
      req.session.tempUserId = tempUser.id;

      // Save session and wait for confirmation
      try {
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              console.error('Session save error:', err);
              reject(new Error('Failed to save session'));
            } else {
              console.log('Session saved successfully:', {
                sessionID: req.sessionID,
                tempUserId: tempUser.id
              });
              resolve();
            }
          });
        });
      } catch (saveError) {
        throw new Error(`Session save failed: ${saveError.message}`);
      }

      // Double-check session was saved
      if (req.session.tempUserId !== tempUser.id) {
        throw new Error('Session verification failed after save');
      }

      console.log('Temp user creation successful:', {
        id: tempUser.id,
        sessionID: req.sessionID
      });

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