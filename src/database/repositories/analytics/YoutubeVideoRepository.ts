import { toBoolean } from "../../mapper/toBoolean";
import { CreateYoutubeVideo, PublicYoutubeVideo, UpdateYoutubeVideo, YoutubeVideoRow } from "../../types/youtube-video.type";
import { Repository } from "../base/Repository";

export class YoutubeVideoRepository extends Repository<YoutubeVideoRow, CreateYoutubeVideo, UpdateYoutubeVideo, PublicYoutubeVideo> {
  constructor() {
    super("youtubeVideos", "analytics");
  }

  protected override mapRow(row: YoutubeVideoRow): PublicYoutubeVideo {
    return {
      ...row,
      trackAnalytics: toBoolean(row.trackAnalytics)
    }
  }

  async getByYoutubeVideoId(videoId: string) {
    return this.findOne({
      youtubeVideoId: videoId
    });
  }

  async getTrackedVideos() {
    return this.findMany({
      trackAnalytics: 1
    });
  }

  async getSeries(series: string) {
    return this.findMany({
      series
    });
  }

  async getLookupMap() {
    const videos = await this.getAll();

    return new Map(
      videos.map(video => [
        video.youtubeVideoId,
        video
      ])
    );
  }
}