import { env } from "../config/env";

import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubePlaylistRepository } from "../database/repositories/analytics/YoutubePlaylistRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideo, YoutubePlaylist } from "../clients/youtube/youtube.types";
import { PublicYoutubeChannel } from "../database/types/youtube-channel.type";
import { CreateYoutubeVideo, PublicYoutubeVideo, UpdateYoutubeVideo } from "../database/types/youtube-video.type";
import { CreateYoutubeVideoSnapshot } from "../database/types/youtube-video-snapshot.type";
import { YoutubeVideoSnapshotRepository } from "../database/repositories/analytics/YoutubeVideoSnapshotRepository";
import { CreateYoutubeChannelSnapshot } from "../database/types/youtube-channel-snapshots.type";
import { CreateYoutubeChannelAnalyticsSnapshot } from "../database/types/youtube-channel-analytics-snapshots.type";
import { YoutubeChannelSnapshotRepository } from "../database/repositories/analytics/YoutubeChannelSnapshotRepository";
import { YoutubeChannelAnalyticsSnapshotRepository } from "../database/repositories/analytics/YoutubeChannelAnalyticsSnapshotRepository";
import { YoutubeAnalyticsClient } from "../clients/youtube/YoutubeAnalyticsClient";
import { YoutubeChannelAnalytics } from "../clients/youtube/youtube-analytics.type";
import { YoutubeClient } from "../clients/youtube/YoutubeClient";
import { YoutubeAccountRow } from "../database/types/youtube-accounts.type";
import { formatLocalDate } from "../utils/dateTimeStringifier";
import { SyncJobsService } from "./sync-jobs.service";
import { getProgressMessage } from "../utils/getProgressMessage";
import { logFailure, logInfo, logSuccess, logWarning } from "../database/sync/logger";

const channelRepo =
  new YoutubeChannelRepository();

const videoRepo = 
  new YoutubeVideoRepository();

const snapshotRepo =
  new YoutubeVideoSnapshotRepository();

const channelSnapshotRepo =
  new YoutubeChannelSnapshotRepository();

const channelAnalyticsSnapshotRepo =
  new YoutubeChannelAnalyticsSnapshotRepository();

const playlistRepo =
  new YoutubePlaylistRepository();

export class YoutubeSyncService {
  private static readonly MAX_BACKFILL_YEARS_WITH_DATE = 5;
  private static readonly MAX_BACKFILL_YEARS_WITHOUT_DATE = 2;
  private static readonly SEMI_BACKFILL_DAYS = 28;

