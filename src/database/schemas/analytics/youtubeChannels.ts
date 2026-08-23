import type { TableSchema } from "../../types/schema";

export const youtubeChannelsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "youtubeChannels",

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

    channelName: {
      type: "VARCHAR(100)",
      nullable: false
    },

    description: {
      type: "TEXT",
      nullable: true
    },

    thumbnailUrl: {
      type: "VARCHAR(2048)",
      nullable: true
    },

    customUrl: {
      type: "VARCHAR(128)",
      nullable: true
    },

    publishedAt: {
      type: "TIMESTAMP",
      nullable: true
    },

    subscriberCount: {
      type: "INT",
      nullable: true
    },

    viewCount: {
      type: "INT",
      nullable: true
    },

    videoCount: {
      type: "INT",
      nullable: true
    },

    createdAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },

    updatedAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP"
    }
  }
};