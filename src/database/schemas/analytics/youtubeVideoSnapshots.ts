import type { TableSchema } from "../../types/schema";

export const youtubeVideoSnapshotsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "youtubeVideoSnapshots",

  columns: {
    id: {
      type: "INT",
      primaryKey: true,
      autoIncrement: true
    },

    videoId: {
      type: "INT",
      nullable: false
    },

    views: {
      type: "BIGINT",
      default: "0"
    },

    likes: {
      type: "BIGINT",
      default: "0"
    },

    comments: {
      type: "BIGINT",
      default: "0",
    },

    shares: {
      type: "BIGINT",
      default: "0"
    },

    watchHours: {
      type: "DECIMAL(10,2)",
      default: "0"
    },

    averageViewDuration: {
      type: "INT",
      default: "0"
    },

    averageViewPercentage: {
      type: "DECIMAL(10,2)",
      default: "0"
    },

    subscribersGained: {
      type: "INT",
      default: "0"
    },

    subscribersLost: {
      type: "INT",
      default: "0"
    },

    snapshotDate: {
      type: "DATE",
      nullable: false
    },

    createdAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },

    updatedAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    }
  },

  indexes: [
    {
      name: "idx_video_snapshot_date",
      columns: [
        "videoId",
        "snapshotDate"
      ],
      unique: true
    }
  ]
};