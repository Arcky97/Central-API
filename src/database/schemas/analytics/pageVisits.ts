import { TableSchema } from "../../types/schema";

export const pageVisitsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "page_visits",
  columns: {
    id: {
      type: "INT",
      unsigned: true,
      nullable: false,
      autoIncrement: true,
      primaryKey: true 
    },
    path: {
      type: "VARCHAR(256)",
      nullable: false
    },
    ip: {
      type: "VARCHAR(45)",
      nullable: false
    },
    user_agent: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    referrer: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    created_at: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_path",
      columns: ["path"]
    },
    {
      name: "idx_created_at",
      columns: ["created_at"]
    }
  ]
}