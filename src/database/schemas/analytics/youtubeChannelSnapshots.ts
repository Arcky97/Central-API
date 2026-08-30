import { TableSchema } from "../../types/schema";

export const youtubeChannelSnapshotsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "youtubeChannelSnapshots",

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

    subscriberCount: {
      type: "INT",
      nullable: false
    },

    viewCount: {
      type: "BIGINT",
      nullable: false
    },

    videoCount: {
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