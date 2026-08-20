import { TableSchema } from "../../types/schema";

export const apiRequestsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "apiRequests",
  columns: {
    id: {
      type: "INT",
      unsigned: true,
      autoIncrement: true,
      primaryKey: true
    },
    timeStamp: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },
    method: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    route: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    status: {
      type: "MEDIUMINT",
      default: "NULL"
    },
    durationMs: {
      type: "INT",
      default: "NULL"
    },
    ip: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    scope: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    userAgent: {
      type: "VARCHAR(128)",
      default: "NULL"
    }
  }
}