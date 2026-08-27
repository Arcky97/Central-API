import { Worker } from "bullmq";
import { redis } from "../redis";
import { YoutubeSyncJob } from "../queue/youtube-sync.queue";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { SyncJobsService } from "../services/sync-jobs.service";
import { YoutubeAccountRepository } from "../database/repositories/auth/youtubeAccountRepository";

const syncService = new YoutubeSyncService();
const youtubeAccountRepo = new YoutubeAccountRepository();

export const youtubeSyncWorker = new Worker<YoutubeSyncJob>(
  "youtube-sync",
  async (job) => {
    const { jobId, authUserId, type, startDate } = job.data;

    try {
      console.log(`[YouTube Sync Worker] Processing job ${jobId} (${type})`);

      await SyncJobsService.startJob(jobId);

      const account = await youtubeAccountRepo.getCredentialsByAuthUserId(authUserId);
      if (!account) {
        throw new Error("No connected YouTube account found for this sync job.");
      }

      if (type === "sync") {
        console.log(`[YouTube Sync Worker] Starting full sync for job ${jobId}`);
        await syncService.sync(account, jobId);
        await SyncJobsService.updateProgress(jobId, 100, "Sync completed");
      } else if (type === "backfill") {
        console.log(
          `[YouTube Sync Worker] Starting backfill from ${startDate} for job ${jobId}`
        );

        await syncService.backfillSync(account, startDate, jobId);
        await SyncJobsService.updateProgress(jobId, 100, `Backfill completed`);
      }

      await SyncJobsService.completeJob(jobId, "Sync job completed successfully");
      
      console.log(`[YouTube Sync Worker] Job ${jobId} completed successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`[YouTube Sync Worker] Job ${jobId} failed:`, errorMessage, error);
      
      await SyncJobsService.failJob(jobId, errorMessage);
      
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 1 // Only one sync job at a time
  }
);

// Log worker events for debugging
youtubeSyncWorker.on("completed", (job) => {
  console.log(`[YouTube Sync Worker] Job ${job.id} completed`);
});

youtubeSyncWorker.on("failed", (job, error) => {
  console.error(
    `[YouTube Sync Worker] Job ${job?.id} failed:`,
    error
  );
});

youtubeSyncWorker.on("error", (error) => {
  console.error("[YouTube Sync Worker] Error:", error);
});
