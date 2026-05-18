import { toBoolean } from "../../mapper/toBoolean";
import { GuildSettings, GuildSettingsRow } from "../../types/guild-settings.type";
import { Repository } from "../base/Repository";

export class GuildSettingsRepository extends Repository<GuildSettingsRow, GuildSettings> {
  constructor() {
    super("guildSettings", "core");
  }

  protected override mapRow(row: GuildSettingsRow): GuildSettings {
    return {
      ...row,
      logging: toBoolean(row.logging),
      leveling: toBoolean(row.leveling),
      doggoBoard: toBoolean(row.doggoBoard),
      reactionRoles: toBoolean(row.reactionRoles)
    };
  }
}