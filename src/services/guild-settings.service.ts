import { API_ERRORS } from "../core/constants/apiErrors";
import { ApiError } from "../core/errors/ApiError";
import { GuildSettingsRepository } from "../database/repositories/core/GuildSettingsRepository";
import { UpdateGuildSettings } from "../database/types/guild-settings.type";

const guildSettingsRepo = new GuildSettingsRepository();

export class GuildSettingsService {
  static async getSettings(guildId: string) {
    const record = await guildSettingsRepo.getOrCreateByGuildId(guildId, { guildId, logging: false, leveling: true, reactionRoles: false, doggoBoard: false });

    if (!record) {
      throw new ApiError(
        404,
        API_ERRORS.NOT_FOUND,
        "Guild Settings not found"
      );
    }

    return record;
  }

  static async updateSettings(data: UpdateGuildSettings) {
    await guildSettingsRepo.updateGuildSettings(data);
  }
}