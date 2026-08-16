import { v4 as uuidv4 } from "uuid";
import { SyncJobRepository } from "../database/repositories/analytics/SyncJobRepository";
import { SyncJobType, SyncJobStatus, PublicSyncJob, UpdateSyncJob } from "../database/types/sync-job.type";

const repo = new SyncJobRepository();

export class SyncJobsService {
  /**
   * Create a new sync job
   */
  static async createJob(type: SyncJobType, message?: string): Promise<PublicSyncJob> {
    const jobId = uuidv4();
    const now = new Date();

    await repo.create({
      id: jobId,
      type,
      status: "queued",
      message: message ?? `${type} job queued`,
      progress: 0,
      createdAt: now
    });

    const job = await repo.getById(jobId);
    if (!job) throw new Error("Failed to create job");

    return job;
  }

  /**
   * Get job status
   */
  static async getJob(jobId: string): Promise<PublicSyncJob | null> {
    return repo.getById(jobId);
  }

  /**
   * Update job status and progress
   */
  static async updateJob(jobId: string, updates: UpdateSyncJob): Promise<void> {
    const now = new Date();

    const updateData: UpdateSyncJob = {
      ...updates,
      updatedAt: now
    };

    // Set startedAt if transitioning to running
    if (updates.status === "running") {
      const job = await repo.getById(jobId);
      if (job && !job.startedAt) {
        updateData.startedAt = now;
      }
    }

    // Set finishedAt if transitioning to completed or failed
    if (updates.status === "completed" || updates.status === "failed") {
      const job = await repo.getById(jobId);
      if (job && !job.finishedAt) {
        updateData.finishedAt = now;
      }
    }

    await repo.updateWhere({ id: jobId }, updateData);
  }

  /**
   * Mark job as running
   */
  static async startJob(jobId: string): Promise<void> {
    await this.updateJob(jobId, { status: "running" });
  }

  /**
   * Mark job as completed with optional progress
   */
  static async completeJob(jobId: string, message?: string): Promise<void> {
    await this.updateJob(jobId, {
      status: "completed",
      progress: 100,
      message: message ?? "Sync completed successfully"
    });
  }

  /**
   * Mark job as failed with error message
   */
  static async failJob(jobId: string, error: Error | string): Promise<void> {
    const errorMessage = typeof error === "string" ? error : error.message;

    await this.updateJob(jobId, {
      status: "failed",
      errorMessage,
      message: "Sync failed"
    });
  }

  /**
   * Update progress and current item
   */
  static async updateProgress(
    jobId: string,
    progress: number,
    currentItem?: string
  ): Promise<void> {
    await this.updateJob(jobId, {
      progress: Math.min(100, Math.max(0, progress)),
      currentItem: currentItem ?? null
    });
  }
}
