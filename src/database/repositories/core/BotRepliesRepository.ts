import { BotRepliesRow, CreateBotReplies, PublicBotReplies, UpdateBotReplies } from "../../types/bot-replies.type";
import { Repository } from "../base/Repository";

export class BotRepliesRepository extends Repository<BotRepliesRow, CreateBotReplies, UpdateBotReplies, PublicBotReplies> {
  constructor() {
    super("botReplies", "core");
  }
}