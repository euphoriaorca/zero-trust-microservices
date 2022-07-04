import { ISubscription } from '../models';

export class SubscriptionsMap {
  public static mapToSubscriptionDto(subscription: ISubscription): any {
    const { platform, userId, subscriptionId, lastUsedAt, createdAt, updatedAt } = subscription;

    return {
      platform,
      userId,
      subscriptionId,
      lastUsedAt,
      createdAt,
      updatedAt,
    };
  }
}
