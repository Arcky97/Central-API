import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env";
import { YoutubeChannel, YoutubePagedResult, YoutubeVideo } from "./youtube.types";

export class YoutubeClient {
  private readonly client: AxiosInstance;

  constructor(
    private readonly apiKey: string
  ) {
    this.client = axios.create({
      baseURL: env.YOUTUBE_BASE_URL,
      timeout: 10000
    });
  }

  private async get<T>(endpoint: string, params: Record<string, unknown>): Promise<T> {
    const { data } = await this.client.get<T>(endpoint, {
      params: {
        ...params,
        key: this.apiKey
      }
    });

    return data;
  }

  async getChannel(channelId: string): Promise<YoutubeChannel> {
    const data = await this.get<any>("/channels", {
      part: "snippet,statistics",
      id: channelId
    });

    const channel = data.items[0];

    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails.high.url,
      customUrl: channel.snippet.customUrl,
      publishedAt: new Date(channel.snippet.publishedAt),
      subscriberCount: Number(channel.statistics.subscriberCount),
      viewCount: Number(channel.statistics.viewCount),
      videoCount: Number(channel.statistics.videoCount)
    };
  }

  async getUploadsPlaylistId(channelId: string): Promise<string> {
    const data = await this.get<any>("/channels", {
      part: "contentDetails",
      id: channelId
    });

    return data.items[0]
      .contentDetails
      .relatedPlaylists
      .uploads;
  }

  async getPlaylistVideos(playlistId: string, pageToken?: string): Promise<YoutubePagedResult<YoutubeVideo>> {
    const data = await this.get<any>(
      "/playlistItems",
      {
        part: "snippet",
        playlistId,
        maxResult: 50,
        pageToken
      }
    );

    return {
      nextPageToken: data.nextPageToken,

      items: data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        publishedAt: new Date(item.snippet.publishedAt),
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        views: 0,
        likes: 0,
        comments: 0,
      }))
    };
  }

  async getVideoStatistics(ids: string[]): Promise<Map<string, {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>> {
    const data = await this.get<any>(
      "/videos",
      {
        part: "statistics",
        id: ids.join(",")
      }
    );

    return new Map(
      data.items.map((item: any) => [
        item.id,
        {
          views: Number(item.statistics.viewCount),
          likes: Number(item.statistics.likeCount ?? 0),
          comments: Number(item.statistics.commentCount ?? 0),
        }
      ])
    );
  }

  async getComments(videoId: string) {

  }

  async getChannelAnalytics() {

  }

  async getVideoAnalytics() {

  }
}