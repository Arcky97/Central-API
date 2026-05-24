import { ApiAuthFailure, CreateApiAuthFailure } from "../../types/api-auth-failures.type";
import { Repository } from "../base/Repository";

export class ApiAuthFailureRepository extends Repository<ApiAuthFailure, CreateApiAuthFailure> {
  constructor() {
    super("apiAuthFailures", "analytics")
  }
}