import { TableSchema } from "../../types/schema";

export const apiAuthFailuresSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "analytics",
  table: "apiAuthFailures",
  columns: {
    id: {
      type: "INT",
      unsigned: true,
      autoIncrement: true,
      primaryKey: true,
    },
    timeStamp: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },
    reason: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    method: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    route: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    ip: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    userAgent: {
      type: "VARCHAR(512)",
      default: "NULL"
    }
  }
}