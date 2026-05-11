import { TableSchema } from "../../types/schema";

export const botRepliesSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "botReplies",
  columns: {
    id: {
      type: "VARCHAR(100)",
      nullable: false,
      primaryKey: true
    },
    triggers: {
      type: "LONGTEXT",
      default: "NULL"
    },
    responses: {
      type: "LONGTEXT",
      default: "NULL"
    }
  }
}