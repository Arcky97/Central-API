export interface AuthUserRow {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export interface CreateAuthUser {}

// Update DTO
export type UpdateAuthUser = Partial<CreateAuthUser>;

// Public DTO
export type PublicAuthUser = AuthUserRow;