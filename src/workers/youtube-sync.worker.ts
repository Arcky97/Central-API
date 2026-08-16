import { Worker } from "bullmq";
import { redis } from "../redis";
import { YoutubeSyncJob } from "../queue/youtube-sync.queue";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { SyncJobsService } from "../services/sync-jobs.service";

const syncService = new YoutubeSyncService();

export const youtubeSyncWorker = new Worker<YoutubeSyncJob>(
  "youtube-sync",
  async (job) => {
    const { jobId, type, startDate } = job.data;

    try {
      console.log(`[YouTube Sync Worker] Processing job ${jobId} (${type})`);

      await SyncJobsService.startJob(jobId);

      if (type === "sync") {
        console.log(`[YouTube Sync Worker] Starting full sync for job ${jobId}`);
        await syncService.sync();
        await SyncJobsService.updateProgress(jobId, 100, "Sync completed");
      } else if (type === "backfill") {
        if (!startDate) {
          throw new Error("Start date is required for backfill jobs");
        }

        console.log(
          `[YouTube Sync Worker] Starting backfill from ${startDate} for job ${jobId}`
        );
        
        await syncService.backfillSync(startDate);
        await SyncJobsService.updateProgress(jobId, 100, `Backfill completed`);
      }

      await SyncJobsService.completeJob(jobId, "Sync job completed successfully");
      
      console.log(`[YouTube Sync Worker] Job ${jobId} completed successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`[YouTube Sync Worker] Job ${jobId} failed:`, errorMessage);
      
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
    error.message
  );
});

youtubeSyncWorker.on("error", (error) => {
  console.error("[YouTube Sync Worker] Error:", error);
});
