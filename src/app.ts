import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import routes from "./routes";

import { getPool } from "./database/pools";

import { requireApiKey } from "./middleware/apiKey";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

import "./workers";

const app = express();

app.set("trust proxy", 1);

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
  apiLimiter,
  requireApiKey, // handles auth failures logging
  requestLogger, // handles requests logging
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

app.use(errorHandler);

export default app;