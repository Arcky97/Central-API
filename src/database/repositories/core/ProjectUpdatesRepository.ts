import { CreateProjectUpdate, ProjectUpdate } from "../../types/project-updates.type";
import { Repository } from "../base/Repository";

export class ProjectUpdatesRepository extends Repository<ProjectUpdate, ProjectUpdate, CreateProjectUpdate> {
  constructor() {
    super("projectUpdates", "core");
  }
}