import { CreateGuildLogging, GuildLoggingRow, PublicGuildLogging, UpdateGuildLogging } from "../../types/guild-logging.type";
import { Repository } from "../base/Repository";

export class GuildLoggingRepository extends Repository<GuildLoggingRow, CreateGuildLogging, UpdateGuildLogging, PublicGuildLogging>{
  constructor() {
    super("guildLogging", "core");
  }
}