import { CreateYoutubeChannelAnalyticsSnapshot, PublicYoutubeChannelAnalyticsSnapshot, UpdateYoutubeChannelAnalyticsSnapshot, YoutubeChannelAnalyticsSnapshotRow } from "../../types/youtube-channel-analytics-snapshots.type";
import { Repository } from "../base/Repository";


export class YoutubeChannelAnalyticsSnapshotRepository extends Repository<YoutubeChannelAnalyticsSnapshotRow, CreateYoutubeChannelAnalyticsSnapshot, UpdateYoutubeChannelAnalyticsSnapshot, PublicYoutubeChannelAnalyticsSnapshot> {
  constructor() {
    super("youtubeChannelAnalyticsSnapshots", "analytics")
  }

  async hasSnapshots(channelId: string): Promise<boolean> {
    return (await this.findOne({ channelId })) !== null;
  }
}