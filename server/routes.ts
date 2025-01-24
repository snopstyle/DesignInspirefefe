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
    try {
      // Return existing temp user if already in session
      if (req.session.tempUserId) {
        return res.json({ id: req.session.tempUserId });
      }

      // Create new temp user
      const [tempUser] = await db.insert(tempUsers)
        .values({})
        .returning();

      if (!tempUser?.id) {
        throw new Error('Failed to create temp user');
      }

      req.session.tempUserId = tempUser.id;
      res.json({ id: tempUser.id });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to create temporary user' });
    }
  });

  // Verify session
  app.get('/api/users/verify', (req: Request, res: Response) => {
    res.json({ 
      valid: Boolean(req.session?.tempUserId),
      id: req.session?.tempUserId
    });
  });

  return createServer(app);
}