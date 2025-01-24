import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { eq } from "drizzle-orm";
import { tempUsers } from "@db/schema";

// Basic session type extension
declare module 'express-session' {
  interface SessionData {
    tempUserId: string | undefined;
  }
}

export function registerRoutes(app: Express): Server {
  // Create temporary user
  app.post("/api/users/temp", async (req: Request, res: Response) => {
    console.log('Creating temp user, current session:', req.session);

    try {
      // Return existing temp user if already in session
      if (req.session.tempUserId) {
        console.log('Found existing temp user:', req.session.tempUserId);
        const existingUser = await db.query.tempUsers.findFirst({
          where: eq(tempUsers.id, req.session.tempUserId)
        });

        if (existingUser) {
          return res.json({ id: existingUser.id });
        } else {
          console.log('Existing temp user not found in database, creating new one');
          delete req.session.tempUserId;
        }
      }

      // Create new temp user
      console.log('Creating new temp user');
      const [tempUser] = await db.insert(tempUsers)
        .values({})
        .returning();

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user');
      }

      req.session.tempUserId = tempUser.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Failed to save session:', err);
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
      console.error('Error creating temporary user:', error);
      res.status(500).json({ 
        error: 'Failed to create temporary user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Verify session
  app.get('/api/users/verify', (req: Request, res: Response) => {
    console.log('Verifying session:', {
      sessionExists: !!req.session,
      tempUserId: req.session?.tempUserId
    });

    res.json({ 
      valid: Boolean(req.session?.tempUserId),
      id: req.session?.tempUserId
    });
  });

  return createServer(app);
}