import { Request, Response } from "express";
//import { PageVisitsService } from "../services/page-visits.service";
import { getPageVisitsSchema } from "../schema/page-visits.schema";
import { pageVisitsQueue } from "../queue/page-visits.queue";

export class PageVisitsController {
  static async registerVisit(req: Request, res: Response) {
    const { path, userAgent, referrer } = getPageVisitsSchema.parse(req.body);

    await pageVisitsQueue.add("visit", {
      path,
      ip: req.ip ?? "unknown", 
      userAgent: userAgent ?? null,
      referrer: referrer ?? null
    });

    res.json({ success: true });
  }
}