import { Request, Response } from "express";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { YoutubeService } from "../services/youtube.service";
import { getGoalProfileSchema, getGoalProfileUpdateSchema, getYoutubeSyncSchema, getYoutubeVideoSchema, getYoutubeVideoUpdateSchema } from "../schema/youtube.schema";
import { youtubeAnalyticsClient } from "../clients/youtube";
import { removeUndefined } from "../database/utils/removeUndefined";

export class YoutubeController {
  static async sync(req: Request, res: Response) {
    const service = new YoutubeSyncService();

    await service.sync();

    res.json({
      success: true,
      message: "YouTube synchronization completed."
    });
  }

  static async backfillSync(req: Request, res: Response) {
    const service = new YoutubeSyncService();

    const { date } = getYoutubeSyncSchema.parse(req.params);
    await service.backfillSync(date);

    res.json({
      success: true,
      message: `Youtube synchronization completed from ${date} up until ${new Date()}`
    })
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

  static async updateVideo(req: Request, res: Response) {
    const { videoId } = getYoutubeVideoSchema.parse(req.params);

    const data = getYoutubeVideoUpdateSchema.parse(req.body);
    const updateData = removeUndefined(data);
    await YoutubeService.updateVideo(videoId, updateData);

    res.json({
      success: true,
      message: `Youtube video with id: "${videoId}" updated successfully!`
    });
  }

  static async getGoalProfile(req: Request, res: Response) {
    const { goalProfileId } = getGoalProfileSchema.parse(req.params);

    const profile = await YoutubeService.getGoalProfile(goalProfileId);

    res.json(profile);
  }

  static async createGoalProfile(req: Request, res: Response) {
    const data = getGoalProfileUpdateSchema.parse(req.body);

    const updateData = removeUndefined(data);
    await YoutubeService.addGoalProfile(updateData);

    res.status(201).json({
      success: true,
      message: `Youtube goal profile added successfully!`
    });
  }

  static async updateGoalProfile(req: Request, res: Response) {
    const { goalProfileId } = getGoalProfileSchema.parse(req.params)
    const data = getGoalProfileUpdateSchema.parse(req.body);
    const updateData = removeUndefined(data);

    await YoutubeService.updateGoalProfile(goalProfileId, updateData)
  }

  static async removeGoalProfile(req: Request, res: Response) {
    const { goalProfileId } = getGoalProfileSchema.parse(req.params);
    await YoutubeService.removeGoalProfile(goalProfileId);
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
    
    res.json({
      success: true,
      accessToken: token
    });
  }

  static async hello(req: Request, res: Response) {
    res.status(201).json({
      success: true,
      message: "Hello from the API!"
    })
  }
}