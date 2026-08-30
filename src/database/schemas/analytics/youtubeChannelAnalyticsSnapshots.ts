import { TableSchema } from "../../types/schema";

export const youtubeChannelAnalyticsSnapshotsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "youtubeChannelAnalyticsSnapshots",

  columns: {
    id: {
      type: "INT",
      primaryKey: true,
      autoIncrement: true
    },

    channelId: {
      type: "VARCHAR(50)",
      nullable: false,
      unique: true
    },

    views: {
      type: "INT",
      nullable: false
    },

    watchHours: {
      type: "INT",
      nullable: false
    },

    subscribersGained: {
      type: "INT",
      nullable: false
    },

    subscribersLost: {
      type: "INT",
      nullable: false
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
      name: "idx_channel_snapshot_date",
      columns: [
        "channelId",
        "snapshotDate"
      ],
      unique: true
    }
  ]
};