import { SyncJobRow, CreateSyncJob, UpdateSyncJob, PublicSyncJob, SyncJobStatus } from "../../types/sync-job.type";
import { Repository } from "../base/Repository";

export class SyncJobRepository extends Repository<SyncJobRow, CreateSyncJob, UpdateSyncJob, PublicSyncJob> {
  constructor() {
    super("syncJobs", "analytics");
  }

  async getById(id: string): Promise<PublicSyncJob | null> {
    return this.findOne({ id });
  }

  async getByStatus(status: SyncJobStatus): Promise<PublicSyncJob[]> {
    return this.findMany({ status });
  }

  async getLatestSync(): Promise<PublicSyncJob | null> {
    const result = await this.findMany({}, 1);
    return result[0] ?? null;
  }
}
