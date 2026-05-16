import { Queue } from "bullmq";
import { redis } from "../redis";

export type PageVisitEvent = {
  path: string;
  ip: string;
  userAgent: string | null;
  referrer: string | null;
};

export const pageVisitsQueue = new Queue<PageVisitEvent>("page-visits", { 
  connection: redis 
});