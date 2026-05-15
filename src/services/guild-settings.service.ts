import { API_ERRORS } from "../core/constants/apiErrors";
import { ApiError } from "../core/errors/ApiError";
import { GuildSettingsRepository } from "../database/repositories/core/GuildSettingsRepository";

const guildSettingsRepo = new GuildSettingsRepository();

export class GuildSettingsService {
  static async getSettings(guildId: string) {
    const record = await guildSettingsRepo.getByGuildId(guildId);

    if (!record) {
      throw new ApiError(
        404,
        API_ERRORS.NOT_FOUND,
        "Guild Settings not found"
      );
    }

    return record;
  }
}