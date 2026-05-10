import express from "express";
import { requireScope } from "../../../middleware/requireScope";
import { query } from "../../../database/query";

const router = express.Router();

const useDB = "core";

router.use(requireScope("website", "admin"));

router.post("/", async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "Updates array is required" });
  }

  try {
    for (const update of updates) {
      const { project, date, title, excerpt, slug } = update;

      if (!project || !date || !slug) continue;

      await query(
        useDB,
        `INSERT INTO ProjectUpdates (project, date, title, excerpt, slug)
        VALUES(?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          excerpt = VALUES(excerpt),
          date = VALUES(date)`,
        [project, date, title, excerpt, slug]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to insert updates:", error);
    res.status(500).json({ error: "Failed to store updates" });
  }
});

router.get("/latest", async (req, res) => {
  const limit = Number(req.query.limit) || 3;
  try {
    const results = await query(useDB,
      `SELECT pu.* FROM ProjectUpdates pu INNER JOIN ( 
        SELECT project, 
          MAX(date) as maxDate FROM ProjectUpdates GROUP BY project 
        ) latest ON pu.project = latest.project AND 
          pu.date = latest.maxDate ORDER BY pu.date DESC LIMIT ? 
      `, [limit]
    );
    res.json(results);
  } catch (error) {
    console.error("Failed to fetch latest updates:", error);
    res.status(500).json({ error: "Failed to fetch updates" });
  }
});

router.get("/", async (req, res) => {
  const { project, limit = 5 } = req.query;

  try {
    if (project) {
      const results = await query(useDB,
        `SELECT * FROM ProjectUpdates WHERE project = ? ORDER BY date DESC LIMIT ?`,
        [project, Number(limit)]
      );

      return res.json(results);
    }

    const results = await query(useDB,
      `SELECT *
      FROM ProjectUpdates
      ORDER BY date DESC
      LIMIT ?`,
      [Number(limit)]
    );

    res.json(results);
  } catch (error) {
    console.error("Failed to fetch updates:", error);
    res.status(500).json({ error: "Failed to fetch updates" });
  }
});

export default router;