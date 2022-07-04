import { Response } from 'express';
import { IExpressRequest } from '@distinctai/security/src/interfaces';
import { NotificationEventDto } from '../interfaces';
import { handleErrorResponse } from '../handlers';
import { UserEventService } from '../services/UserEventService';
import { TransactionEventService } from '../services/TransactionEventService';

export const EventController = {
  async receiveEvent(req: IExpressRequest, res: Response): Promise<void> {
    const { type, recipient, parameters } = req.body;

    try {
      switch (type) {
        case NotificationEventDto.TypeEnum.USERWELCOME: {
          const { userId } = recipient;
          const status = await UserEventService.sendWelcomeEmail(userId);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.VERIFICATIONREQUEST: {
          const { userId } = recipient;
          const status = await UserEventService.sendVerificationRequestedNotification(userId);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.CONFIRMACCOUNT: {
          const { userId } = recipient;
          const status = await UserEventService.sendAccountConfirmationEmail(userId, parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.PASSWORDRESET: {
          const { userId } = recipient;
          const status = await UserEventService.sendPasswordResetEmail(userId, parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONREQUEST: {
          const { userId } = recipient;
          const status = await TransactionEventService.sendTransactionRequest(userId, parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONINVITE: {
          const { userId } = recipient;
          const status = await TransactionEventService.sendTransactionInvite(userId, parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONRECEIPTBUYER: {
          const status = await TransactionEventService.sendTransactionReceiptToBuyer(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONRECEIPTSELLER: {
          const status = await TransactionEventService.sendTransactionReceiptToSeller(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONMILESTONERECEIPTBUYER: {
          const status = await TransactionEventService.sendMilestoneTransactionReceiptToBuyer(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONMILESTONERECEIPTSELLER: {
          const status = await TransactionEventService.sendMilestoneTransactionReceiptToSeller(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONCOMPLETE: {
          const status = await TransactionEventService.sendTransactionComplete(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONACCEPTED: {
          const status = await TransactionEventService.sendTransactionAccepted(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.TRANSACTIONDECLINED: {
          const status = await TransactionEventService.sendTransactionDeclined(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.PAYMENTACTIONCODE: {
          const status = await TransactionEventService.sendTransactionCode(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.PAYMENTDISPUTE: {
          const status = await TransactionEventService.sendPaymentInDispute(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.PAYMENTCONFIRMBUYER: {
          const status = await TransactionEventService.sendPaymentConfirmedByBuyer(parameters);

          res.status(200).json(status);

          break;
        }
        case NotificationEventDto.TypeEnum.PAYMENTCONFIRMSELLER: {
          const status = await TransactionEventService.sendPaymentConfirmedBySeller(parameters);

          res.status(200).json(status);

          break;
        }
        default: {
          res.status(400).json({
            success: false,
            message: 'Event type has no valid handler.',
          });
        }
      }
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
