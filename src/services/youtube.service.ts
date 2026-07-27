import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { YoutubeVideoResponse } from "../database/types/api/youtube-response.type";

const channelRepo = new YoutubeChannelRepository();
const videoRepo = new YoutubeVideoRepository();
const snapshotRepo = new YoutubeVideoSnapshotRepository();

export class YoutubeService {
  static async getChannel() {
    return channelRepo.findOne({});
  }

  static async getVideos(): Promise<YoutubeVideoResponse[]> {
    const videos = await videoRepo.getAll();

    const snapshotLookup =
      await snapshotRepo.getLatestSnapshotLookup();

    return videos.map(video => {
      const snapshot =
        snapshotLookup.get(video.id);

      return {
        youtubeVideoId: video.youtubeVideoId,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl ?? "",
        publishedAt: video.publishedAt,

        statistics: {
          views: snapshot?.views ?? 0,
          likes: snapshot?.likes ?? 0,
          comments: snapshot?.comments ?? 0,
          watchHours: snapshot?.watchHours ?? 0
        }
      };
    });
  }

  static async getVideo(videoId: string) {
    return videoRepo.findOne({
      youtubeVideoId: videoId
    });
  }

  static async getSnapshots(videoId: string) {
    const video = await videoRepo.findOne({
      youtubeVideoId: videoId
    });

    if (!video) return [];

    return snapshotRepo.findMany({
      videoId: video.id
    });
  }
}