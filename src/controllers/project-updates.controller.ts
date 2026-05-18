import { Request, Response } from "express";
import { getProjectUpdatesSchema } from "../schema/project-updates.schema";
import { projectUpdatesQueue } from "../queue/project-updates.queue";

export class ProjectUpdatesController {
  static async registerBulkUpdates(req: Request, res: Response) {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Updates array is required" });
    }

    try {
      for (const update of updates) {
        const { project, date, title, excerpt, slug } = getProjectUpdatesSchema.parse(update);

        await projectUpdatesQueue.add("project-update", {
          project,
          date,
          title,
          excerpt,
          slug
        });
        
      }
      console.log("[SUCCESS] project-updates bulk queue add.");
    } catch (err) {
      console.error("[FAILED] project-updates bulk queue add:", err);
    } finally {
      res.json({ success: true });
    }
  }
}