import type { ExecuteValues, QueryOptions, RowDataPacket } from "mysql2/promise";

import { getPool } from "./pools";
import type { DatabaseName } from "./types/schema";

export async function query<T = RowDataPacket[]>(
  database: DatabaseName,
  sql: QueryOptions,
  params: ExecuteValues[] = []
): Promise<T> {
  const pool = getPool(database);
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.execute(sql, params);
    return result as T;
  } finally {
    connection.release();
  }
}