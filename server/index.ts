import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const SessionStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple session configuration with only essential options
app.use(session({
  store: new SessionStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.REPL_ID || 'super-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Session debug middleware (integrated with request logging)
app.use((req, res, next) => {
  if (!req.session) {
    console.error('No session available');
    return next(new Error('No session available'));
  }

  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (req.session?.tempUserId) {
        logLine += ` [TempUserId: ${req.session.tempUserId}]`;
      }
      log(logLine);
    }
  });

  next();
});


// Request logging middleware - No changes needed here as logging is enhanced above.
// app.use((req, res, next) => {
//   const start = Date.now();
//   const path = req.path;

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     if (path.startsWith("/api")) {
//       log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
//     }
//   });
//   next();
// });

(async () => {
  const server = registerRoutes(app);

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
      error: true,
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
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