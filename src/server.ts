import "dotenv/config";
import express from "express";
import routes from "./routes";
import { getDatabasePool } from "./database/pool";
import { requireApiKey } from "./middleware/apiKey";
import rateLimit from "express-rate-limit";
import cors from "cors";

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://arcky-tech.be"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"]
  })
);

app.use("/api", apiLimiter, requireApiKey, routes);

app.get("/health", async (req, res) => {
  try {
    const pool = getDatabasePool();
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.listen(PORT, () => {
  console.log(`Central API is running on port ${PORT}`);
});