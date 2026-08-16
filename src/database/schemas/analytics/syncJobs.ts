import type { TableSchema } from "../../types/schema";

export const syncJobsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "syncJobs",
  columns: {
    id: {
      type: "VARCHAR(36)",
      primaryKey: true
    },
    type: {
      type: "VARCHAR(50)",
      nullable: false
    },
    status: {
      type: "VARCHAR(20)",
      default: "'queued'",
      nullable: false
    },
    progress: {
      type: "INT"
    },
    currentItem: {
      type: "VARCHAR(255)"
    },
    message: {
      type: "VARCHAR(500)"
    },
    errorMessage: {
      type: "TEXT"
    },
    createdAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },
    startedAt: {
      type: "TIMESTAMP"
    },
    finishedAt: {
      type: "TIMESTAMP"
    },
    updatedAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_status",
      columns: ["status"]
    },
    {
      name: "idx_type",
      columns: ["type"]
    },
    {
      name: "idx_created_at",
      columns: ["createdAt"]
    }
  ]
};
