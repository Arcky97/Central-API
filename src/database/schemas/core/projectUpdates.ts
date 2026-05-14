import { TableSchema } from "../../types/schema";

export const projectUpdatesSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "projectUpdates",
  columns: {
    id: {
      type: "INT(10)",
      unsigned: true,
      nullable: false,
      autoIncrement: true,
      primaryKey: true
    },
    project: {
      type: "VARCHAR(100)",
      nullable: false,
    },
    date: {
      type: "TIMESTAMP",
      nullable: false
    },
    title: {
      type: "VARCHAR(255)",
      default: "NULL"
    },
    excerpt: {
      type: "LONGTEXT",
      default: "NULL"
    },
    slug: {
      type: "VARCHAR(256)",
      nullable: false,
      unique: true
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