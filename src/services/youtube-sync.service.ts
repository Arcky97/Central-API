import { env } from "../config/env";

import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideo } from "../clients/youtube/youtube.types";
import { PublicYoutubeChannel } from "../database/types/youtube-channel.type";
import { CreateYoutubeVideo, PublicYoutubeVideo, UpdateYoutubeVideo } from "../database/types/youtube-video.type";
import { CreateYoutubeVideoSnapshot } from "../database/types/youtube-video-snapshot.type";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { youtubeClient } from "../clients/youtube";

  const channelRepo =
    new YoutubeChannelRepository();

  const videoRepo = 
    new YoutubeVideoRepository();

  const snapshotRepo =
    new YoutubeVideoSnapshotRepository();

export class YoutubeSyncService {
  async sync() {
    try {
      console.log("[YouTube] Starting synchronization...");
      const channel = await this.syncChannel();
      const videos = await this.fetchVideos();
      const lookup = await this.saveVideos(channel, videos);

      await this.createSnapShots(videos, lookup);

      console.log("[YouTube] Synchronization completed.");
    } catch (error) {
      console.error("[YouTube] Synchronization failed.", error);
      throw error;
    }

  }

  private async syncChannel(): Promise<PublicYoutubeChannel> {
    const channel =
      await youtubeClient.getChannel(
        env.YOUTUBE_CHANNEL_ID
      );
    
    const existing = 
      await channelRepo.getByChannelId(
        channel.id
      );

    if (!existing) {
      await channelRepo.create({
        channelId: channel.id,
        channelName: channel.title
      });

      const created = await channelRepo.getByChannelId(channel.id);

      if (!created) {
        throw new Error("Failed to create YouTube channel.");
      }

      return created;
    } 

      await channelRepo.updateWhere(
        {
          channelId: channel.id
        },
        {
          channelName: channel.title
        }
      );

      const updated = await channelRepo.getByChannelId(channel.id);

      if (!updated) {
        throw new Error("Failed to load YouTube channel.");
      }

      return updated;
  }

  private async fetchVideos(filter?: (video: YoutubeVideo) => boolean): Promise<YoutubeVideo[]> {
    const playlistId = await youtubeClient.getUploadsPlaylistId(env.YOUTUBE_CHANNEL_ID);

    const videos: YoutubeVideo[] = [];
    
    let pageToken: string | undefined;

    do {
      const page =
        await youtubeClient.getPlaylistVideos(
          playlistId,
          pageToken
        );
      
      const statistics = 
        await youtubeClient.getVideoStatistics(
          page.items.map(video => video.id)
        );
      
      page.items.forEach(video => {
        const stats = statistics.get(video.id);
        
        if (stats) {

          video.views = stats.views;
          video.likes=  stats.likes;
          video.comments = stats.comments;
          video.watchHours = stats.watchHours
        }

        videos.push(video);
      });
      
      pageToken = page.nextPageToken;

    } while (pageToken);

    console.log(`[YouTube] Downloaded ${videos.length} videos from YouTube.`);

    const orderedVideos = videos.reverse();

    return filter 
      ? orderedVideos.filter(filter)
      : orderedVideos;
  }

  private async saveVideos(channel: PublicYoutubeChannel, videos: YoutubeVideo[]): Promise<Map<string, PublicYoutubeVideo>> {
    let created = 0;
    let updated = 0;

    const lookup = await videoRepo.getLookupMap();

    const newVideos: CreateYoutubeVideo[] = [];

    const updatedVideos: {
      where: Record<string, unknown>;
      data: UpdateYoutubeVideo;
    }[] = [];

    for (const video of videos) {
      const existing = lookup.get(video.id);

      if (!existing) {
        created++;

        newVideos.push({
          channelId: channel.id,
          youtubeVideoId: video.id,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: video.publishedAt,
          trackAnalytics: true
        });

        continue;
      }

      updated++;

      updatedVideos.push({
        where: {
          youtubevideoId: video.id
        },
        data: {
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: video.publishedAt
        }
      });
    }

    if (newVideos.length > 0) {
      await videoRepo.bulkCreate(newVideos);
    }

    if (updatedVideos.length > 0) {
      await videoRepo.bulkUpdate(updatedVideos);
    }

    console.log(`[YouTube] ${created} new video(s), ${updated} updated.`);

    return await videoRepo.getLookupMap();
  }

  private async createSnapShots(
    videos: YoutubeVideo[],
    lookup: Map<string, PublicYoutubeVideo>
  ) {
    const snapshots: CreateYoutubeVideoSnapshot[] = [];
    
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    for (const video of videos) {
      const databaseVideo = lookup.get(video.id);

      if (!databaseVideo) continue;

      snapshots.push({
        videoId: databaseVideo.id,
        views: video.views,
        likes: video.likes,
        comments: video.comments,
        watchHours: video.watchHours ?? 0,
        snapshotDate: today
      });
    }

    console.log(`[YouTube] Creating ${snapshots.length} snapshots.`);

    await snapshotRepo.bulkUpsert(
      snapshots,
      [
        "views",
        "likes",
        "comments",
        "watchHours"
      ]
    );
  }
}