export interface ProjectUpdate {
  id: number;
  project: string;
  date: Date;
  title: string;
  excerpt: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export type CreateProjectUpdate = Omit<ProjectUpdate, "id" | "createdAt" | "updatedAt">

// Update DTO
export type UpdateProjectUpdate = Partial<CreateProjectUpdate>;