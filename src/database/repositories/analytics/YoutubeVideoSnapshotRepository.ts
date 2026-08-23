import { formatLocalDate } from "../../../utils/dateTimeStringifier";
import { query } from "../../query";
import { CreateYoutubeVideoSnapshot, PublicYoutubeVideoSnapshot, UpdateYoutubeVideoSnapshot, YoutubeVideoSnapshotRow } from "../../types/youtube-video-snapshot.type";
import { Repository } from "../base/Repository";

export class YoutubeVideoSnapshotRepository extends Repository<YoutubeVideoSnapshotRow, CreateYoutubeVideoSnapshot, UpdateYoutubeVideoSnapshot, PublicYoutubeVideoSnapshot> {
  constructor() {
    super("youtubeVideoSnapshots", "analytics");
  }

  async getLatestSnapshotLookup(channelId?: number) {
    const channelCondition = channelId === undefined ? "" : "WHERE v.channelId = ?";
    const values = channelId === undefined ? [] : [channelId];
    const snapshots = await query<YoutubeVideoSnapshotRow[]>(
      this.db,
      {
        sql: `
          SELECT s.*

          FROM youtubeVideoSnapshots s
          INNER JOIN youtubeVideos v ON v.id = s.videoId

          INNER JOIN (
            SELECT
              s2.videoId,
              MAX(snapshotDate) AS snapshotDate

            FROM youtubeVideoSnapshots s2
            INNER JOIN youtubeVideos v2 ON v2.id = s2.videoId
            ${channelId === undefined ? "" : "WHERE v2.channelId = ?"}

            GROUP BY s2.videoId
          ) latest

          ON latest.videoId = s.videoId
          AND latest.snapshotDate = s.snapshotDate
          ${channelCondition}
        `
      },
      channelId === undefined ? [] : [channelId, ...values]
    );

    const lookup = new Map<
      number,
      PublicYoutubeVideoSnapshot
    >();

    for (const snapshot of snapshots) {
      lookup.set(
        snapshot.videoId,
        this.mapRow(snapshot)
      );
    }

    return lookup;
  }

  async deleteOlderThan(cutoffDate: Date) {
    await query(this.db, {
      sql: `DELETE FROM ${this.tableName} WHERE snapshotDate < ?`
    }, [formatLocalDate(cutoffDate)]);
  }
}