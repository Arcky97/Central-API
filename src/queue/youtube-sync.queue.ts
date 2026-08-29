import { Queue } from "bullmq";
import { redis } from "../redis";

export interface YoutubeSyncJob {
  jobId: string;
  authUserId: number;
  type: "sync" | "backfill" | "videosync";
  videoId?: string;
  startDate?: string | undefined;
}

export const youtubeSyncQueue = new Queue<YoutubeSyncJob>("youtube-sync", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 1
  }
});
