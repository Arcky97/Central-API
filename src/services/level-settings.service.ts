import { API_ERRORS } from "../core/constants/apiErrors";
import { ApiError } from "../core/errors/ApiError";
import { LevelSettingsRepository } from "../database/repositories/core/LevelSettingsRepository";
import { UpdateLevelSettings } from "../database/types/level-settings.type";

const levelSettingsRepo = new LevelSettingsRepository();

export class LevelSettingsService {
  static async getSettings(guildId: string) {
    const record = await levelSettingsRepo.getOrCreateByGuildId(guildId, { guildId });

    if (!record) {
      throw new ApiError(
        404,
        API_ERRORS.NOT_FOUND,
        "Level Settings not found"
      );
    }

    return record;
  }

  static async updateSettings(data: UpdateLevelSettings) {
    await levelSettingsRepo.updateWhere( { guildId: data.guildId }, data);
  }
}