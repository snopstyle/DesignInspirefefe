import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const SessionStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple session setup
app.use(session({
  store: new SessionStore({
    checkPeriod: 86400000 // 24h
  }),
  secret: process.env.REPL_ID || 'super-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000 // 24h
  }
}));

// Basic request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});


(async () => {
  const server = registerRoutes(app);

  // Simple error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();