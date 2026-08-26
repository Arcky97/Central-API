import type { TableSchema } from "../../types/schema";

export const youtubePlaylistsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "youtubePlaylists",

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

    playlistId: {
      type: "VARCHAR(50)",
      nullable: false,
      unique: true
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
      type: "VARCHAR(2048)",
      nullable: true
    },

    itemCount: {
      type: "INT",
      nullable: true
    },

    publishedAt: {
      type: "TIMESTAMP",
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
  },

  indexes: [
    {
      name: "idx_youtube_playlist_channel",
      columns: [
        "channelId"
      ]
    }
  ]
};
