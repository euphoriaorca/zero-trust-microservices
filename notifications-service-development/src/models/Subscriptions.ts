import uuid from 'uuid-mongodb';
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  userId: string;
  platform: string;
  subscriptionId: string;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
    platform: {
      type: String,
      enum: [],
    },
    subscriptionId: {
      type: String,
      unique: true,
    },
    lastUsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Subscriptions = mongoose.model<ISubscription>('subscriptions', schema);
