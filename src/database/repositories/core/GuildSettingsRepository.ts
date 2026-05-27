import { toBoolean } from "../../mapper/toBoolean";
import { CreateGuildSettings, GuildSettingsRow, PublicGuildSettings, UpdateGuildSettings } from "../../types/guild-settings.type";
import { Repository } from "../base/Repository";

export class GuildSettingsRepository extends Repository<GuildSettingsRow, CreateGuildSettings, UpdateGuildSettings, PublicGuildSettings> {
  constructor() {
    super("guildSettings", "core");
  }

  protected override mapRow(row: GuildSettingsRow): PublicGuildSettings {
    return {
      ...row,
      logging: toBoolean(row.logging),
      leveling: toBoolean(row.leveling),
      doggoBoard: toBoolean(row.doggoBoard),
      reactionRoles: toBoolean(row.reactionRoles)
    };
  }
}