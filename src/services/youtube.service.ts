import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";

const channelRepo = new YoutubeChannelRepository();
const videoRepo = new YoutubeVideoRepository();
const snapshotRepo = new YoutubeVideoSnapshotRepository();

export class YoutubeService {
  static async getChannel() {
    return channelRepo.findOne({});
  }

  static async getVideos() {
    return videoRepo.getAll();
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