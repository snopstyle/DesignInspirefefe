import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const SessionStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Improved session configuration
app.use(session({
  store: new SessionStore({
    checkPeriod: 86400000,
    ttl: 24 * 60 * 60 * 1000
  }),
  secret: process.env.REPL_ID || 'super-secret-key',
  name: 'quiz.sid',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  log(`[${new Date().toLocaleTimeString()}] Session ID: ${req.sessionID}`);
  log(`[${new Date().toLocaleTimeString()}] Temp User ID: ${req.session.tempUserId}`);

  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} completed in ${duration}ms`);
    originalEnd.apply(res, args);
  };
  next();
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ 
      error: true,
      message: err.message || "Internal Server Error"
    });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(5000, "0.0.0.0", () => {
    log('Server running on port 5000');
  });
})();