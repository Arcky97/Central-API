import { CreateDiscordAccount, DiscordAccountRow, PublicDiscordAccount, UpdateDiscordAccount } from "../../types/discord-accounts.type";
import { Repository } from "../base/Repository";

export class DiscordAccountRepository extends Repository<DiscordAccountRow, CreateDiscordAccount, UpdateDiscordAccount, PublicDiscordAccount> {
  constructor() {
    super("discordAccounts", "auth");
  }

  async getByAuthUserId(authUserId: number) {
    return this.findOne({ authUserId });
  }

  async getByDiscordUserId(discordUserId: string) {
    return this.findOne({ discordUserId });
  }
}