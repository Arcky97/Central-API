import { CreateLevelSettings, LevelSettingsRow, PublicLevelSettings, UpdateLevelSettings } from "../../types/level-settings.type";
import { Repository } from "../base/Repository";

export class LevelSettingsRepository extends Repository<LevelSettingsRow, CreateLevelSettings, UpdateLevelSettings, PublicLevelSettings> {
  constructor() {
    super("levelSettings", "core");
  }
}