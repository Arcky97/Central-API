import { Queue } from "bullmq";
import { redis } from "../redis";
import { CreateApiRequest } from "../database/types/api-requests.type";

export const apiRequestsQueue = new Queue<CreateApiRequest>("api-requests", {
  connection: redis
});