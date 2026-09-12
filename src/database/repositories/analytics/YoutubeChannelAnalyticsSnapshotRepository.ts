import { query } from "../../query";
import { formatLocalDate } from "../../../utils/dateTimeStringifier";
import { CreateYoutubeChannelAnalyticsSnapshot, PublicYoutubeChannelAnalyticsSnapshot, UpdateYoutubeChannelAnalyticsSnapshot, YoutubeChannelAnalyticsSnapshotRow } from "../../types/youtube-channel-analytics-snapshots.type";
import { Repository } from "../base/Repository";


export class YoutubeChannelAnalyticsSnapshotRepository extends Repository<YoutubeChannelAnalyticsSnapshotRow, CreateYoutubeChannelAnalyticsSnapshot, UpdateYoutubeChannelAnalyticsSnapshot, PublicYoutubeChannelAnalyticsSnapshot> {
  constructor() {
    super("youtubeChannelAnalyticsSnapshots", "analytics")
  }

  async getLatestSnapshotDateByChannelId(channelId: string): Promise<Date | null> {
    const rows = await query<{ snapshotDate: Date | string }[]>(
      this.db,
      {
        sql: `SELECT snapshotDate FROM ${this.tableName} WHERE channelId = ? ORDER BY snapshotDate DESC LIMIT 1`
      },
      [channelId]
    );

    const row = rows[0]?.snapshotDate;
    return row ? new Date(row) : null;
  }

  async hasSnapshotForDate(channelId: string, snapshotDate: Date | string): Promise<boolean> {
    const value = snapshotDate instanceof Date ? formatLocalDate(snapshotDate) : snapshotDate;

    const rows = await query<{ id: number }[]>(
      this.db,
      {
        sql: `SELECT id FROM ${this.tableName} WHERE channelId = ? AND DATE(snapshotDate) = ? LIMIT 1`
      },
      [channelId, value]
    );

    return rows.length > 0;
  }

  async hasSnapshots(channelId: string): Promise<boolean> {
    return (await this.findOne({ channelId })) !== null;
  }
}