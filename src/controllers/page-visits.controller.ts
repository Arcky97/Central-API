import { Request, Response } from "express";
//import { PageVisitsService } from "../services/page-visits.service";
import { getPageVisitsSchema } from "../schema/page-visits.schema";
import { pageVisitsQueue } from "../queue/page-visits.queue";
import { logFailure, logSuccess } from "../database/sync/logger";

export class PageVisitsController {
  static async registerVisit(req: Request, res: Response) {
    logSuccess(`[PAGE-VISITS] New Page Visit register request received.`)
    const { path, userAgent, referrer } = getPageVisitsSchema.parse(req.body);

    void pageVisitsQueue
      .add("page-visit", {
        path,
        ip: req.ip ?? "unknown", 
        userAgent: userAgent ?? null,
        referrer: referrer ?? null
      })
      .catch(err => {
        logFailure("[PAGE_VISITS] queue add:", err);
      });
  }
}