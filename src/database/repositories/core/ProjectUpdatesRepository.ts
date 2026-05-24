import { query } from "../../query";
import { CreateProjectUpdate, ProjectUpdate, PublicProjectUpdate, UpdateProjectUpdate } from "../../types/project-updates.type";
import { Repository } from "../base/Repository";

export class ProjectUpdatesRepository extends Repository<ProjectUpdate, CreateProjectUpdate, UpdateProjectUpdate, PublicProjectUpdate> {
  constructor() {
    super("projectUpdates", "core");
  }

  async upsertMany(rows: CreateProjectUpdate[]) {
    await Promise.allSettled(
      rows.map(row =>
        query(this.db, {
          sql: `
            INSERT INTO ${this.tableName} SET ?
            ON DUPLICATE KEY UPDATE 
              project = VALUES(project),
              date = VALUES(date),
              title = VALUES(title),
              excerpt = VALUES(excerpt)
          `
        }, row)
      )
    );
  }

  async getLatest(limit: number): Promise<PublicProjectUpdate[]> {
    return await query<ProjectUpdate[]>(this.db, {
      sql: `
        SELECT pu.* FROM ${this.tableName} pu INNER JOIN (
        SELECT PROJECT,
          MAX(date) as maxDate FROM ${this.tableName} GROUP BY project
        ) latest ON pu.project = latest.project AND 
         pu.date = latest.maxDate ORDER BY pu.date DESC LIMIT ?
      `
    }, [limit]); 
  }
}