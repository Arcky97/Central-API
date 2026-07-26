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
      type: "INT",
      default: "0"
    },

    likes: {
      type: "INT",
      default: "0"
    },

    comments: {
      type: "INT",
      default: "0",
    },

    watchHours: {
      type: "DECIMAL(10,2)",
      default: "0"
    },

    averageViewDuration: {
      type: "INT",
      default: "0"
    },

    impressions: {
      type: "INT",
      default: "0"
    },

    clickThroughRate: {
      type: "DECIMAL(5,2)",
      default: "0"
    },

    subscribersGained: {
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