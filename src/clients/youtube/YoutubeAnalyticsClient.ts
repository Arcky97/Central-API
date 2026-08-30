import { google } from "googleapis";
import { env } from "../../config/env";
import { YoutubeChannelAnalytics, YoutubeVideoAnalytics } from "./youtube-analytics.type";

export class YoutubeAnalyticsClient {
  private oauth2 = new google.auth.OAuth2(
    env.YOUTUBE_CLIENT_ID,
    env.YOUTUBE_CLIENT_SECRET,
    env.YOUTUBE_REDIRECT_URI
  );

  constructor(refreshToken = env.YOUTUBE_REFRESH_TOKEN) {
    this.oauth2.setCredentials({
      refresh_token: refreshToken
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

    const lookup = new Map<string, YoutubeVideoAnalytics>();
    let startIndex = 1;

    do {
      const response = await analytics.reports.query({
        ids: `channel==MINE`,
        startDate,
        endDate,
        dimensions: "video",
        metrics: [
          "views",
          "estimatedMinutesWatched",
          "averageViewDuration",
          "averageViewPercentage",
          "likes",
          "comments",
          "shares",
          "subscribersGained",
          "subscribersLost"
        ].join(","),
        sort: "-views",
        maxResults: 200
      });

      for (const row of response.data.rows ?? []) {
      const [
        videoId,
        views,
        watchMinutes,
        averageViewDuration,
        averageViewPercentage,
        likes,
        comments,
        shares,
        subscribersGained,
        subscribersLost
      ] = row;

        lookup.set(videoId as string, {
        videoId,
        views: Number(views),
        watchHours: Number(watchMinutes) / 60,
        averageViewDuration: Number(averageViewDuration),
        averageViewPercentage: Number(averageViewPercentage),
        likes: Number(likes),
        comments: Number(comments),
        shares: Number(shares),
        subscribersGained: Number(subscribersGained),
        subscribersLost: Number(subscribersLost)
        });
      }

      const rowCount = response.data.rows?.length ?? 0;
      startIndex += rowCount;
      if (rowCount < 200) break;
    } while (true);

    return lookup;
  }

  async getChannelAnalytics(startDate: string, endDate: string) {
    const analytics = this.getAnalytics();


    const response = await analytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "day",
      metrics: [
        "views",
        "estimatedMinutesWatched",
        "subscribersGained",
        "subscribersLost"
      ].join(","),
      sort: "day"
    });

    return (response.data.rows ?? []).map(row => {
      const [
        date,
        views,
        estimatedMinutesWatched,
        subscribersGained,
        subscribersLost
      ] = row;

      return {
        date: date as string,
        views: Number(views),
        watchHours: Number(estimatedMinutesWatched) / 60,
        subscribersGained: Number(subscribersGained),
        subscribersLost: Number(subscribersLost)
      };
    });
  }
}