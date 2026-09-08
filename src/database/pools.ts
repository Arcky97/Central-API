import { createPool, type Pool } from "mysql2/promise";
import { env } from "../config/env";
import type { DatabaseName } from "./types/schema";

export const databaseNames: Record<DatabaseName, string> = {
  core: "arckyTechCore",
  analytics: "arckyTechAnalytics",
  auth: "arckyTechAuth"
};

const pools: Record<DatabaseName, Pool> = {
  core: createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME_CORE,
    port: env.DB_PORT,
    connectionLimit: 10,
    decimalNumbers: true
  }),

  analytics: createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME_ANALYTICS,
    port: env.DB_PORT,
    connectionLimit: 10,
    decimalNumbers: true
  }),

  auth: createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME_AUTH,
    port: env.DB_PORT,
    connectionLimit: 10,
    decimalNumbers: true
  })
};

export function getPool(database: DatabaseName): Pool {
  return pools[database]
}