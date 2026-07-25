import { YoutubeClient } from "../clients/youtube/YoutubeClient";
import { env } from "../config/env";

import { YoutubeChannelRepository } from "../database/repositories/analytics/YoutubeChannelRepository";
import { YoutubeVideoRepository } from "../database/repositories/analytics/YoutubeVideoRepository";
import { YoutubeVideo } from "../clients/youtube/youtube.types";

  const youtubeClient = new YoutubeClient(
    env.YOUTUBE_API_KEY
  );

  const channelRepo =
    new YoutubeChannelRepository();

  const videoRepo = 
    new YoutubeVideoRepository();

export class YoutubeSyncService {
  async sync() {
    await this.syncChannel();
    await this.syncVideos();
  }

  private async syncChannel() {
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

      return;
    } 

      await channelRepo.updateWhere(
        {
          channelId: channel.id
        },
        {
          channelName: channel.title
        }
      )
  }

  private async syncVideos() {
    const videos = await this.fetchVideos();
  } 

  private async fetchVideos(): Promise<YoutubeVideo[]> {
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
        const stats = 
          statistics.get(video.id);
        
        if (!stats) return;

        video.views = stats.views;
        video.likes=  stats.likes;
        video.comments = stats.comments;
      });
      
      pageToken = page.nextPageToken;
    } while (pageToken);

    return videos;
  }
}