import { TableSchema } from "../../types/schema";

export const premiumSubscriptionsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "premiumSubscriptions",
  columns: {
    id: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true 
    },
    type: {
      type: "VARCHAR(100)",
      nullable: false
    },
    date: {
      type: "TIMESTAMP",
      nullable: false
    }
  }
}