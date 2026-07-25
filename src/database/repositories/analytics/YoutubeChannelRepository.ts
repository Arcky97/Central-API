import { CreateYoutubeChannel, PublicYoutubeChannel, UpdateYoutubeChannel, YoutubeChannelRow } from "../../types/youtube-channel.type";
import { Repository } from "../base/Repository";


export class YoutubeChannelRepository extends Repository<YoutubeChannelRow, CreateYoutubeChannel, UpdateYoutubeChannel, PublicYoutubeChannel> {
  constructor() {
    super("youtubeChannels", "analytics");
  }

  async getByChannelId(channelId: string) {
    return this.findOne({
      channelId
    });
  }
}