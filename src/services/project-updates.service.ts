import { API_ERRORS } from "../core/constants/apiErrors";
import { ApiError } from "../core/errors/ApiError";
import { ProjectUpdatesRepository } from "../database/repositories/core/ProjectUpdatesRepository";

const projectupdatesRepo = new ProjectUpdatesRepository();

export class ProjectUpdatesService {
  static async getLatest(limit: number) {
    const record = await projectupdatesRepo.getLatest(limit);

    if (!record) {
      throw new ApiError(
        404,
        API_ERRORS.INVALID_INPUT,
        "Invalid limit input or so"
      );
    }

    return record;
  }
}