import { CreatePremiumSubscription, PremiumSubscriptionsRow, PublicPremiumSubscription, UpdatePremiumSubscription } from "../../types/premium-subscriptions.type";
import { Repository } from "../base/Repository";

export class PremiumSubscriptionRepository extends Repository<PremiumSubscriptionsRow, CreatePremiumSubscription, UpdatePremiumSubscription, PublicPremiumSubscription> {
  constructor() {
    super("premiumSubscriptions", "core");
  }
}