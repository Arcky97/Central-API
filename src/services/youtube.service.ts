import { YoutubeChannelAnalyticsSnapshotRepository } from "../database/repositories/analytics/YoutubeChannelAnalyticsSnapshotRepository";
import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeGoalProfileRepository } from "../database/repositories/analytics/YoutubeGoalProfileRepository";
import { YoutubePlaylistRepository } from "../database/repositories/analytics/YoutubePlaylistRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { YoutubeVideoResponse } from "../database/types/api/youtube-response.type";
import { CreateYoutubeGoalProfile, PublicYoutubeGoalProfile, UpdateYoutubeGoalProfile } from "../database/types/youtube-goal-profile.type";
import { PublicYoutubePlaylist } from "../database/types/youtube-playlist.type";
import { UpdateYoutubeVideo } from "../database/types/youtube-video.type";

const channelRepo = new YoutubeChannelRepository();
const videoRepo = new YoutubeVideoRepository();
const videoSnapshotRepo = new YoutubeVideoSnapshotRepository();
const channelSnapshotRepo = new YoutubeChannelAnalyticsSnapshotRepository();
const goalProfileRepo = new YoutubeGoalProfileRepository();
const playlistRepo = new YoutubePlaylistRepository();


export class YoutubeService {
  static async getChannel(channelId: string) {
    return channelRepo.getByChannelId(channelId);
  }

  static async getVideos(channelId: string): Promise<YoutubeVideoResponse[]> {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return [];

    const videos = await videoRepo.getByChannelId(channel.id);

    return videos.map(video => {
      return {
        videoId: video.videoId,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl ?? "",
        description: video.description ?? "",
        publishedAt: video.publishedAt,
        playlistIds: video.playlistIds ?? [],
        durationSeconds: video.durationSeconds,
        isShort: video.isShort,
        isShortOverride: video.isShortOverride,
        views: video?.views ?? 0,
        likes: video?.likes ?? 0,
        comments: video?.comments ?? 0,
        shares: video?.shares ?? 0,
        watchHours: video?.watchHours ?? 0,
        averageViewDuration: video?.averageViewDuration ?? 0,
        averageViewPercentage: video?.averageViewPercentage ?? 0,
        subscribersGained: video?.subscribersGained ?? 0,
        subscribersLost: video?.subscribersLost ?? 0
      };
    });
  }

  static async getLatestVideos(limit: number, channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return null;

    return videoRepo.getByVideoType(channel.id, "video", { limit });
  }

  static async getLatestShorts(limit: number, channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return null;

    return videoRepo.getByVideoType(channel.id, "short", { limit });
  }

  static async getVideo(videoId: string, channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return null;

    return videoRepo.findOne({ videoId, channelId: channel.id });
  }

  static async getVideosByLastDays(days: number, channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return { uploads: 0 };

    return videoRepo.getVideosBeforeDays(channel.id, days);
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

  static async getPlaylists(channelId: string): Promise<PublicYoutubePlaylist[]> {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return [];

    const playlists = await playlistRepo.findMany({ channelId: channel.id });
    
    return playlists;
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

  static async getVideoSnapshots(videoId: string, channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return [];

    const video = await videoRepo.findOne({ videoId, channelId: channel.id });

    if (!video) return [];

    return videoSnapshotRepo.findMany({
      videoId: video.id
    });
  }

  static async getLatestVideosSnapshots(channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return [];

    const snapshotLookup = await videoSnapshotRepo.getLatestSnapshotLookup(channel.id);

    console.log(Array.from(snapshotLookup.values()));

    return Array.from(snapshotLookup.values());
  }

  static async getChannelSnapshots(channelId: string) {
    const channel = await channelRepo.getByChannelId(channelId);
    if (!channel) return [];

    return channelSnapshotRepo.findMany({
      channelId
    });
  }
}