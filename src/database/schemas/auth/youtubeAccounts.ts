import { TableSchema } from "../../types/schema";

export const youtubeAccountsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "auth",
  table: "youtubeAccounts",

  columns: {
    id: {
      type: "INT",
      primaryKey: true,
      autoIncrement: true
    },

    authUserId: {
      type: "INT",
      nullable: false
    },

    googleUserId: {
      type: "VARCHAR(255)",
      nullable: false
    },

    channelId: {
      type: "VARCHAR(255)",
      nullable: false
    },

    channelName: {
      type: "VARCHAR(255)",
      nullable: false
    },

    accessToken: {
      type: "TEXT",
      nullable: false
    },

    refreshToken: {
      type: "TEXT",
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
      name: "idx_youtube_google_user",
      columns: ["googleUserId"],
      unique: true
    },
    {
      name: "idx_youtube_channel",
      columns: ["channelId"],
      unique: true
    },
    {
      name: "idx_youtube_auth_user",
      columns: ["authUserId"],
      unique: true
    }
  ]
};