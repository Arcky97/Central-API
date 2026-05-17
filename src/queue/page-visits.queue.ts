import { Queue } from "bullmq";
import { redis } from "../redis";
import { CreatePageVisit } from "../database/types/page-visits.type";

export const pageVisitsQueue = new Queue<CreatePageVisit>("page-visits", { 
  connection: redis 
});