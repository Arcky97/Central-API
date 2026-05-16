export interface PageVisitsRow {
  id: number;
  path: string;
  ip: string;
  userAgent: string | null;
  referrer: string | null;
  createdAt: Date;
}

export interface CreatePageVisits {
  path: string;
  ip: string;
  userAgent?: string | null;
  referrer?: string | null;
}