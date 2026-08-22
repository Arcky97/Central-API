import { CreateYoutubeAccount, PublicYoutubeAccount, UpdateYoutubeAccount, YoutubeAccountRow } from "../../types/youtube-accounts.type";
import { query } from "../../query";
import { Repository } from "../base/Repository";

export class YoutubeAccountRepository extends Repository<YoutubeAccountRow, CreateYoutubeAccount, UpdateYoutubeAccount, PublicYoutubeAccount> {
  constructor() {
    super("youtubeAccounts", "auth");
  }

  async getByAuthUserId(authUserid: number) {
    return this.findOne({ authUserId: authUserid });
  }

  async getCredentialsByAuthUserId(authUserId: number): Promise<YoutubeAccountRow | null> {
    const rows = await query<YoutubeAccountRow[]>(
      this.db,
      {
        sql: `SELECT * FROM ${this.tableName} WHERE authUserId = ? LIMIT 1`
      },
      [authUserId]
    );

    return rows[0] ?? null;
  }

  async getByGoogleUserId(googleUserId: string) {
    return this.findOne({ googleUserId });
  }

  async getByChannelId(channelId: string) {
    return this.findOne({ channelId });
  }
}