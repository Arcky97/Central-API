import { TableSchema } from "../../types/schema";

export const discordAccountsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "auth",
  table: "discordAccounts",

  columns: {
    id: {
      type: "INT",
      primaryKey: true,
      autoIncrement: true
    },

    discordUserId: {
      type: "VARCHAR(255)",
      nullable: false
    },

    username: {
      type: "VARCHAR(255)",
      nullable: false
    },

    accessToken: {
      type: "TEXT",
      nullable: false
    },

    refreshToken: {
      type: "TEXT",
      nullable: false
    },

    createdAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    },

    updatedAt: {
      type: "TIMESTAMP",
      default: "CURRENT_TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_discord_user",
      columns: ["discordUserId"],
      unique: true
    }
  ]
};