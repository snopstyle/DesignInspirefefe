import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const SessionStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware with better settings
app.use(session({
  store: new SessionStore({
    checkPeriod: 86400000 // Prune expired entries every 24h
  }),
  secret: process.env.REPL_ID || 'super-secret-key',
  name: 'quiz.sid',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Log session information for debugging
  log(`Session ID: ${req.session.id}`);
  log(`Temp User ID: ${req.session.tempUserId}`);

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try multiple ports if the default port is in use
  const tryPort = (port: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      server.listen(port, "0.0.0.0")
        .once('listening', () => {
          log(`serving on port ${port}`);
          resolve();
        })
        .once('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            log(`Port ${port} is in use, trying ${port + 1}`);
            server.close();
            tryPort(port + 1).then(resolve).catch(reject);
          } else {
            reject(err);
          }
        });
    });
  };

  try {
    await tryPort(5000);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();