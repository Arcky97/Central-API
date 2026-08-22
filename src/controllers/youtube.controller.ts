import { Request, Response } from "express";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { YoutubeService } from "../services/youtube.service";
import { getGoalProfileSchema, getGoalProfileUpdateSchema, getYoutubeSyncSchema, getYoutubeVideoSchema, getYoutubeVideoUpdateSchema } from "../schema/youtube.schema";
import { removeUndefined } from "../database/utils/removeUndefined";
import { AuthRequest } from "../middleware/jwt";
import { YoutubeAccountRepository } from "../database/repositories/auth/youtubeAccountRepository";

const youtubeAccountRepo = new YoutubeAccountRepository();

export class YoutubeController {
  static async sync(req: AuthRequest, res: Response) {
    if (!req.authUserId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const account = await youtubeAccountRepo.getCredentialsByAuthUserId(req.authUserId);
    if (!account) {
      return res.status(404).json({ success: false, message: "No connected YouTube account found" });
    }

    const service = new YoutubeSyncService();

    await service.sync(account);

    res.json({
      success: true,
      message: "YouTube synchronization completed."
    });
  }

  static async backfillSync(req: AuthRequest, res: Response) {
    if (!req.authUserId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const account = await youtubeAccountRepo.getCredentialsByAuthUserId(req.authUserId);
    if (!account) {
      return res.status(404).json({ success: false, message: "No connected YouTube account found" });
    }

    const service = new YoutubeSyncService();

    console.log("Backfill sync request received");
    const { date } = getYoutubeSyncSchema.parse(req.params);
    await service.backfillSync(account, date);

    res.json({
      success: true,
      message: `Youtube synchronization completed from ${date} up until ${new Date()}`
    })
  }

  static async getChannel(req: Request, res: Response) {
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const channel = await YoutubeService.getChannel(account.channelId);

    res.json(channel);
  }

  static async getVideos(req: Request, res: Response) {
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const videos = await YoutubeService.getVideos(account.channelId);

    res.json(videos);
  }

  static async getVideo(req: Request, res: Response) {
    const { videoId } = getYoutubeVideoSchema.parse(req.params);
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const video = await YoutubeService.getVideo(videoId, account.channelId);

    res.json(video);
  }

  static async updateVideo(req: AuthRequest, res: Response) {
    const { videoId } = getYoutubeVideoSchema.parse(req.params);
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const data = getYoutubeVideoUpdateSchema.parse(req.body);
    const updateData = removeUndefined(data);
    const updated = await YoutubeService.updateVideo(videoId, account.channelId, updateData);
    if (!updated) return res.status(404).json({ success: false, message: "Video not found for this channel" });

    res.json({
      success: true,
      message: `Youtube video with id: "${videoId}" updated successfully!`
    });
  }

  static async getGoalProfile(req: AuthRequest, res: Response) {
    const { goalProfileId } = getGoalProfileSchema.parse(req.params);
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const profile = await YoutubeService.getGoalProfile(goalProfileId, account.channelId);

    res.json(profile);
  }

  static async createGoalProfile(req: AuthRequest, res: Response) {
    const data = getGoalProfileUpdateSchema.parse(req.body);
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const updateData = removeUndefined(data);
    const created = await YoutubeService.addGoalProfile(account.channelId, updateData);
    if (!created) return res.status(404).json({ success: false, message: "YouTube channel not found" });

    res.status(201).json({
      success: true,
      message: `Youtube goal profile added successfully!`
    });
  }

  static async updateGoalProfile(req: AuthRequest, res: Response) {
    const { goalProfileId } = getGoalProfileSchema.parse(req.params)
    const data = getGoalProfileUpdateSchema.parse(req.body);
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;
    const updateData = removeUndefined(data);

    const updated = await YoutubeService.updateGoalProfile(goalProfileId, account.channelId, updateData);
    if (!updated) return res.status(404).json({ success: false, message: "Goal profile not found" });

    res.json({ success: true, message: "Youtube goal profile updated successfully!" });
  }

  static async removeGoalProfile(req: AuthRequest, res: Response) {
    const { goalProfileId } = getGoalProfileSchema.parse(req.params);
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const removed = await YoutubeService.removeGoalProfile(goalProfileId, account.channelId);
    if (!removed) return res.status(404).json({ success: false, message: "Goal profile not found" });

    res.json({ success: true, message: "Youtube goal profile removed successfully!" });
  }

  static async getSnapshots(req: Request, res: Response) {
    const { videoId } = getYoutubeVideoSchema.parse(req.params);
    const account = await YoutubeController.getAccount(req, res);
    if (!account) return;

    const snapshots = await YoutubeService.getSnapshots(videoId, account.channelId);

    res.json(snapshots);
  }

  static async hello(req: Request, res: Response) {
    res.status(201).json({
      success: true,
      message: "Hello from the API!"
    })
  }

  private static async getAccount(req: Request, res: Response) {
    const authUserId = (req as AuthRequest).authUserId;
    if (!authUserId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return null;
    }

    const account = await youtubeAccountRepo.getByAuthUserId(authUserId);
    if (!account) {
      res.status(404).json({ success: false, message: "No connected YouTube account found" });
      return null;
    }

    return account;
  }
}