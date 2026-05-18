import { Worker } from "bullmq";
import { ProjectUpdatesRepository } from "../database/repositories/core/ProjectUpdatesRepository";
import { CreateProjectUpdate } from "../database/types/project-updates.type";
import { redis } from "../redis";

const repo = new ProjectUpdatesRepository();

const buffer: CreateProjectUpdate[] = [];

const FLUSH_SIZE = 100;
const FLUSH_INTERVAL = 5000;

async function flush() {
  if (buffer.length === 0) return;

  console.log(`[SUCCESS] flushing ${buffer.length} project-update request(s).`);

  const batch = buffer.splice(0, buffer.length);

  await repo.bulkCreate(batch);
}

setInterval(() => {
  flush().catch(err => {
    console.error("Failed to flush project updates batch:", err);
  })
}, FLUSH_INTERVAL);

export const projectUpdatesWorker = new Worker<CreateProjectUpdate>("project-updates",
  async job => {
    console.log("[SUCCESS] job received for project-updates");
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