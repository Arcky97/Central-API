import { TableSchema } from "../../types/schema";

export const eventEmbedsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "eventEmbeds",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    channelId: {
      type: "VARCHAR(20)",
      nullable: false,
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
      name: "idx_deletion_date",
      columns: ["deletionDate"]
    }
  ]
}