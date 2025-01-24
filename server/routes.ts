import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { tempUsers } from "@db/schema";
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

  return createServer(app);
}