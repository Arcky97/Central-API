import { Request, Response } from "express";
import { getProjectUpdatesSchema } from "../schema/project-updates.schema";
import { projectUpdatesQueue } from "../queue/project-updates.queue";
import { dateTimeStringifier } from "../utils/dateTimeStringifier";
import { ProjectUpdatesService } from "../services/project-updates.service";

export class ProjectUpdatesController {
  static async registerBulkUpdates(req: Request, res: Response) {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Updates array is required" });
    }

    try {
      const jobs = updates.map(update => {
        const { project, date, title, excerpt, slug } = getProjectUpdatesSchema.parse(update);

        return {
          name: "project-update",
          data: {
            project,
            date: dateTimeStringifier(date),
            title,
            excerpt,
            slug
          }
        }
      });

      await projectUpdatesQueue.addBulk(jobs);

      console.log(
        `[SUCCESS] queued ${jobs.length} project-updates.`
      );

      return res.json({
        success: true
      });
    } catch (err) {
      console.error("[FAILED] project-updates bulk queue add:", err);

      return res.status(500).json({
        success: false
      });
    }
  }

  static async getLatest(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 3;

    const data = await ProjectUpdatesService.getLatest(limit);

    res.json(data);
  }
}