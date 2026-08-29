import { TableSchema } from "../../types/schema";

export const youtubeGoalProfilesSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "youtubeGoalProfiles",

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

    name: {
      type: "VARCHAR(100)",
      nullable: false
    },

    views : {
      type: "INT",
      default: "0"
    },

    watchHours: {
      type: "INT",
      default: "0"
    },

    likes: {
      type: "INT",
      default: "0"
    },

    comments: {
      type: "INT",
      default: "0"
    },

    createdAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    }
  },

  indexes: [
    {
      name: "idx_youtube_goal_profile_channel",
      columns: ["channelId"]
    }
  ]
};