import { Queue } from "bullmq";
import { redis } from "../redis";

export interface YoutubeSyncJob {
  jobId: string;
  type: "sync" | "backfill";
  startDate?: string;
}

export const youtubeSyncQueue = new Queue<YoutubeSyncJob>("youtube-sync", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 1
  }
});
