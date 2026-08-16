import { RowDataPacket } from "mysql2";

export type SyncJobType = "youtube_sync" | "youtube_backfill";
export type SyncJobStatus = "queued" | "running" | "completed" | "failed";

export interface SyncJobRow extends RowDataPacket {
  id: string;
  type: SyncJobType;
  status: SyncJobStatus;
  progress?: number | null;
  currentItem?: string | null;
  message?: string | null;
  errorMessage?: string | null;
  createdAt: Date;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  updatedAt: Date;
}

export interface CreateSyncJob {
  id: string;
  type: SyncJobType;
  status: SyncJobStatus;
  progress?: number | null;
  currentItem?: string | null;
  message?: string | null;
  createdAt?: Date;
}

export interface UpdateSyncJob {
  status?: SyncJobStatus;
  progress?: number | null;
  currentItem?: string | null;
  message?: string | null;
  errorMessage?: string | null;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  updatedAt?: Date;
}

export interface PublicSyncJob {
  id: string;
  type: SyncJobType;
  status: SyncJobStatus;
  progress?: number | null;
  currentItem?: string | null;
  message?: string | null;
  errorMessage?: string | null;
  createdAt: Date;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  updatedAt: Date;
}
