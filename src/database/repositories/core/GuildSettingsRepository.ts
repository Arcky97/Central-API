import { Repository } from "../base/Repository"

export class GuildSettingsRepository extends Repository {
  constructor() {
    super("guildSettings", "core");
  } 
}