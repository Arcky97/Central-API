import { API_ERRORS } from "../core/constants/apiErrors";
import { ApiError } from "../core/errors/ApiError";
import { BotRepliesRepository } from "../database/repositories/core/BotRepliesRepository";
import { v4 as uuidV4 } from "uuid";
import { CreateBotReplies, PublicBotReplies, UpdateBotReplies } from "../database/types/bot-replies.type";
const botRepliesRepo = new BotRepliesRepository();

export class BotRepliesService {
  static async getReply(uuid: string): Promise<PublicBotReplies> {
    const reply = await botRepliesRepo.findOne({ uuid });

    if (!reply) {
      throw new ApiError(
        404,
        API_ERRORS.NOT_FOUND,
        "Bot Reply not found"
      );
    }

    return reply;
  }

  static async listReplies(limit = 50): Promise<PublicBotReplies[]> {
    return botRepliesRepo.findMany({}, limit);
  }

  static async createReply(data: CreateBotReplies) {
    const uuid = uuidV4();
    const record = await botRepliesRepo.create({
      uuid,
      trigger: data.trigger,
      responses: data.responses
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

  static async updateReply(data: UpdateBotReplies) {
    if (!data.uuid) {
      throw new ApiError(
        400,
        API_ERRORS.INVALID_REQUEST,
        "uuid is required"
      );
    }

    const existing = await botRepliesRepo.findOne({
      uuid: data.uuid
    });

    if (!existing) {
      throw new ApiError(
        404,
        API_ERRORS.NOT_FOUND,
        "Bot Reply not found"
      );
    }

    const { uuid, ...updates } = data;

    await botRepliesRepo.updateWhere(
      { uuid },
      updates
    );

    return botRepliesRepo.findOne({ uuid });
  }

  static async removeReply(uuid: string) {
    const existing = await botRepliesRepo.findOne({
      uuid
    });

    if (!existing) {
      throw new ApiError(
        404,
        API_ERRORS.NOT_FOUND,
        "Bot Reply not found"
      );
    }

    await botRepliesRepo.deleteWhere({
      uuid
    });

    return {
      success: true
    };
  }
}