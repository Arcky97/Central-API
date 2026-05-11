import { TableSchema } from "../../types/schema";

export const generatedEmbedsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "generatedEmbeds",
  columns: {
    id: {
      type: "INT(10)",
      unsigned: true,
      autoIncrement: true,
      nullable: false,
      primaryKey: true
    },
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
    },
    channelId: {
      type: "VARCHAR(20)",
      nullable: false
    },
    messageId: {
      type: "VARCHAR(20)",
      nullable: false
    },
    type: {
      type: "VARCHAR(15)",
      nullable: false,
      primaryKey: true
    },
    message: {
      type: "VARCHAR(2048)",
      default: "NULL"
    },
    color: {
      type: "VARCHAR(10)",
      default: "NULL"
    },
    author: {
      type: "LONGTEXT",
      default: "NULL"
    },
    title: {
      type: "VARCHAR(256)",
      default: "NULL"
    },
    url: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    description: {
      type: "VARCHAR(2048)",
      default: "NULL"
    },
    fields: {
      type: "LONGTEXT",
      default: "NULL"
    },
    imageUrl: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    thumbnailUrl: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    footer: {
      type: "LONGTEXT",
      default: "NULL"
    },
    timeStamp: {
      type: "TINYINT(1)",
      default: "1"
    },
    deletionDate: {
      type: "TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_guild_message",
      columns: ["guildId", "messageId"]
    },
    {
      name: "idx_guild_channel",
      columns: ["guildId", "channelId"]
    },
    {
      name: "idx_deletion_date",
      columns: ["deletionDate"]
    }
  ]
}