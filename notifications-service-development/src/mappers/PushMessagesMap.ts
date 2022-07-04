import { IPushNotification } from '../models';

export class PushMessagesMap {
  public static mapToPushMessageDto(message: IPushNotification): any {
    const { _id, type, title, body, transactionInfo, createdAt } = message;

    return {
      id: _id,
      type,
      title,
      body,
      transactionInfo,
      createdAt,
    };
  }
}
