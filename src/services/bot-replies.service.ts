import { API_ERRORS } from "../core/constants/apiErrors";
import { ApiError } from "../core/errors/ApiError";
import { BotRepliesRepository } from "../database/repositories/core/BotRepliesRepository";
import { v4 as uuidV4 } from "uuid";
const botRepliesRepo = new BotRepliesRepository();

export class BotRepliesService {
  static async createReply(trigger: string, responses: Record<string, string | string[]>[]) {
    const uuid = uuidV4();
    const record = await botRepliesRepo.create({
      uuid,
      trigger,
      responses
    });
    if (!record) {
      throw new ApiError(
        404,
        API_ERRORS.INTERNAL_ERROR,
        "Unable to create Bot Reply"
      );
    }

    return record;
  }

  static async updateReply(uuid: string, trigger: string, responses: Record<string, string | string[]>[]) {

  }

  static async removeReply(uuid: string) {
    
  }
}