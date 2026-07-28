import { google } from "googleapis";
import { env } from "../../config/env";
import { YoutubeVideoAnalytics } from "./youtube-analytics.type";

export class YoutubeAnalyticsClient {
  private oauth2 = new google.auth.OAuth2(
    env.YOUTUBE_CLIENT_ID,
    env.YOUTUBE_CLIENT_SECRET,
    env.YOUTUBE_REDIRECT_URI
  );

  constructor() {
    this.oauth2.setCredentials({
      refresh_token: env.YOUTUBE_REFRESH_TOKEN
    });
  }

  getAuth() {
    return this.oauth2;
  }

  async getAccessToken() {
    const token = await this.oauth2.getAccessToken();

    return token.token;
  }

  getAnalytics() {
    return google.youtubeAnalytics({
      version: "v2",
      auth: this.getAuth()
    });
  }

  async getVideoAnalytics(startDate: string, endDate: string) {
    const analytics = this.getAnalytics();

    const response = await analytics.reports.query({
      ids: "channel==MINE",

      startDate,
      endDate,

      dimensions: "video",

      metrics: [
        "views",
        "estimatedMinutesWatched",
        "averageViewDuration",
        "averageViewPercentage",
        "subscribersGained",
        "subscribersLost",
        "likes",
        "comments",
        "shares"
      ].join(",")
    });

    const lookup = new Map<string, YoutubeVideoAnalytics>();

    for (const row of response.data.rows ?? []) {
      const [
        youtubeVideoId,
        views,
        watchMinutes,
        averageViewDuration,
        averageViewPercentage,
        subscribersGained,
        subscribersLost,
        likes,
        comments,
        shares
      ] = row;

      lookup.set(youtubeVideoId as string, {
        youtubeVideoId,
        views: Number(views),
        watchMinutes: Number(watchMinutes),
        watchHours: Number(watchMinutes) / 60,
        averageViewDuration: Number(averageViewDuration),
        averageViewPercentage: Number(averageViewPercentage),
        subscribersGained: Number(subscribersGained),
        subscribersLost: Number(subscribersLost),
        likes: Number(likes),
        comments: Number(comments),
        shares: Number(shares)
      });
    }

    return lookup;
  }
}