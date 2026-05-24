import { ProjectUpdatesRepository } from "../database/repositories/core/ProjectUpdatesRepository";

const projectupdatesRepo = new ProjectUpdatesRepository();

export class ProjectUpdatesService {
  static async getLatest(limit: number) {
    const record = await projectupdatesRepo.getLatest(limit);

    if (!record) {
      
    }
  }
}