import { query } from "../../query";
import { CreateYoutubeVideoSnapshot, PublicYoutubeVideoSnapshot, UpdateYoutubeVideoSnapshot, YoutubeVideoSnapshotRow } from "../../types/youtube-video-snapshot.type";
import { Repository } from "../base/Repository";

export class YoutubeVideoSnapshotRepository extends Repository<YoutubeVideoSnapshotRow, CreateYoutubeVideoSnapshot, UpdateYoutubeVideoSnapshot, PublicYoutubeVideoSnapshot> {
  constructor() {
    super("youtubeVideoSnapshots", "analytics");
  }

  async getLatestSnapshotLookup() {
    const snapshots = await query<YoutubeVideoSnapshotRow[]>(
      this.db,
      {
        sql: `
          SELECT s.*

          FROM youtubeVideoSnapshots s

          INNER JOIN (
            SELECT
              videoId,
              MAX(snapshotDate) AS snapshotDate

            FROM youtubeVideoSnapshots

            GROUP BY videoId
          ) latest

          ON latest.videoId = s.videoId
          AND latest.snapshotDate = s.snapshotDate
        `
      }
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
}