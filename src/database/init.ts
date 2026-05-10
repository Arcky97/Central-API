import { getPool } from "./pools";
import { syncDatabase } from "./sync/database.sync";
import { ensureDatabases } from "./sync/ensureDatabase";

export async function initializeDatabases() {
  await ensureDatabases();

  await Promise.all([
    getPool("core").query("SELECT 1"),
    getPool("analytics").query("SELECT 1"),
    getPool("auth").query("SELECT 1")
  ]);
  
  await syncDatabase();
}