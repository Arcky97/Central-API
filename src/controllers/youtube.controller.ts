import { Request, Response } from "express";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { YoutubeService } from "../services/youtube.service";
import { getYoutubeVideoSchema } from "../schema/youtube.schema";
import { youtubeAnalyticsClient } from "../clients/youtube";

export class YoutubeController {
  static async sync(req: Request, res: Response) {
    const service = new YoutubeSyncService();

    await service.sync();

    res.json({
      success: true,
      message: "YouTube synchronization completed."
    });
  }

  static async getChannel(req: Request, res: Response) {
    const channel = await YoutubeService.getChannel();

    res.json(channel);
  }

  static async getVideos(req: Request, res: Response) {
    const videos = await YoutubeService.getVideos();

    res.json(videos);
  }

  static async getVideo(req: Request, res: Response) {
    const { videoId } = getYoutubeVideoSchema.parse(req.params);

    const video = await YoutubeService.getVideo(videoId);

    res.json(video);
  }

  static async getSnapshots(req: Request, res: Response) {
    const { videoId } = getYoutubeVideoSchema.parse(req.params);

    const snapshots = await YoutubeService.getSnapshots(videoId);

    res.json(snapshots);
  }

  static async testAnalytics(req: Request, res: Response) {
    const token = await youtubeAnalyticsClient.getAccessToken();

    const result = await youtubeAnalyticsClient.getVideoAnalytics(
      "2026-06-29",
      "2026-07-27"
    );

    console.log(result);
    
    res.json({
      success: true,
      accessToken: token
    });
  }
}