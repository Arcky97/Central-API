import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import routes from "./routes";

import { initializeDatabases } from "./database/init";
import { getPool } from "./database/pools";

import { requireApiKey } from "./middleware/apiKey";
import { requestLogger } from "./middleware/requestLogger";
import { env } from "./config/env";

const app = express();

app.set("trust proxy", 1);

const PORT = env.DB_PORT;

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://www.arcky-tech.be",
      "https://arcky-tech.be",
      "https://docs.arcky-tech.be"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
    credentials: false
  })
);

app.use(
  "/api",
  apiLimiter,
  requireApiKey,
  requestLogger,
  routes
);

app.get("/health", async (_, res) => {
  try {
    await getPool("core").query("SELECT 1");
    await getPool("analytics").query("SELECT 1")
    await getPool("auth").query("SELECT 1");

    res.json({
      status: "ok",
      databases: {
        core: "connected",
        analytics: "connected",
        auth: "connected"
      }
    });
  } catch {
    res.status(500).json({
      status: "error"
    });
  }
});

async function bootstrap() {
  try {
    console.log("Starting ArckyTech API...");

    await initializeDatabases();

    console.log("Database initialization complete.");

    app.listen(PORT, () => {
      console.log(
        `Central API is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start API:",
      error
    );

    process.exit(1);
  }
}

bootstrap();