  /**
   * Performs the regular sync: refresh stored channel/video metadata and save one
   * snapshot for today. This never creates historical records.
   */
  async sync(account: Pick<YoutubeAccountRow, "channelId" | "channelName" | "refreshToken">, jobId?: string) {
    try {
      const youtubeClient = new YoutubeClient(env.YOUTUBE_API_KEY);
      const youtubeAnalyticsClient = new YoutubeAnalyticsClient(account.refreshToken);
      logInfo("[YouTube] Starting synchronization...");

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Syncing YouTube channel and videos",
          progress: 10,
          currentItem: "Channel"
        });
      }

      const { channel, videos, lookup, trackedVideos } = await this.prepareChannelData(
        youtubeClient,
        youtubeAnalyticsClient,
        account.channelId
      );

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Fetching YouTube videos",
          progress: 30,
          currentItem: channel.channelName
        });
      }

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Syncing analytics for recent videos",
          progress: 60,
          currentItem: `${videos.length} videos`
        });
      }

      const today = formatLocalDate(new Date());
      // Video snapshots are stored as daily deltas. The dashboard sums those rows
      // for a desired time window; channel totals remain separate as current-value snapshots.
      await this.syncAnalytics(youtubeAnalyticsClient, trackedVideos, today, today);
      await this.persistCurrentVideoTotals(trackedVideos);
      await this.createVideoSnapshots(trackedVideos, lookup, new Date());
      await this.createCurrentChannelSnapshot(channel);

      if (jobId) {
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: "Finalizing synchronization",
          progress: 95,
          currentItem: "Wrapping up"
        });
      }

      logSuccess("[YouTube] Synchronization completed.");
    } catch (error: any) {
      logFailure("[YouTube] Synchronization failed.", error.response?.data);
      throw error;
    }

  }

  /**
   * Creates daily historical snapshots. Without a videoId this only backfills
   * channel-wide history (used on login); video history is backfilled on demand
   * for a single video (used when its details are viewed), at most once per day.
   */
  async backfillSync(
    account: Pick<YoutubeAccountRow, "channelId" | "channelName" | "refreshToken">,
    options: { videoId?: string | undefined; startDate?: string | undefined; jobId?: string | undefined } = {}
  ) {
    const { videoId, startDate, jobId } = options;

    const youtubeClient = new YoutubeClient(env.YOUTUBE_API_KEY);
    const youtubeAnalyticsClient = new YoutubeAnalyticsClient(account.refreshToken);
    const { channel, lookup, trackedVideos } = await this.prepareChannelData(
      youtubeClient,
      youtubeAnalyticsClient,
      account.channelId
    );

    if (!videoId) {
      await this.backfillChannelSnapshots(channel, youtubeAnalyticsClient, trackedVideos, startDate, jobId);
      return;
    }

    const targetVideos = trackedVideos.filter(video => video.id === videoId);

    if (targetVideos.length === 0) {
      throw new Error(`Video ${videoId} was not found or is not tracked for analytics.`);
    }

    const dbVideo = lookup.get(videoId);

    if (!dbVideo) {
      throw new Error(`Video ${videoId} was not found or is not tracked for analytics.`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let effectiveStartDate: string;

    if (startDate) {
      // An explicit date always runs, bypassing the once-a-day gate below.
      effectiveStartDate = this.getBackfillStartDate(targetVideos, videoId, startDate);
    } else {
      const latestSnapshotDate = await snapshotRepo.getLatestSnapshotDateByVideoId(dbVideo.id);

      if (latestSnapshotDate && formatLocalDate(latestSnapshotDate) >= formatLocalDate(today)) {
        logInfo(`[YouTube] Skipping backfill for video ${videoId}; already backfilled today.`);

        if (jobId) {
          await SyncJobsService.updateJob(jobId, {
            status: "running",
            message: "Video already backfilled today; skipping",
            progress: 100,
            currentItem: videoId
          });
        }

        return;
      }

      if (latestSnapshotDate) {
        // Not the first time this video's details have been opened: refresh a
        // rolling window instead of the full history, since older days rarely change.
        const semiBackfillLookback = new Date();
        semiBackfillLookback.setDate(semiBackfillLookback.getDate() - YoutubeSyncService.SEMI_BACKFILL_DAYS);
        const publishedAt = targetVideos[0]!.publishedAt;
        effectiveStartDate = formatLocalDate(
          publishedAt > semiBackfillLookback ? publishedAt : semiBackfillLookback
        );
      } else {
        // First time this video's details have been opened: backfill its full history.
        effectiveStartDate = this.getBackfillStartDate(targetVideos, videoId, startDate);
      }
    }

    let current = new Date(effectiveStartDate);
    current.setHours(0, 0, 0, 0);

    const totalDays = Math.max(1, Math.floor((today.getTime() - current.getTime()) / 86400000) + 1);
    let processedDays = 0;

    while (formatLocalDate(current) <= formatLocalDate(today)) {
      const currentDate = formatLocalDate(current);
      const availableVideos = targetVideos.filter(video => 
        video.publishedAt <= current
      );

      if (jobId) {
        const progress = Math.min(99, Math.round((processedDays / totalDays) * 100));
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: getProgressMessage(progress),
          progress,
          currentItem: currentDate
        });
      }

      // Each video snapshot represents the delta for that exact day. The dashboard
      // sums the daily rows for any period it wants to show.
      await this.syncAnalytics(youtubeAnalyticsClient, availableVideos, currentDate, currentDate);
      await this.createVideoSnapshots(availableVideos, lookup, new Date(current));

      logSuccess(`[YouTube] Backfill synchronization completed for ${availableVideos.length} video(s) up until ${current}`);

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

  /** Backfills only channel-wide history; used for login-triggered syncs. */
  private async backfillChannelSnapshots(
    channel: PublicYoutubeChannel,
    youtubeAnalyticsClient: YoutubeAnalyticsClient,
    trackedVideos: YoutubeVideo[],
    startDate: string | undefined,
    jobId: string | undefined
  ) {
    const effectiveStartDate = this.getBackfillStartDate(trackedVideos, undefined, startDate);

    let current = new Date(effectiveStartDate);
    current.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDate = formatLocalDate(today);

    // A single ranged request (YouTube already returns one row per day for a
    // "day" dimension query) instead of one request per day, which previously
    // made hundreds of sequential API calls for a multi-year backfill.
    const analyticsByDate = new Map(
      (await youtubeAnalyticsClient.getChannelAnalytics(effectiveStartDate, todayDate))
        .map(row => [row.date, row] as const)
    );

    const totalDays = Math.max(1, Math.floor((today.getTime() - current.getTime()) / 86400000) + 1);
    let processedDays = 0;

    while (formatLocalDate(current) <= todayDate) {
      const currentDate = formatLocalDate(current);

      if (jobId) {
        const progress = Math.min(99, Math.round((processedDays / totalDays) * 100));
        await SyncJobsService.updateJob(jobId, {
          status: "running",
          message: getProgressMessage(progress),
          progress,
          currentItem: currentDate
        });
      }

      const data = analyticsByDate.get(currentDate);
      if (data) {
        await this.persistChannelAnalyticsSnapshot(channel, currentDate, data);
      }

      processedDays += 1;
      current.setDate(current.getDate() + 1);
    }

    // Public channel totals are only available as their current values, so retain
    // one accurate snapshot for today instead of inventing historical totals.
    await this.createCurrentChannelSnapshot(channel);

    if (jobId) {
      await SyncJobsService.updateJob(jobId, {
        status: "running",
        message: "Backfill completed",
        progress: 100,
        currentItem: formatLocalDate(today)
      });
    }
  }

  /** Fetches external data and ensures its database records exist before snapshot work. */
  private async prepareChannelData(youtubeClient: YoutubeClient, youtubeAnalyticsClient: YoutubeAnalyticsClient, channelId: string) {
    const channel = await this.syncChannel(youtubeClient, channelId);
    const videos = await this.fetchVideos(youtubeClient, channelId);
    await this.syncPlaylists(youtubeClient, channel, videos);

    const lookup = await this.saveVideos(channel, videos, youtubeAnalyticsClient);
    const trackedVideos = videos.filter(video => lookup.get(video.id)?.trackAnalytics);

    return { channel, videos, lookup, trackedVideos };
  }

  /** Calculates the earliest allowed date for the requested backfill scope. */
  async getStaleBackfillStartDate(channel: PublicYoutubeChannel): Promise<string | null> {
    const latestVideoSnapshotDate = await snapshotRepo.getLatestSnapshotDateByChannelId(channel.id);
    const latestChannelAnalyticsDate = await channelAnalyticsSnapshotRepo.getLatestSnapshotDateByChannelId(channel.channelId);

    const latestDates = [latestVideoSnapshotDate, latestChannelAnalyticsDate].filter((date): date is Date => date !== null);

    if (latestDates.length === 0) {
      return null;
    }

    const latest = new Date(Math.min(...latestDates.map(date => date.getTime())));
    latest.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formatLocalDate(latest) >= formatLocalDate(today)) {
      return null;
    }

    return formatLocalDate(latest);
  }

  private getBackfillStartDate(videos: YoutubeVideo[], videoId?: string, startDate?: string): string {
    const retentionCutoff = this.getRetentionCutoff();
    let requestedStartDate: Date;

    if (videoId) {
      if (startDate) {
        const maxLookback = new Date();
        maxLookback.setFullYear(maxLookback.getFullYear() - YoutubeSyncService.MAX_BACKFILL_YEARS_WITH_DATE);
        const requested = new Date(`${startDate}T00:00:00`);
        requestedStartDate = requested < maxLookback ? maxLookback : requested;
      } else {
        const maxLookback = new Date();
        maxLookback.setFullYear(maxLookback.getFullYear() - YoutubeSyncService.MAX_BACKFILL_YEARS_WITHOUT_DATE);
        const publishedAt = videos[0]!.publishedAt;
        requestedStartDate = publishedAt > maxLookback ? publishedAt : maxLookback;
      }
    } else {
      const earliestPublished = videos.reduce(
        (earliest, video) => video.publishedAt < earliest ? video.publishedAt : earliest,
        new Date()
      );
      const requested = startDate
        ? new Date(`${startDate}T00:00:00`)
        : (earliestPublished > retentionCutoff ? earliestPublished : retentionCutoff);
      requestedStartDate = requested > retentionCutoff ? requested : retentionCutoff;
    }

    return formatLocalDate(requestedStartDate);
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

    // Keep the database channel record aligned with the public metadata used by
    // current-day snapshots.
    await channelRepo.updateWhere(
      {
        channelId: channel.id
      },
      {
        channelName: channel.title,
        description: channel.description ?? null,
        thumbnailUrl: channel.thumbnailUrl ?? null,
        customUrl: channel.customUrl ?? null,
        publishedAt: channel.publishedAt ?? null,
        subscriberCount: channel.subscriberCount ?? null,
        viewCount: channel.viewCount ?? null,
        videoCount: channel.videoCount ?? null
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
          video.durationSeconds = stats.durationSeconds;
          video.isShort = stats.isShort;
        }

        videos.push(video);
      });
      
      pageToken = page.nextPageToken;

    } while (pageToken);

    logInfo(`[YouTube] Downloaded ${videos.length} videos from YouTube.`);

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

    logSuccess(`[YouTube] Synced ${playlists.length} playlist(s).`);
  }

  private async saveVideos(channel: PublicYoutubeChannel, videos: YoutubeVideo[], youtubeAnalyticsClient: YoutubeAnalyticsClient): Promise<Map<string, PublicYoutubeVideo>> {
    let created = 0;
    let updated = 0;

    // Populates each video's watchHours/averageViewDuration/averageViewPercentage/
    // subscribersGained/subscribersLost (lifetime, since no startDate here spans
    // publish date through today) before the rows below are built.
    await this.syncAnalytics(youtubeAnalyticsClient, videos);

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
          durationSeconds: video.durationSeconds,
          views: Number(video.views ?? 0),
          likes: Number(video.likes ?? 0),
          comments: Number(video.comments ?? 0),
          shares: Number(video.shares ?? 0),
          watchHours: Number(video.watchHours ?? 0),
          averageViewDuration: Number(video.averageViewDuration ?? 0),
          averageViewPercentage: Number(video.averageViewPercentage ?? 0),
          subscribersGained: Number(video.subscribersGained ?? 0),
          subscribersLost: Number(video.subscribersLost ?? 0),
          isShort: video.isShort,
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
          publishedAt: video.publishedAt,
          durationSeconds: video.durationSeconds,
          isShort: video.isShort,
          views: Number(video.views ?? 0),
          likes: Number(video.likes ?? 0),
          comments: Number(video.comments ?? 0),
          shares: Number(video.shares ?? 0),
          watchHours: Number(video.watchHours ?? 0),
          averageViewDuration: Number(video.averageViewDuration ?? 0),
          averageViewPercentage: Number(video.averageViewPercentage ?? 0),
          subscribersGained: Number(video.subscribersGained ?? 0),
          subscribersLost: Number(video.subscribersLost ?? 0)
        }
      });
    }

    if (newVideos.length > 0) {
      await videoRepo.bulkCreate(newVideos);
    }

    if (updatedVideos.length > 0) {
      await videoRepo.bulkUpdate(updatedVideos);
    }

    logSuccess(`[YouTube] ${created} new video(s), ${updated} updated.`);

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
    let skipped = 0;

    for (const video of videos) {
      try {
        const data = analytics.get(video.id);

        if (!data) continue;

        video.watchHours = data.watchHours;
        video.averageViewDuration = data.averageViewDuration;
        video.averageViewPercentage = data.averageViewPercentage;
        video.subscribersGained = data.subscribersGained;
        video.subscribersLost = data.subscribersLost;

        // views/likes/comments/shares are left as the real-time Data API values set in
        // fetchVideos, since the Analytics API's counterparts lag by up to a few days.

        synced++;
      } catch (error) {
        logFailure(
          `[YouTube] Failed to sync analytics for video ${video.id}`, 
          error
        );

        skipped++;

        continue;
      }
    }

    logInfo(
      `[YouTube] synced analytics for ${synced} video(s).`
    );
  }

  private async persistCurrentVideoTotals(videos: YoutubeVideo[]) {
    if (videos.length === 0) return;

    const updates = videos
      .filter(video => Number.isFinite(video.views) && Number.isFinite(video.likes))
      .map(video => ({
        where: { videoId: video.id },
        data: {
          views: Number(video.views ?? 0),
          likes: Number(video.likes ?? 0),
          comments: Number(video.comments ?? 0),
          shares: Number(video.shares ?? 0),
          watchHours: Number(video.watchHours ?? 0),
          averageViewDuration: Number(video.averageViewDuration ?? 0),
          averageViewPercentage: Number(video.averageViewPercentage ?? 0),
          subscribersGained: Number(video.subscribersGained ?? 0),
          subscribersLost: Number(video.subscribersLost ?? 0)
        }
      }));

    if (updates.length === 0) return;

    await videoRepo.bulkUpdate(updates);
  }

  /** Saves one per-video snapshot for the supplied day, updating the row on retry. */
  private async createVideoSnapshots(
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

      if (!databaseVideo) {
        logWarning(`[YouTube] Snapshot skipped for video ${video.id} ("${video.title}"): not found in database lookup.`);
        continue;
      }

      snapshots.push({
        videoId: databaseVideo.id,
        views: Number.isFinite(video.views) ? video.views : 0,
        likes: Number.isFinite(video.likes) ? video.likes : 0,
        comments: Number.isFinite(video.comments) ? video.comments : 0,
        shares: Number.isFinite(video.shares) ? video.shares : 0,
        watchHours: Number.isFinite(video.watchHours) ? (video.watchHours as number) : 0,
        averageViewDuration: Number.isFinite(video.averageViewDuration) ? (video.averageViewDuration as number) : 0,
        averageViewPercentage: Number.isFinite(video.averageViewPercentage) ? (video.averageViewPercentage as number) : 0,
        subscribersGained: Number.isFinite(video.subscribersGained) ? (video.subscribersGained as number) : 0,
        subscribersLost: Number.isFinite(video.subscribersLost) ? (video.subscribersLost as number) : 0,
        snapshotDate: new Date(snapshotDate)
      });
    }

    logInfo(`[YouTube] Creating ${snapshots.length} snapshot(s).`);

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

  /** Saves today's public channel totals; YouTube does not expose historical totals. */
  private async createCurrentChannelSnapshot(channel: PublicYoutubeChannel) {
    const snapshotDate = new Date(`${formatLocalDate(new Date())}T00:00:00`);
    const snapshot: CreateYoutubeChannelSnapshot = {
      channelId: channel.channelId,
      subscriberCount: Number(channel.subscriberCount ?? 0),
      viewCount: Number(channel.viewCount ?? 0),
      videoCount: Number(channel.videoCount ?? 0),
      snapshotDate
    };

    const hasSnapshot = await channelSnapshotRepo.hasSnapshotForDate(channel.channelId, snapshotDate);

    if (hasSnapshot) {
      await channelSnapshotRepo.updateWhere(
        {
          channelId: channel.channelId,
          snapshotDate: formatLocalDate(snapshotDate)
        },
        {
          subscriberCount: snapshot.subscriberCount,
          viewCount: snapshot.viewCount,
          videoCount: snapshot.videoCount
        }
      );

      return;
    }

    await channelSnapshotRepo.bulkUpsert(
      [snapshot],
      ["subscriberCount", "viewCount", "videoCount"]
    );
  }

  /** Saves one already-fetched day of channel-wide analytics. */
  private async persistChannelAnalyticsSnapshot(
    channel: PublicYoutubeChannel,
    snapshotDate: string,
    data: YoutubeChannelAnalytics
  ) {
    const snapshotDateAsDate = new Date(`${snapshotDate}T00:00:00`);
    const snapshot: CreateYoutubeChannelAnalyticsSnapshot = {
      channelId: channel.channelId,
      views: data.views,
      watchHours: data.watchHours,
      subscribersGained: data.subscribersGained,
      subscribersLost: data.subscribersLost,
      snapshotDate: snapshotDateAsDate
    };

    const hasSnapshot = await channelAnalyticsSnapshotRepo.hasSnapshotForDate(channel.channelId, snapshotDateAsDate);

    if (hasSnapshot) {
      await channelAnalyticsSnapshotRepo.updateWhere(
        {
          channelId: channel.channelId,
          snapshotDate: formatLocalDate(snapshotDateAsDate)
        },
        {
          views: snapshot.views,
          watchHours: snapshot.watchHours,
          subscribersGained: snapshot.subscribersGained,
          subscribersLost: snapshot.subscribersLost
        }
      );

      return;
    }

    await channelAnalyticsSnapshotRepo.bulkUpsert(
      [snapshot],
      ["views", "watchHours", "subscribersGained", "subscribersLost"]
    );
  }

  async pruneExpiredSnapshots() {
    const cutoff = this.getRetentionCutoff();

    await snapshotRepo.deleteOlderThan(cutoff);
    logInfo(`[YouTube] Pruned snapshots older than ${formatLocalDate(cutoff)}.`);
  }

  private getRetentionCutoff(): Date {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - env.YOUTUBE_SNAPSHOT_RETENTION_YEARS);
    return cutoff;
  }
}