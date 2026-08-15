import { TableSchema } from "../../types/schema";

export const authUsersSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "auth",
  table: "authUsers",
  columns: {
    id: {
      type: "INT",
      primaryKey: true,
      autoIncrement: true
    },

    createdAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },

    updatedAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    }
  }
};