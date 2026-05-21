import { query } from "../../query";
import { CreateProjectUpdate, ProjectUpdate } from "../../types/project-updates.type";
import { Repository } from "../base/Repository";

export class ProjectUpdatesRepository extends Repository<ProjectUpdate, ProjectUpdate, CreateProjectUpdate> {
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
}