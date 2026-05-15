import { Request, Response } from "express";
import { GuildSettingsService } from "../services/guild-settings.service";
import { getGuildSettingsSchema } from "../schema/guild-settings.schema";

export class GuildSettingsController {
  static async getSettings(req: Request, res: Response) {
    const { guildId } = getGuildSettingsSchema.parse(req.params);

    const data = await GuildSettingsService.getSettings(guildId);

    res.json({
      success: true,
      data
    });
  }
}