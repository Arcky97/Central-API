import { TableSchema } from "../../types/schema";

export const botRepliesSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "botReplies",
  columns: {
    uuid: {
      type: "VARCHAR(100)",
      nullable: false,
      primaryKey: true
    },
    triggers: {
      type: "TEXT",
      default: "NULL"
    },
    responses: {
      type: "TEXT",
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
    }
  }
}