import { createPool, Pool } from "mysql2/promise";
import { env } from "../config/env";

/**
 * Singleton MySQL connection pool
 */

let pool: Pool | null = null;

/**
 * Creates (or returns) the MySQL connection pool
 */
export function getDatabasePool(): Pool {
  if (pool) return pool;

  pool = createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    port: env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}