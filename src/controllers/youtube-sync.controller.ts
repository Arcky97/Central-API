import { Request, Response } from "express";
import { SyncJobsService } from "../services/sync-jobs.service";
import { youtubeSyncQueue } from "../queue/youtube-sync.queue";
import { AuthRequest } from "../middleware/jwt";
import { getYoutubeSyncSchema } from "../schema/youtube.schema";

export class YoutubeSyncController {
  /**
   * POST /v1/youtube/sync
   * Start a full YouTube sync job
   */
  static async startSync(req: AuthRequest, res: Response) {
    try {
      if (!req.authUserId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      // Create job record
      const job = await SyncJobsService.createJob(
        req.authUserId,
        "youtube_sync",
        "YouTube sync job queued"
      );

      // Enqueue the actual work
      await youtubeSyncQueue.add("sync", {
        jobId: job.id,
        authUserId: req.authUserId,
        type: "sync"
      });

      res.status(202).json({
        success: true,
        jobId: job.id,
        status: job.status,
        message: "Sync job queued"
      });
    } catch (error) {
      console.error("[YouTube Sync Controller] Error starting sync:", error);
      res.status(500).json({
        success: false,
        message: "Failed to start sync job",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * POST /v1/youtube/sync/fill/:date
   * Start a YouTube backfill job from a specific date
   */
  static async startBackfill(req: AuthRequest, res: Response) {
    try {
      if (!req.authUserId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const date = req.params.date as string | undefined;

      const parsedDate = getYoutubeSyncSchema.safeParse({ date });
      if (!parsedDate.success) {
        return res.status(400).json({
          success: false,
          message: parsedDate.error.issues[0]?.message ?? "Invalid backfill date"
        });
      }

      // Create job record
      const job = await SyncJobsService.createJob(
        req.authUserId,
        "youtube_backfill",
        `YouTube backfill from ${date} queued`
      );

      // Enqueue the actual work
      await youtubeSyncQueue.add("backfill", {
        jobId: job.id,
        authUserId: req.authUserId,
        type: "backfill",
        startDate: parsedDate.data.date
      });

      res.status(202).json({
        success: true,
        jobId: job.id,
        status: job.status,
        message: `Backfill job from ${date} queued`
      });
    } catch (error) {
      console.error("[YouTube Sync Controller] Error starting backfill:", error);
      res.status(500).json({
        success: false,
        message: "Failed to start backfill job",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * GET /v1/youtube/sync/jobs/:jobId
   * Get the status and progress of a sync job
   */
  static async getJobStatus(req: AuthRequest, res: Response) {
    try {
      const jobId = req.params.jobId as string | undefined;

      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: "Job ID is required"
        });
      }

      if (!req.authUserId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const job = await SyncJobsService.getJob(jobId, req.authUserId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found"
        });
      }

      res.json({
        success: true,
        jobId: job.id,
        type: job.type,
        status: job.status,
        progress: job.progress,
        currentItem: job.currentItem,
        message: job.message,
        errorMessage: job.errorMessage,
        createdAt: job.createdAt,
        startedAt: job.startedAt,
        finishedAt: job.finishedAt,
        updatedAt: job.updatedAt
      });
    } catch (error) {
      console.error("[YouTube Sync Controller] Error getting job status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get job status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}
