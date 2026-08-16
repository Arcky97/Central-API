import { env } from "../config/env";

import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideo } from "../clients/youtube/youtube.types";
import { PublicYoutubeChannel } from "../database/types/youtube-channel.type";
import { CreateYoutubeVideo, PublicYoutubeVideo, UpdateYoutubeVideo } from "../database/types/youtube-video.type";
import { CreateYoutubeVideoSnapshot } from "../database/types/youtube-video-snapshot.type";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { youtubeAnalyticsClient, youtubeClient } from "../clients/youtube";
import { formatLocalDate } from "../utils/dateTimeStringifier";
import { SyncJobsService } from "./sync-jobs.service";

const channelRepo =
  new YoutubeChannelRepository();

const videoRepo = 
  new YoutubeVideoRepository();

const snapshotRepo =
  new YoutubeVideoSnapshotRepository();

export class YoutubeSyncService {
  async sync(jobId?: string) {
    try {
      console.log("[YouTube] Starting synchronization...");

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Syncing YouTube channel and videos",
          progress: 10,
          currentItem: "Channel"
        });
      }

      const channel = await this.syncChannel();
      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Fetching YouTube videos",
          progress: 30,
          currentItem: channel.channelName
        });
      }

      const videos = await this.fetchVideos();
      const lookup = await this.saveVideos(channel, videos);

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Syncing analytics for recent videos",
          progress: 60,
          currentItem: `${videos.length} videos`
        });
      }

      await this.syncAnalytics(videos);
      await this.createSnapShots(videos, lookup, new Date());

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Finalizing synchronization",
          progress: 95,
          currentItem: "Wrapping up"
        });
      }

      console.log("[YouTube] Synchronization completed.");
    } catch (error: any) {
      console.error("[YouTube] Synchronization failed.", error.response?.data);
      throw error;
    }

  }

  async backfillSync(startDate: string, jobId?: string) {
    const channel = await this.syncChannel();
    const videos = await this.fetchVideos();

    const lookup = await this.saveVideos(channel, videos);

    let current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.max(1, Math.floor((today.getTime() - current.getTime()) / 86400000) + 1);
    let processedDays = 0;

    while (formatLocalDate(current) <= formatLocalDate(today)) {
      const currentDate = formatLocalDate(current);
      const availableVideos = videos.filter(video => 
        video.publishedAt <= current
      );

      if (jobId) {
        const progress = Math.min(99, Math.round((processedDays / totalDays) * 100));
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: `Backfilling YouTube analytics for ${currentDate}`,
          progress,
          currentItem: currentDate
        });
      }

      await this.syncAnalytics(availableVideos, startDate, currentDate);
      await this.createSnapShots(availableVideos, lookup, new Date(current));

      console.log(`[YouTube] Backfill synchronization completed for ${availableVideos.length} video(s) up until ${current}`);

      processedDays += 1;
      current.setDate(current.getDate() + 1);
    }

    if (jobId) {
      await SyncJobsService.updateJob(jobId, {
        status: "running",
        message: "Backfill completed",
        progress: 100,
        currentItem: formatLocalDate(today)
      });
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
          video.shares = stats.shares;
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
          videoId: video.id,
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
          videoId: video.id
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

  private async syncAnalytics(videos: YoutubeVideo[], startDate: string = "2026-05-23", endDate: string = formatLocalDate(new Date())) {
    let synced = 0;

    for (const video of videos) {
    const analytics = 
      await youtubeAnalyticsClient.getVideoAnalytics(
        formatLocalDate(video.publishedAt),
        endDate
      );

      const data =
        analytics.get(video.id);

      if (!data) continue;

      video.watchHours = data.watchHours;
      video.averageViewDuration = data.averageViewDuration;
      video.averageViewPercentage = data.averageViewPercentage;
      video.subscribersGained = data.subscribersGained;
      video.subscribersLost = data.subscribersLost;

      video.views = data.views,
      video.likes = data.likes;
      video.comments = data.comments;
      video.shares = data.shares;

      synced++;
    }

    console.log(
      `[YouTube] synced analytics for ${synced} video(s).`
    );
  }

  private async createSnapShots(
    videos: YoutubeVideo[],
    lookup: Map<string, PublicYoutubeVideo>,
    snapshotDate: Date
  ) {
    const snapshots: CreateYoutubeVideoSnapshot[] = [];

    snapshotDate.setHours(
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
        shares: video.shares,
        watchHours: video.watchHours ?? 0,
        averageViewDuration: video.averageViewDuration ?? 0,
        averageViewPercentage: video.averageViewPercentage ?? 0,
        subscribersGained: video.subscribersGained ?? 0,
        subscribersLost: video.subscribersLost ?? 0,
        snapshotDate
      });
    }

    console.log(`[YouTube] Creating ${snapshots.length} snapshots.`);

    await snapshotRepo.bulkUpsert(
      snapshots,
      [
        "views",
        "likes",
        "comments",
        "shares",
        "watchHours",
        "averageViewDuration",
        "averageViewPercentage",
        "subscribersGained",
        "subscribersLost",
      ]
    );
  }
}