import { YoutubeChannelAnalyticsSnapshotRepository } from "../database/repositories/analytics/YoutubeChannelAnalyticsSnapshotRepository";
import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeChannelSnapshotRepository } from "../database/repositories/analytics/YoutubeChannelSnapshotRepository";
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
const channelSnapshotRepo = new YoutubeChannelSnapshotRepository();
const channelAnylticsSnapshotRepo = new YoutubeChannelAnalyticsSnapshotRepository();

export class YoutubeService {
  static async getChannel(channelId: string) {
    return channelRepo.getByChannelId(channelId);
  }

  static async getVideos(channelId: string): Promise<YoutubeVideoResponse[]> {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return [];

    const videos = await videoRepo.getByChannelId(channel.id);

    const snapshotLookup =
      await snapshotRepo.getLatestSnapshotLookup(channel.id);

    return videos.map(video => {
      const snapshot =
        snapshotLookup.get(video.id);

      return {
        videoId: video.videoId,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl ?? "",
        description: video.description ?? "",
        publishedAt: video.publishedAt,
        playlistIds: video.playlistIds ?? [],

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

  static async getVideo(videoId: string, channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return null;

    return videoRepo.findOne({ videoId, channelId: channel.id });
  }

  static async updateVideo(videoId: string, channelId: string, data: UpdateYoutubeVideo) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return false;

    const video = await videoRepo.findOne({ videoId, channelId: channel.id });
    if (!video) return false;

    if (data.goalProfileId !== undefined && data.goalProfileId !== null) {
      const profile = await goalProfileRepo.findOne({
        id: data.goalProfileId,
        channelId: channel.id
      });
      if (!profile) return false;
    }

    await videoRepo.updateWhere({ id: video.id, channelId: channel.id }, data);
    return true;
  }

  static async getAllGoalProfiles(channelId: string): Promise<PublicYoutubeGoalProfile[] | null> {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return null;

    return goalProfileRepo.findMany({
      channelId: channel.id
    })

  }

  static async getGoalProfile(goalProfileId: number, channelId: string): Promise<PublicYoutubeGoalProfile | null> {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return null;

    return goalProfileRepo.findOne({
      id: goalProfileId,
      channelId: channel.id
    });
  }

  static async addGoalProfile(channelId: string, goalProfileData: Omit<CreateYoutubeGoalProfile, "channelId">) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return false;

    await goalProfileRepo.create({ ...goalProfileData, channelId: channel.id });
    return true;
  }

  static async updateGoalProfile(goalProfileId: number, channelId: string, goalProfileData: UpdateYoutubeGoalProfile) {
    const profile = await this.getGoalProfile(goalProfileId, channelId);
    if (!profile) return false;

    await goalProfileRepo.updateWhere({ id: goalProfileId, channelId: profile.channelId }, goalProfileData);
    return true;
  }

  static async removeGoalProfile(goalProfileId: number, channelId: string) {
    const profile = await this.getGoalProfile(goalProfileId, channelId);
    if (!profile) return false;

    await goalProfileRepo.deleteWhere({ id: goalProfileId, channelId: profile.channelId });
    return true;
  }

  static async getSnapshots(videoId: string, channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return [];

    const video = await videoRepo.findOne({ videoId, channelId: channel.id });

    if (!video) return [];

    return snapshotRepo.findMany({
      videoId: video.id
    });
  }
}