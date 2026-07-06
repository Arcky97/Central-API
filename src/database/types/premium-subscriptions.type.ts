export interface PremiumSubscriptionsRow {
  id: string;
  type: string;
  date: Date;
}

// Create DTO
export type CreatePremiumSubscription = Omit<PremiumSubscriptionsRow, "id">;

// Update DTO
export type UpdatePremiumSubscription = CreatePremiumSubscription;

// Public DTO 
export type PublicPremiumSubscription = CreatePremiumSubscription;