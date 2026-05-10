import { createConnection } from "mysql2/promise";
import { env } from "../config/env";

export async function getRootConnection() {
  return createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS
  });
}