import { Worker } from "bullmq";
import { ApiAuthFailureRepository } from "../database/repositories/analytics/ApiAuthFailureRepository";
import { CreateApiAuthFailure } from "../database/types/api-auth-failures.type";
import { redis } from "../redis";

const repo = new ApiAuthFailureRepository();

const buffer: CreateApiAuthFailure[]= [];

const FLUSH_SIZE = 100;
const FLUSH_INTERVAL = 5000;

async function flush() {
  if (buffer.length === 0) return;
  
  console.log(`[SUCCESS] flushing ${buffer.length} api-auth-failures request(s)`);

  const batch = buffer.splice(0, buffer.length);

  await repo.bulkCreate(batch);
}

setInterval(() => {
  flush().catch(err => {
    console.error("Failed to flush api auth failures batch:", err);
  })
}, FLUSH_INTERVAL);

export const apiAuthFailuresWorker = new Worker<CreateApiAuthFailure>("api-auth-failures",
  async job => {
    console.log("[SUCCESS] job received for api-auth-failures.");
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