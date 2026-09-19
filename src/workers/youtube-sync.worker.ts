import { Worker } from "bullmq";
import { redis } from "../redis";
import { YoutubeSyncJob } from "../queue/youtube-sync.queue";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { SyncJobsService } from "../services/sync-jobs.service";
import { YoutubeAccountRepository } from "../database/repositories/auth/youtubeAccountRepository";

const syncService = new YoutubeSyncService();
const youtubeAccountRepo = new YoutubeAccountRepository();

// Bounds how long a single job may run; concurrency is 1, so a hung external
// call (YouTube API/OAuth) would otherwise block every later job forever.
const JOB_TIMEOUT_MS = 2 * 60 * 1000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export const youtubeSyncWorker = new Worker<YoutubeSyncJob>(
  "youtube-sync",
  async (job) => {
    const { jobId, authUserId, type, startDate, videoId } = job.data;

    try {
      console.log(`[YouTube Sync Worker] Processing job ${jobId} (${type})`);

      await SyncJobsService.startJob(jobId);

      const account = await youtubeAccountRepo.getCredentialsByAuthUserId(authUserId);
      if (!account) {
        throw new Error("No connected YouTube account found for this sync job.");
      }

      if (type === "sync") {
        console.log(`[YouTube Sync Worker] Starting full sync for job ${jobId}`);
        await withTimeout(syncService.sync(account, jobId), JOB_TIMEOUT_MS, "Sync");
        await SyncJobsService.updateProgress(jobId, 100, "Sync completed");
      } else if (type === "backfill") {
        console.log(
          `[YouTube Sync Worker] Starting backfill${videoId ? ` for video ${videoId}` : ""} from ${startDate ?? "video publish date"} for job ${jobId}`
        );

        await withTimeout(syncService.backfillSync(account, { videoId, startDate, jobId }), JOB_TIMEOUT_MS, "Backfill");
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
