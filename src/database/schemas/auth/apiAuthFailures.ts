import { truncate } from "node:fs";
import { TableSchema } from "../../types/schema";
import { timeStamp } from "node:console";

export const apiAuthFailuresSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "auth",
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
      type: "VARCHAR(128)",
      default: "NULL"
    },
    ip: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    userAgent: {
      type: "VARCHAR(128)",
      default: "NULL"
    }
  }
}