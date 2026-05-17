import { Worker } from "bullmq";
import { ApiRequestRepository } from "../database/repositories/analytics/ApiRequestsRepository";
import { CreateApiRequest } from "../database/types/api-requests.type";
import { redis } from "../redis";



const repo = new ApiRequestRepository();

const buffer: CreateApiRequest[] = [];

const FLUSH_SIZE = 50;
const FLUSH_INTERVAL = 3000;

async function flush() {
  if (buffer.length === 0) return;

  const batch = buffer.splice(0, buffer.length);

  await repo.bulkCreate(batch);
}

setInterval(() => {
  flush().catch(err => {
    console.error("failed to flush api requests batch:", err);
  });
}, FLUSH_INTERVAL);

export const apiRequestsWorker = new Worker<CreateApiRequest>(
  "api-requests",
  async job => {
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