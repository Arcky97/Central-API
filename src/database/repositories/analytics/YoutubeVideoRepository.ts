import { toBoolean } from "../../mapper/toBoolean";
import { query } from "../../query";
import { CreateYoutubeVideo, PublicYoutubeVideo, UpdateYoutubeVideo, YoutubeVideoRow } from "../../types/youtube-video.type";
import { Repository } from "../base/Repository";

export class YoutubeVideoRepository extends Repository<YoutubeVideoRow, CreateYoutubeVideo, UpdateYoutubeVideo, PublicYoutubeVideo> {
  constructor() {
    super("youtubeVideos", "analytics");
  }

  // playlistIds must be JSON-stringified before insert/update, mysql2 does not serialize array values for JSON columns
  private serialize<T extends { playlistIds?: string[] | null }>(data: T): T {
    if (data.playlistIds === undefined) return data;

    return {
      ...data,
      playlistIds: JSON.stringify(data.playlistIds ?? []) as unknown as string[] | null
    };
  }

  override async create(data: CreateYoutubeVideo) {
    return super.create(this.serialize(data));
  }

  override async bulkCreate(rows: CreateYoutubeVideo[]) {
    return super.bulkCreate(rows.map(row => this.serialize(row)));
  }

  override async bulkUpdate(rows: { where: Record<string, unknown>; data: UpdateYoutubeVideo }[]) {
    return super.bulkUpdate(
      rows.map(row => ({
        where: row.where,
        data: this.serialize(row.data)
      }))
    );
  }

  override async updateWhere(where: Record<string, unknown>, data: UpdateYoutubeVideo) {
    return super.updateWhere(where, this.serialize(data));
  }

  protected override mapRow(row: YoutubeVideoRow): PublicYoutubeVideo {
    return {
      ...row,
      playlistIds: typeof row.playlistIds === "string"
        ? JSON.parse(row.playlistIds)
        : row.playlistIds ?? [],
      trackAnalytics: toBoolean(row.trackAnalytics)
    }
  }

  async getByYoutubeVideoId(videoId: string) {
    return this.findOne({
      videoId
    });
  }

  async getTrackedVideos() {
    return this.findMany({
      trackAnalytics: 1
    });
  }

  async getByChannelId(channelId: number) {
    return this.findMany({ channelId });
  }

  async getByPlaylistId(playlistId: string) {
    return this.findOne({ playlistId });
  }

  async getLookupMap() {
    const videos = await this.getAll();

    return new Map(
      videos.map(video => [
        video.videoId,
        video
      ])
    );
  }

  async getVideosBeforeDays(channelId: number, days: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const rows = await query<Array<{ uploads: number | string }>>(
      this.db,
      {
        sql: `
          SELECT COUNT(*) AS uploads
          FROM ${this.tableName}
          WHERE channelId = ?
            AND publishedAt >= ?
        `
      },
      [channelId, cutoffDate]
    );

    return { uploads: Number(rows[0]?.uploads ?? 0) };
  }
}