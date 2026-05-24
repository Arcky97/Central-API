import { ApiRequest, CreateApiRequest } from "../../types/api-requests.type";
import { Repository } from "../base/Repository";

export class ApiRequestRepository extends Repository<ApiRequest, CreateApiRequest> {
  constructor() {
    super("apiRequests", "analytics");
  }
}