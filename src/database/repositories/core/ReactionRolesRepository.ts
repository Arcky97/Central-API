import { CreateReactionRole, PublicReactionRole, ReactionRolesRow, UpdateReactionRole } from "../../types/reaction-roles.type";
import { Repository } from "../base/Repository";

export class ReactionRolesRepository extends Repository<ReactionRolesRow, CreateReactionRole, UpdateReactionRole, PublicReactionRole> {
  constructor() {
    super("reactionRoles", "core");
  }
}