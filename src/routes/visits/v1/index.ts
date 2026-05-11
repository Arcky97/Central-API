import express from "express";
import { query } from "../../../database/query";
import { requireScope } from "../../../middleware/requireScope";
import { ExecuteValues } from "mysql2";

const router = express.Router();

const useDB = "analytics";

router.use(requireScope("website", "admin"));

// Log a page visit
router.post("/", async (req, res) => {
  const { path, ip, userAgent, referrer } = req.body;

  if (!path) return res.status(400).json({ error: "Path is required" });

  const useIp = ip || "0.0.0.0";

  try {
    await query(useDB, { sql: 
      "INSERT INTO PageVisits (path, ip, userAgent, referrer) VALUES (?, ?, ?, ?)" },
      [path, useIp, userAgent ?? null, referrer ?? null]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log visit" });
  }
});

// Get all visits or all visits for a path
router.get("/", async (req, res) => {
  const path = req.query.path as string | undefined;

  try {
    let sql = "SELECT * FROM PageVisits";
    const params: ExecuteValues[] = [];

    if (path) {
      sql += " where path = ?";
      params.push(path);
    }

    sql += " ORDER BY visitedAt DESC";

    const visits = await query(useDB, { sql }, params);
    res.json(visits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

// Get all visits by ip
router.get("/by-ip", async (req, res) => {
  const ip = req.query.ip as string | undefined;
  if (!ip) return res.status(400).json({ error: "IP parameter is required" });

  try {
    const visits = await query(useDB, { sql: "SELECT * FROM PageVisits WHERE ip = ? ORDER BY visitedAt DESC" }, [ip]);
    res.json(visits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch visits by IP" });
  }
});

// Get Recent visits
router.get("/latest", async (req, res) => {
  const limit = Number(req.query.limit ?? 50);
  if (isNaN(limit) || limit <= 0) return res.status(400).json({ error: "Invalid limit parameter" });

  try {
    const visits = await query(useDB, { sql: `SELECT * FROM PageVisits ORDER BY visitedAt DESC LIMIT ?` }, [limit]);
    res.json(visits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent visits" });
  }
});

// Get Visits per day for a given period, default 30 days, optional for a given path.
router.get("/stats/daily", async (req, res) => {
  const path = req.query.path as string | undefined;
  const days = Number(req.query.days ?? 30);

  if (isNaN(days) || days <= 0) return res.status(400).json({ error: "Invalid days parameter" });

  try {
    let sql = `
      SELECT DATE(visitedAt) AS day, COUNT(*) AS count
      FROM PageVisits
      WHERE visitedAt >= NOW() - INTERVAL ? DAY
    `;

    const params: ExecuteValues[] = [days];

    if (path) {
      sql += " AND path = ?";
      params.push(path);
    }

    sql += " GROUP BY day ORDER BY day ASC"

    const stats = await query<{ day: string; count: number}[]>(useDB, { sql }, params);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily stats" });
  }
});

// Get Visits per path for a given period, default 30 days.
router.get("/stats/path", async (req, res) => {
  const days = Number(req.query.days ?? 30);

  if (isNaN(days) || days <= 0) return res.status(400).json({ error: "Invalid days parameter" });

  try {
    const sql = `
      SELECT path, COUNT(*) AS count
      FROM PageVisits
      WHERE visitedAt >= NOW() - INTERVAL ? DAY
      GROUP BY path
      ORDER BY count DESC
    `;
    const stats = await query<{ path: String; count: number}[]>(useDB, { sql }, [days]);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch path stats" });
  }
});

export default router;