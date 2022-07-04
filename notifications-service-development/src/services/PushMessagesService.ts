import Bluebird from 'bluebird';
import { PushNotifications, Subscriptions } from '../models';
import { paginate, Request, Logger } from '../helpers';
import { PushMessagesMap } from '../mappers/PushMessagesMap';
import { SubscriptionsService } from './SubscriptionsService';

export const PushMessagesService = {
  /**
   * Gets push messages for user
   *
   * @param userId
   * @param page
   * @param size
   */
  async getMessages(userId: string, page: number = 1, size: number = 20): Promise<any> {
    const skip = (page - 1) * size;

    const messages = await PushNotifications.find({ userId })
      .skip(Number(skip))
      .limit(Number(size));
    const totalItems = await PushNotifications.countDocuments({ userId });

    return {
      name: 'push-notifications',
      ...paginate(totalItems, messages.length, page, size),
      records: messages.map(PushMessagesMap.mapToPushMessageDto),
    };
  },
  /**
   * Sends push messages
   *
   * @param id
   * @param title
   * @param body
   * @param data
   */
  async sendMessages(id: string, title: string, body: string, data?: { [x: string]: any }): Promise<any> {
    const subscriptions = Subscriptions.find({
      userId: id,
    });

    await Bluebird.Promise.map(subscriptions, async (subscription: any) => {
      try {
        const response = await Request.post('https://fcm.googleapis.com/fcm/send', {
          data: {
            data: {
              title,
              body,
              data,
            },
            to: subscription.subscriptionId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${process.env.FIREBASE_CM_SERVER_KEY}`,
          },
        });

        if (response.failure >= 1) {
          const { userId, subscriptionId } = subscription;

          SubscriptionsService.removeSubscription(userId, subscriptionId).catch(err => {
            Logger.Error(
              `Unable to remove expired subscription for user: ${userId}, subscriptionId: ${subscriptionId}`,
              err.message,
              err.stack,
            );
          });
        }
      } catch (err) {
        Logger.Error('Failed to send push notification: ', err.message, err.stack);
      }
    });

    return {
      success: true,
      message: 'Push messages sent successfully.',
    };
  },
};
