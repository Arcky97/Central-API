import { Queue } from "bullmq";
import { redis } from "../redis";
import { CreateProjectUpdate } from "../database/types/project-updates.type";

export const projectUpdatesQueue = new Queue<CreateProjectUpdate>("project-updates", {
  connection: redis
});