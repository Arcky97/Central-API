import { TableSchema } from "../../types/schema";

export const youtubeVideosSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "youtubeVideos",

  columns: {
    id: {
      type: "INT",
      primaryKey: true,
      autoIncrement: true
    },

    channelId: {
      type: "INT",
      nullable: false
    },

    videoId: {
      type: "VARCHAR(20)",
      nullable: false,
      unique: true
    },

    goalProfileId: {
      type: "INT",
      nullable: true
    },

    playlistIds: {
      type: "JSON",
      nullable: true
    },

    title: {
      type: "VARCHAR(255)",
      nullable: false
    },

    description: {
      type: "TEXT",
      nullable: true
    },

    thumbnailUrl: {
      type: "TEXT",
      nullable: true
    },

    durationSeconds: {
      type: "INT",
      nullable: false
    },

    isShort: {
      type: "TINYINT",
      default: "0"
    },

    isShortOverride: {
      type: "TINYINT",
      nullable: true
    },

    publishedAt: {
      type: "TIMESTAMP",
      nullable: false
    },

    trackAnalytics: {
      type: "TINYINT(1)",
      default: "1"
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
      name: "idx_youtube_channel",
      columns: [
        "channelId"
      ]
    },

    {
      name: "idx_goal_profile",
      columns: [
        "goalProfileId"
      ]
    }
  ]
};