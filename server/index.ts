import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const SessionStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  store: new SessionStore({
    checkPeriod: 86400000, // Prune expired entries every 24h
    ttl: 24 * 60 * 60 * 1000 // Session TTL (24 hours)
  }),
  secret: process.env.REPL_ID || 'super-secret-key',
  name: 'quiz.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Request logging middleware with type-safe response.end override
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  // Type-safe override of res.end
  const originalEnd = res.end;
  const newEnd: typeof originalEnd = function(this: Response, ...args) {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} completed in ${duration}ms`);
    }
    return originalEnd.apply(this, args);
  };
  res.end = newEnd;

  next();
});


(async () => {
  const server = registerRoutes(app);

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
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

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();