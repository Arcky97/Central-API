import id from "zod/v4/locales/id.cjs";
import { PageVisitsRepository } from "../database/repositories/analytics/PageVisitsRepository";

const pageVisitsRepo = new PageVisitsRepository();

export class PageVistsService {
  static async addVisit(path: string, ip: string, userAgent: string | null, referrer: string | null) {
    await pageVisitsRepo.create({path, ip, userAgent, referrer});
  }
}