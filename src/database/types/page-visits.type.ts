export interface PageVisit {
  id: number;
  path: string;
  ip: string;
  userAgent: string | null;
  referrer: string | null;
  createdAt: Date;
}

// Create DTO
export type CreatePageVisit = Omit<PageVisit, "id" | "createdAt">;

// Update DTO
export type UpdatePageVisit = Partial<CreatePageVisit>;

// Public DTO
