import { google } from "googleapis";
import { env } from "../../config/env";

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

  async getVideoAnalytics(videoId: string, startDate: string, endDate: string) {
    const analytics = this.getAnalytics();

    return analytics.reports.query({
      ids: "channel==MINE",

      startDate,
      endDate,

      dimensions: "video",

      filters: `video==${videoId}`,

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
  }
}