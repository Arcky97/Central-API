import { CreateYoutubeChannelSnapshot, PublicYoutubeChannelSnapshot, UpdateYoutubeChannelSnapshot, YoutubeChannelSnapshotRow } from "../../types/youtube-channel-snapshots.type";
import { Repository } from "../base/Repository";

export class YoutubeChannelSnapshotRepository extends Repository<YoutubeChannelSnapshotRow, CreateYoutubeChannelSnapshot, UpdateYoutubeChannelSnapshot, PublicYoutubeChannelSnapshot> {
  constructor() {
    super("youtubeChannelSnapshots", "analytics");
  }

  async hasSnapshots(channelId: string): Promise<boolean> {
    return (await this.findOne({ channelId })) !== null;
  }
}