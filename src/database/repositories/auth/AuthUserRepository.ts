import { AuthUserRow, CreateAuthUser, PublicAuthUser, UpdateAuthUser } from "../../types/auth-user.type";
import { Repository } from "../base/Repository";

export class AuthUserRepository extends Repository<AuthUserRow, CreateAuthUser, UpdateAuthUser, PublicAuthUser> {
  constructor() {
    super("authUser", "auth")
  }

  async getById(id: number): Promise<PublicAuthUser | null> {
    return this.findOne({ id });
  }
}