import { env } from "../config/env";

import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubePlaylistRepository } from "../database/repositories/analytics/YoutubePlaylistRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideo, YoutubePlaylist } from "../clients/youtube/youtube.types";
import { PublicYoutubeChannel } from "../database/types/youtube-channel.type";
import { CreateYoutubeVideo, PublicYoutubeVideo, UpdateYoutubeVideo } from "../database/types/youtube-video.type";
import { CreateYoutubeVideoSnapshot } from "../database/types/youtube-video-snapshot.type";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { YoutubeAnalyticsClient } from "../clients/youtube/YoutubeAnalyticsClient";
import { YoutubeClient } from "../clients/youtube/YoutubeClient";
import { YoutubeAccountRow } from "../database/types/youtube-accounts.type";
import { formatLocalDate } from "../utils/dateTimeStringifier";
import { SyncJobsService } from "./sync-jobs.service";

const channelRepo =
  new YoutubeChannelRepository();

const videoRepo = 
  new YoutubeVideoRepository();

const snapshotRepo =
  new YoutubeVideoSnapshotRepository();

const playlistRepo =
  new YoutubePlaylistRepository();

export class YoutubeSyncService {
  async sync(account: Pick<YoutubeAccountRow, "channelId" | "channelName" | "refreshToken">, jobId?: string) {
    try {
      const youtubeClient = new YoutubeClient(env.YOUTUBE_API_KEY);
      const youtubeAnalyticsClient = new YoutubeAnalyticsClient(account.refreshToken);
      console.log("[YouTube] Starting synchronization...");

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Syncing YouTube channel and videos",
          progress: 10,
          currentItem: "Channel"
        });
      }

      const channel = await this.syncChannel(youtubeClient, account.channelId);
      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Fetching YouTube videos",
          progress: 30,
          currentItem: channel.channelName
        });
      }

      const videos = await this.fetchVideos(youtubeClient, account.channelId);
      await this.syncPlaylists(youtubeClient, channel, videos);
      const lookup = await this.saveVideos(channel, videos);
      const trackedVideos = videos.filter(video => lookup.get(video.id)?.trackAnalytics);

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Syncing analytics for recent videos",
          progress: 60,
          currentItem: `${videos.length} videos`
        });
      }

      await this.syncAnalytics(youtubeAnalyticsClient, trackedVideos);
      await this.createSnapShots(trackedVideos, lookup, new Date());

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

  async backfillSync(account: Pick<YoutubeAccountRow, "channelId" | "channelName" | "refreshToken">, startDate?: string, jobId?: string) {
    const youtubeClient = new YoutubeClient(env.YOUTUBE_API_KEY);
    const youtubeAnalyticsClient = new YoutubeAnalyticsClient(account.refreshToken);
    const channel = await this.syncChannel(youtubeClient, account.channelId);
    const videos = await this.fetchVideos(youtubeClient, account.channelId);
    await this.syncPlaylists(youtubeClient, channel, videos);

    const lookup = await this.saveVideos(channel, videos);
    const trackedVideos = videos.filter(video => lookup.get(video.id)?.trackAnalytics);

    const retentionCutoff = new Date();
    retentionCutoff.setFullYear(retentionCutoff.getFullYear() - env.YOUTUBE_SNAPSHOT_RETENTION_YEARS);

    const earliestPublished = trackedVideos.reduce(
      (earliest, video) => video.publishedAt < earliest ? video.publishedAt : earliest,
      new Date()
    );

    const effectiveStartDate = startDate ?? formatLocalDate(
      earliestPublished > retentionCutoff ? earliestPublished : retentionCutoff
    );

    let current = new Date(effectiveStartDate);
    current.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.max(1, Math.floor((today.getTime() - current.getTime()) / 86400000) + 1);
    let processedDays = 0;

    while (formatLocalDate(current) <= formatLocalDate(today)) {
      const currentDate = formatLocalDate(current);
      const availableVideos = trackedVideos.filter(video => 
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

      await this.syncAnalytics(youtubeAnalyticsClient, availableVideos, effectiveStartDate, currentDate);
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

  private async syncChannel(youtubeClient: YoutubeClient, channelId: string): Promise<PublicYoutubeChannel> {
    const channel =
      await youtubeClient.getChannel(
        channelId
      );
    
    const existing = 
      await channelRepo.getByChannelId(
        channel.id
      );

    if (!existing) {
      await channelRepo.create({
        channelId: channel.id,
        channelName: channel.title,
        description: channel.description ?? null,
        thumbnailUrl: channel.thumbnailUrl ?? null,
        customUrl: channel.customUrl ?? null,
        publishedAt: channel.publishedAt ?? null,
        subscriberCount: channel.subscriberCount ?? null,
        viewCount: channel.viewCount ?? null,
        videoCount: channel.videoCount ?? null

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

  private async fetchVideos(youtubeClient: YoutubeClient, channelId: string, filter?: (video: YoutubeVideo) => boolean): Promise<YoutubeVideo[]> {
    const playlistId = await youtubeClient.getUploadsPlaylistId(channelId);

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

  private async syncPlaylists(youtubeClient: YoutubeClient, channel: PublicYoutubeChannel, videos: YoutubeVideo[]) {
    const playlists: YoutubePlaylist[] = [];

    let pageToken: string | undefined;

    do {
      const page = await youtubeClient.getPlaylists(channel.channelId, pageToken);
      playlists.push(...page.items);
      pageToken = page.nextPageToken;
    } while (pageToken);

    const lookup = await playlistRepo.getLookupMap(channel.id);
    const videoPlaylistIds = new Map<string, string[]>();

    for (const playlist of playlists) {
      const existing = lookup.get(playlist.id);

      if (!existing) {
        await playlistRepo.create({
          channelId: channel.id,
          playlistId: playlist.id,
          title: playlist.title,
          description: playlist.description ?? null,
          thumbnailUrl: playlist.thumbnailUrl ?? null,
          itemCount: playlist.itemCount ?? null,
          publishedAt: playlist.publishedAt ?? null
        });
      } else {
        await playlistRepo.updateWhere(
          { playlistId: playlist.id },
          {
            title: playlist.title,
            description: playlist.description ?? null,
            thumbnailUrl: playlist.thumbnailUrl ?? null,
            itemCount: playlist.itemCount ?? null
          }
        );
      }

      let itemPageToken: string | undefined;

      do {
        const itemPage = await youtubeClient.getPlaylistItemVideoIds(playlist.id, itemPageToken);

        for (const videoId of itemPage.items) {
          const playlistIds = videoPlaylistIds.get(videoId) ?? [];
          playlistIds.push(playlist.id);
          videoPlaylistIds.set(videoId, playlistIds);
        }

        itemPageToken = itemPage.nextPageToken;
      } while (itemPageToken);
    }

    for (const video of videos) {
      video.playlistIds = videoPlaylistIds.get(video.id) ?? [];
    }

    console.log(`[YouTube] Synced ${playlists.length} playlist(s).`);
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
          description: video.description,
          playlistIds: video.playlistIds,
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
          playlistIds: video.playlistIds,
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

  private async syncAnalytics(youtubeAnalyticsClient: YoutubeAnalyticsClient, videos: YoutubeVideo[], startDate?: string, endDate: string = formatLocalDate(new Date())) {
    if (videos.length === 0) return;

    const firstVideo = videos[0]!;
    const firstPublishedDate = formatLocalDate(
      videos.reduce((earliest, video) =>
        video.publishedAt < earliest ? video.publishedAt : earliest,
        firstVideo.publishedAt
      )
    );
    const analytics = await youtubeAnalyticsClient.getVideoAnalytics(
      startDate ?? firstPublishedDate,
      endDate
    );
    let synced = 0;

    for (const video of videos) {
      const data = analytics.get(video.id);

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

  async pruneExpiredSnapshots() {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - env.YOUTUBE_SNAPSHOT_RETENTION_YEARS);

    await snapshotRepo.deleteOlderThan(cutoff);
    console.log(`[YouTube] Pruned snapshots older than ${formatLocalDate(cutoff)}.`);
  }
}