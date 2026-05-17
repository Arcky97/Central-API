// For now this file is unused, but later we'll use it using getVisits and other class functions specifically for pageVisits
import { PageVisitsRepository } from "../database/repositories/analytics/PageVisitsRepository";

const pageVisitsRepo = new PageVisitsRepository();

export class PageVisitsService {
  static async registerVisit(path: string, ip: string, userAgent: string | null, referrer: string | null) {
    await pageVisitsRepo.create({path, ip, userAgent, referrer});
  }
}