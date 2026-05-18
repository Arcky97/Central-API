import { Queue } from "bullmq";
import { redis } from "../redis";
import { CreateApiAuthFailure } from "../database/types/api-auth-failures.type";

export const apiAuthFailuresQueue = new Queue<CreateApiAuthFailure>("api-auth-failures", {
  connection: redis
});