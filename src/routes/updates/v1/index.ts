import express from "express";
import { query } from "../../../database";
import { requireScope } from "../../../middleware/requireScope";

const router = express.Router();

router.use(requireScope("website", "admin"));

router.post("/", async (req, res) => {
  const { updates } = req.body;

  console.log(updates);

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "Updates array is required" });
  }

  try {
    for (const update of updates) {
      const { project, date, title, excerpt, slug } = update;

      if (!project || !date || !slug) continue;

      await query(
        `INSERT INTO ProjectUpdates (project, date, title, excerpt, slug)
        VALUES(?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title)
          excerpt = VALUES(excerpt)
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
  const { limit = 3 } = req.query;
  try {
    const results = await query(
      `SELECT pu.* FROM ProjectUpdates pu INNER JOIN ( 
        SELECT project, 
          MAX(date) as maxDate FROM ProjectUpdates GROUP BY project 
        ) latest ON pu.project = latest.project AND 
          pu.date = latest.maxDate ORDER BY pu.date DESC LIMIT ? 
      )`, [Number(limit)]
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
      const results = await query(
        `SELECT * FROM ProjectUpdates WHERE project = ? ORDER BY date DESC LIMIT ?`,
        [project, Number(limit)]
      );

      return res.json(results);
    }

    const results = await query(
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