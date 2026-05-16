import { Worker } from "bullmq";
import { PageVisitsRepository } from "../database/repositories/analytics/PageVisitsRepository";
import { PageVisitEvent } from "../queue/page-visits.queue";
import { redis } from "../redis";

const repo = new PageVisitsRepository();

const buffer: PageVisitEvent[] = [];

const FLUSH_SIZE = 100;
const FLUSH_INTERVAL = 5000;

async function flush() {
  if (buffer.length === 0) return;

  const batch = buffer.splice(0, buffer.length);

  await repo.bulkCreate(batch);
}

setInterval(() => {
  flush().catch(err => {
    console.error("Failed to flush page visits batch:", err);
  });
}, FLUSH_INTERVAL);

export const pageVisitsWorker = new Worker<PageVisitEvent>(
  "page-visits",
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