import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { YoutubeVideoResponse } from "../database/types/api/youtube-response.type";
import { UpdateYoutubeVideo } from "../database/types/youtube-video.type";

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
        videoId: video.videoId,
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
    console.log(videoId);
    return videoRepo.findOne({
      videoId
    });
  }

  static async updateVideo(data: UpdateYoutubeVideo) {


    await videoRepo.updateWhere({ videoId: data.videoId }, data);
  }

  static async getSnapshots(videoId: string) {
    const video = await videoRepo.findOne({
      videoId
    });

    if (!video) return [];

    return snapshotRepo.findMany({
      videoId: video.id
    });
  }
}