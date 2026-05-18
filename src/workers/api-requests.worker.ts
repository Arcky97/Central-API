import { Worker } from "bullmq";
import { ApiRequestRepository } from "../database/repositories/analytics/ApiRequestsRepository";
import { CreateApiRequest } from "../database/types/api-requests.type";
import { redis } from "../redis";

const repo = new ApiRequestRepository();

const buffer: CreateApiRequest[] = [];

const FLUSH_SIZE = 100;
const FLUSH_INTERVAL = 5000;

async function flush() {
  if (buffer.length === 0) return;

  console.log(`[SUCCESS] flushing ${buffer.length} api-requests request(s)`);

  const batch = buffer.splice(0, buffer.length);

  await repo.bulkCreate(batch);
}

setInterval(() => {
  flush().catch(err => {
    console.error("Failed to flush api requests batch:", err);
  });
}, FLUSH_INTERVAL);

export const apiRequestsWorker = new Worker<CreateApiRequest>(
  "api-requests",
  async job => {
    console.log("[SUCCESS] job received for api-requests.");
    buffer.push(job.data);

    if (buffer.length >= FLUSH_SIZE) {
      await flush();
    }
  },
  {
    connection: redis,
    concurrency: 10
  }
)