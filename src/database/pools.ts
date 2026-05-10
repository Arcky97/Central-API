import { createPool, type Pool } from "mysql2/promise";
import { env } from "../config/env";
import type { DatabaseName } from "./types/schema";

export const databaseNames: Record<DatabaseName, string> = {
  core: "arcky_tech_core",
  analytics: "arcky_tech_analytics",
  auth: "arcky_tech_auth"
};

const pools: Record<DatabaseName, Pool> = {
  core: createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME_CORE,
    port: env.DB_PORT,
    connectionLimit: 10
  }),

  analytics: createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME_ANALYTICS,
    port: env.DB_PORT,
    connectionLimit: 10
  }),

  auth: createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME_AUTH,
    port: env.DB_PORT,
    connectionLimit: 10
  })
};

export function getPool(database: DatabaseName): Pool {
  return pools[database]
}