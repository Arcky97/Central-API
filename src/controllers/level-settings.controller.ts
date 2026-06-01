import { Request, Response } from "express";
import { getLevelSettingsSchema } from "../schema/level-settings.schema";
import { LevelSettingsService } from "../services/level-settings.service";


export class LevelSettingsController {
  static async getSettings(req: Request, res: Response) {
    const { guildId } = getLevelSettingsSchema.parse(req.params);


  }

  static async updateSettings(req: Request, res: Response) {
    const data = getLevelSettingsSchema.parse(req.body);

    await LevelSettingsService.updateSettings({ ...data, deletionDate: data.deletionDate || null})
  }
}