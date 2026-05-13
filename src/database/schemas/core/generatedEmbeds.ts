import { TableSchema } from "../../types/schema";

export const generatedEmbedsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "generatedEmbeds",
  columns: {
    id: {
      type: "INT",
      unsigned: true,
      autoIncrement: true,
      primaryKey: true
    },
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
    },
    channelId: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    messageId: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    config: {
      type: "TEXT",
      nullable: false
    },
    createdBy: {
      type: "VARCHAR(30)",
      default: "NULL"
    },
    createdAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },
    updatedAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP"
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