import { Subscriptions } from '../models';
import { SubscriptionsMap } from '../mappers/SubscriptionsMap';
import { CustomError } from '../helpers';
import { ErrorCode } from '../constants';

export const SubscriptionsService = {
  /**
   * Adds a push subscription
   *
   * @param userId
   * @param subscriptionId
   * @param platform
   */
  async addSubscription(userId: string, subscriptionId: string, platform: any): Promise<any> {
    const exstSubscription = await Subscriptions.findOne({
      subscriptionId,
    });

    if (exstSubscription) {
      if (exstSubscription.userId === userId && exstSubscription.platform === platform) {
        return SubscriptionsMap.mapToSubscriptionDto(exstSubscription);
      }

      // Remove subscription
      await Subscriptions.deleteOne({
        subscriptionId,
      });
    }

    const subscription = await Subscriptions.create({
      userId,
      subscriptionId,
      platform,
    });

    return SubscriptionsMap.mapToSubscriptionDto(subscription);
  },
  /**
   * Removes a push subscription
   *
   * @param userId
   * @param subscriptionId
   */
  async removeSubscription(userId: string, subscriptionId: string): Promise<any> {
    const exstSubscription = await Subscriptions.findOne({
      userId,
      subscriptionId,
    });

    if (!exstSubscription) {
      throw new CustomError(ErrorCode.RESOURCE_NOT_FOUND, 'Subscription does not exist.');
    }

    const deleted = await Subscriptions.deleteOne({
      userId,
      subscriptionId,
    });

    return {
      success: deleted.ok === 1,
      message: 'Subscription was removed successfully.',
    };
  },
};
