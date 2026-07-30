import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeGoalProfileRepository } from "../database/repositories/analytics/YoutubeGoalProfileRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { YoutubeVideoResponse } from "../database/types/api/youtube-response.type";
import { CreateYoutubeGoalProfile, PublicYoutubeGoalProfile, UpdateYoutubeGoalProfile } from "../database/types/youtube-goal-profile.type";
import { UpdateYoutubeVideo } from "../database/types/youtube-video.type";

const channelRepo = new YoutubeChannelRepository();
const videoRepo = new YoutubeVideoRepository();
const snapshotRepo = new YoutubeVideoSnapshotRepository();
const goalProfileRepo = new YoutubeGoalProfileRepository();

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
          watchHours: snapshot?.watchHours ?? 0,
          averageViewDuration: snapshot?.averageViewDuration ?? 0,
          averageViewPercentage: snapshot?.averageViewPercentage ?? 0,
          subscribersGained: snapshot?.subscribersGained ?? 0,
          subscribersLost: snapshot?.subscribersLost ?? 0
        }
      };
    });
  }

  static async getVideo(videoId: string) {
    return videoRepo.findOne({
      videoId
    });
  }

  static async updateVideo(videoId: string, data: UpdateYoutubeVideo) {
    await videoRepo.updateWhere({ videoId }, data);
  }

  static async getGoalProfile(goalProfileId: number): Promise<PublicYoutubeGoalProfile | null> {
    return goalProfileRepo.findOne({
      id: goalProfileId
    });
  }

  static async addGoalProfile(goalProfileData: CreateYoutubeGoalProfile) {
    await goalProfileRepo.create(goalProfileData);
  }

  static async updateGoalProfile(goalProfileId: number, goalProfileData: UpdateYoutubeGoalProfile) {
    await goalProfileRepo.updateWhere({ id: goalProfileId}, goalProfileData);
  }

  static async removeGoalProfile(goalProfileId: number) {
    await goalProfileRepo.deleteWhere({ id: goalProfileId })
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