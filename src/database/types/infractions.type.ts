export interface InfractionsRow {
  id: number;
  guildId: string;
  userId: string;
  modId: string;
  timeoutId: string;
  action: string;
  reason: string;
  status: string;
  formatDuration: string;
  date: Date;
  endTime: Date;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateInfraction {
  guildId: string;
  userId: string;
  modId: string;
  timeoutId: string;
  action: string;
  reason: string;
  status: string;
  formatDuration: string;
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateInfraction = Partial<CreateInfraction>;

// Public DTO 
export type PublicInfraction = CreateInfraction;