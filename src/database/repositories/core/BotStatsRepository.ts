import { BotStatsRow, CreateBotStats, publicBotStats, UpdateBotStats } from "../../types/bot-stats.type";
import { Repository } from "../base/Repository";

export class BotStatsRepository extends Repository<BotStatsRow, CreateBotStats, UpdateBotStats, publicBotStats> {
  constructor() {
    super("botStats", "core");
  }
}