import { Worker } from "bullmq";
import { PageVisitsRepository } from "../database/repositories/analytics/PageVisitsRepository";
import { CreatePageVisit } from "../database/types/page-visits.type";
import { redis } from "../redis";

const repo = new PageVisitsRepository();

const buffer: CreatePageVisit[] = [];

const FLUSH_SIZE = 100;
const FLUSH_INTERVAL = 5000;

async function flush() {
  if (buffer.length === 0) return;

  console.log(`[SUCCESS] flushing ${buffer.length} page-visit request(s).`);

  const batch = buffer.splice(0, buffer.length);

  await repo.bulkCreate(batch);
}

setInterval(() => {
  flush().catch(err => {
    console.error("Failed to flush page visits batch:", err);
  });
}, FLUSH_INTERVAL);

export const pageVisitsWorker = new Worker<CreatePageVisit>(
  "page-visits",
  async job => {
    console.log("[SUCCESS] job received for page-visits");
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