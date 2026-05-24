import { Request, Response } from "express";
//import { PageVisitsService } from "../services/page-visits.service";
import { getPageVisitsSchema } from "../schema/page-visits.schema";
import { pageVisitsQueue } from "../queue/page-visits.queue";
import { PageVisitsService } from "../services/page-visits.service";
import { ProjectUpdatesService } from "../services/project-updates.service";

export class PageVisitsController {
  static async registerVisit(req: Request, res: Response) {
    const { path, userAgent, referrer } = getPageVisitsSchema.parse(req.body);

    try{
      await pageVisitsQueue.add("page-visit", {
        path,
        ip: req.ip ?? "unknown", 
        userAgent: userAgent ?? null,
        referrer: referrer ?? null
      });
      console.log("[SUCCESS] page-visits queue add.")
    } catch(err) {
      console.error("[FAILED] page-visits queue add:", err);
    } finally {
      res.json({ success: true });
    }
  }

  static async getLatest(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 3;

    const data = await ProjectUpdatesService.getLatest(limit);

    res.json({
      success: true,
      data
    });
  }
}