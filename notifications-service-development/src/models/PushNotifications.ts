import uuid from 'uuid-mongodb';
import mongoose, { Schema, Document } from 'mongoose';

export enum PushNotificationType {
  PAYMENT_REQUEST = 'PAYMENT_REQUEST',
  PAYMENT_BUYER = 'PAYMENT_BUYER',
  PAYMENT_SELLER = 'PAYMENT_SELLER',
  PAYMENT_MILESTONE_BUYER = 'PAYMENT_MILESTONE_BUYER',
  PAYMENT_MILESTONE_SELLER = 'PAYMENT_MILESTONE_SELLER',
  TRANSACTION_INVITE = 'TRANSACTION_INVITE',
  TRANSACTION_COMPLETE = 'TRANSACTION_COMPLETE',
  TRANSACTION_DECLINE = 'TRANSACTION_DECLINE',
  TRANSACTION_ACCEPT = 'TRANSACTION_ACCEPT',
  PAYMENT_DISPUTE = 'PAYMENT_DISPUTE',
  PAYMENT_CONFIRM_BUYER = 'PAYMENT_CONFIRM_BUYER',
  PAYMENT_CONFIRM_SELLER = 'PAYMENT_CONFIRM_SELLER',
}

export interface IPushNotification extends Document {
  _id: string;
  userId: string;
  sourceId: string;
  type: PushNotificationType;
  title: string;
  body: string;
  transactionInfo?: {
    txnId: string;
    txnCode: string;
    title: string;
    description: string;
    amount: {
      value: number;
      currency: string;
    };
    needsApproval: boolean;
    approved: boolean;
    declined: boolean;
    needsResolve: boolean;
    resolved: boolean;
    needsConfirmation: boolean;
    isConfirmed: boolean;
    isInDispute: boolean;
  };
  createdAt: Date;
}

const schema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    userId: {
      type: String,
      index: true,
      required: true,
    },
    sourceId: {
      type: String,
      index: true,
      required: true,
    },
    type: {
      type: String,
      enum: [
        PushNotificationType.TRANSACTION_INVITE,
        PushNotificationType.TRANSACTION_COMPLETE,
        PushNotificationType.PAYMENT_REQUEST,
        PushNotificationType.PAYMENT_BUYER,
        PushNotificationType.PAYMENT_SELLER,
        PushNotificationType.PAYMENT_MILESTONE_BUYER,
        PushNotificationType.PAYMENT_MILESTONE_SELLER,
        PushNotificationType.TRANSACTION_ACCEPT,
        PushNotificationType.TRANSACTION_DECLINE,
        PushNotificationType.PAYMENT_DISPUTE,
        PushNotificationType.PAYMENT_CONFIRM_BUYER,
        PushNotificationType.PAYMENT_CONFIRM_SELLER,
      ],
    },
    title: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    transactionInfo: {
      txnId: String,
      txnCode: String,
      title: String,
      description: String,
      milestones: [Object],
      files: [Object],
      amount: {
        value: Number,
        currency: String,
      },
      needsApproval: Boolean,
      approved: Boolean,
      declined: Boolean,
      needsResolve: Boolean,
      resolved: Boolean,
      needsConfirmation: Boolean,
      isConfirmed: Boolean,
      isInDispute: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

export const PushNotifications = mongoose.model<IPushNotification>('push_notifications', schema);
