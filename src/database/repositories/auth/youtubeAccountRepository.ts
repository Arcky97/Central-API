import { CreateYoutubeAccount, PublicYoutubeAccount, UpdateYoutubeAccount, YoutubeAccountRow } from "../../types/youtube-accounts.type";
import { Repository } from "../base/Repository";

export class YoutubeAccountRepository extends Repository<YoutubeAccountRow, CreateYoutubeAccount, UpdateYoutubeAccount, PublicYoutubeAccount> {
  constructor() {
    super("youtubeAccounts", "auth");
  }

  async getByAuthUserId(authUserid: number) {
    return this.findOne({ authUserId: authUserid });
  }

  async getByGoogleUserId(googleUserId: string) {
    return this.findOne({ googleUserId });
  }

  async getByChannelId(channelId: string) {
    return this.findOne({ channelId });
  }
}