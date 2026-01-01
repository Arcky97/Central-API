import "dotenv/config";
import express from "express";
import routes from "./routes";
import { getDatabasePool } from "./database/pool";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.use("/api", routes);

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