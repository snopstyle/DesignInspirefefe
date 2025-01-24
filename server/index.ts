import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const SessionStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
const sessionMiddleware = session({
  store: new SessionStore({
    checkPeriod: 86400000, // prune expired entries every 24h
    ttl: 86400000, // 24 hours
    stale: false,
    noDisposeOnSet: true,
    touchAfter: 24 * 3600 // time period in seconds for touch
  }),
  secret: process.env.REPL_ID || 'super-secret-key',
  name: 'sid',
  resave: true,
  saveUninitialized: false,
  rolling: true,
  unset: 'destroy',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
    path: '/'
  }
});

// Apply session middleware
app.use(sessionMiddleware);

// Session debug middleware
app.use((req, res, next) => {
  if (!req.session) {
    console.error('No session available');
    return next(new Error('No session available'));
  }

  console.log('Session debug:', {
    sessionID: req.sessionID,
    tempUserId: req.session.tempUserId,
    cookie: req.session.cookie
  });
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

(async () => {
  const server = registerRoutes(app);

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
      error: true,
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal server error occurred' 
        : err.message
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