import moment from 'moment';
import Bluebird from 'bluebird';
import { UserService } from './UserService';
import { EmailService } from './EmailService';
import { Logger, CustomError, formatCurrencyValue, ReportError } from '../helpers';
import { ErrorCode } from '../constants';
import { PushNotifications, PushNotificationType } from '../models';
import { PushMessagesService } from './PushMessagesService';

export const TransactionEventService = {
  /**
   * Generic: Get a user name in case a business name is specified
   *
   * @param user
   */
  getName(user: any) {
    return user.accountType === 'BUSINESS' && user.business ? user.business.name : `${user.firstName} ${user.lastName}`;
  },
  /**
   * Sends a transaction request to invited user
   *
   * @param userId
   */
  async sendTransactionRequest(userId: string, params: any): Promise<any> {
    const { txnId, code, invites } = params;

    const buyer = await UserService.getUserById(userId);
    const buyerName = this.getName(buyer);

    if (!invites!.length) {
      Logger.Info('Cannot send tx request for transaction without invite: ' + txnId);
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Transaction does not have any invites.');
    }

    let seller: Partial<any> = {
      firstName: invites![0].firstName,
      lastName: invites![0].lastName,
      email: invites![0].email,
    };
    let sellerName = `${seller.firstName} ${seller.lastName}`;

    try {
      seller = await UserService.getUserByEmail(seller.email!);
      sellerName = this.getName(seller);

      PushNotifications.create({
        userId: seller.userId,
        sourceId: 'notification-tx-request-' + txnId,
        type: PushNotificationType.PAYMENT_REQUEST,
        title: 'Payment Request From <b>' + buyerName + '</b>',
        body: `<b>${buyerName}</b> is requesting to pay you for <b>${params.title}</b> - <b>${formatCurrencyValue(params.amount)}</b>`,
        transactionInfo: {
          txnId,
          txnCode: code,
          needsApproval: true,
          approved: false,
          declined: false,
        },
      }).catch(err => {
        Logger.Error('Unable to send transaction request notification', err.message, err.stack);
      });

      PushMessagesService.sendMessages(
        seller.userId!,
        `Payment Request From ${buyerName}`,
        `${buyerName} is requesting to pay you for ${params.title} - ${formatCurrencyValue(params.amount)}`,
      ).catch(err => {
        Logger.Error('Unable to send transaction request push message', err.message, err.stack);
      });
    } catch (err) {
      // seller is not registered, continue
    }

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');
    const actionUrl = process.env.CLIENT_FRONTEND_BASE_URL + '/home?id=' + params.code + '&email=' + seller.email;

    const mail = await EmailService.sendEmail({
      subject: `Payment Request From ${buyerName} - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionRequested',
        params: {
          ...params,
          buyer,
          buyerName,
          seller,
          sellerName,
          referenceDate,
          acceptUrl: actionUrl + '&intent=ACCEPT',
          declineUrl: actionUrl + '&intent=DECLINE',
        },
      },
      receivers: [
        {
          name: sellerName,
          email: seller.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendTransactionInvite(userId: string, params: any): Promise<any> {
    const { txnId, code, invites } = params;

    const seller = await UserService.getUserById(userId);
    const sellerName = this.getName(seller);

    if (!invites!.length) {
      Logger.Info('Cannot send tx request for transaction without invite: ' + txnId);
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Transaction does not have any invites.');
    }

    let invitedBuyers: Partial<any[]> = invites!.map((invite: any) => ({
      firstName: invite.firstName,
      lastName: invite.lastName,
      email: invite.email,
    }));

    await Bluebird.Promise.each(invitedBuyers, async (buyer: any) => {
      try {
        const user = await UserService.getUserByEmail(buyer!.email!);

        PushNotifications.create({
          userId: user.userId,
          sourceId: `notification-tx-invite-${buyer!.userId!}-${txnId}`,
          type: PushNotificationType.TRANSACTION_INVITE,
          title: 'Payment Invite From <b>' + sellerName + '</b>',
          body: `<b>${sellerName}</b> invited you to a transaction.`,
          transactionInfo: {
            txnId,
          },
        }).catch(err => {
          Logger.Error('Unable to send transaction invite notification', err.message, err.stack);
        });

        PushMessagesService.sendMessages(
          user.userId!,
          `Payment Invite From ${sellerName}`,
          `${sellerName} invited you to a transaction.`,
        ).catch(err => {
          Logger.Error('Unable to send transaction invite push message', err.message, err.stack);
        });
      } catch (err) {
        // Do nothing
      }
    });

    const transactionUrl = `${process.env.MAIN_FRONTEND_BASE_URL}/pay/${code}`;
    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `Payment Invite From ${sellerName} - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'support@distinct.ai',
      },
      template: {
        id: 'TransactionInvite',
        params: {
          ...params,
          seller,
          sellerName,
          referenceDate,
          transactionUrl,
        },
      },
      receivers: invitedBuyers.map(buyer => ({
        name: `${buyer!.firstName} ${buyer!.lastName}`,
        email: buyer!.email!,
      })),
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendTransactionReceiptToBuyer(params: any): Promise<any> {
    const { txnId, txnRef, userId, user, title, transactionPairOwnerId } = params;

    let buyer = <Partial<any>>user;

    if (userId) {
      try {
        buyer = await UserService.getUserById(userId);
      } catch (err) {
        Logger.Error('Unable to get user information for Id: ' + userId, err.message, err.stack);
        ReportError.reportException(err);
        throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Unable to get buyer information.');
      }
    }

    if (!buyer) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Buyer information not provided.');
    }

    const buyerName = this.getName(buyer);

    if (userId) {
      PushNotifications.create({
        userId,
        sourceId: 'notification-tx-buyer-' + txnRef,
        type: PushNotificationType.PAYMENT_BUYER,
        title: 'Your Payment Was Confirmed',
        body: `You made a payment of <b>${formatCurrencyValue(params.amount)}</b> for <b>${title}</b>.`,
        transactionInfo: {
          txnId,
          needsConfirmation: true,
          isConfirmed: false,
          isInDispute: false,
        },
      }).catch(err => {
        Logger.Error('Unable to add buyer receipt notification', err.message, err.stack);
      });

      PushMessagesService.sendMessages(
        userId,
        'Your Payment Was Confirmed',
        `You made a payment of ${formatCurrencyValue(params.amount)} for ${title}.`,
      ).catch(err => {
        Logger.Error('Unable to send transaction receipt push message to buyer', err.message, err.stack);
      });
    }

    const seller = await UserService.getUserById(transactionPairOwnerId!);
    const sellerName = this.getName(seller);
    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');
    const actionUrl = `${process.env.CLIENT_FRONTEND_BASE_URL}/home?id=${txnId}&ref=${txnRef}&email=${buyer.email}`;

    const mail = await EmailService.sendEmail({
      subject: `Your Payment for "${title}" Was Confirmed 🎉 - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionReceiptBuyer',
        params: {
          ...params,
          buyerName,
          sellerName,
          referenceDate,
          confirmTransactionUrl: actionUrl + '&intent=CONFIRM',
          disputeTransactionUrl: actionUrl + '&intent=DISPUTE',
        },
      },
      receivers: [
        {
          name: buyerName,
          email: buyer.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendTransactionReceiptToSeller(params: any): Promise<any> {
    const { txnId, txnRef, user, title } = params;

    let buyer = <Partial<any>>user;

    if (params.userId) {
      try {
        buyer = await UserService.getUserById(params.userId);
      } catch (err) {
        Logger.Error('Unable to get user information for Id: ' + params.userId, err.message, err.stack);
        ReportError.reportException(err);
        throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Unable to get buyer information.');
      }
    }

    if (!buyer) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Buyer information not provided.');
    }

    const buyerName = this.getName(buyer);

    PushNotifications.create({
      userId: params.transactionPairOwnerId!,
      sourceId: 'notification-tx-seller-' + txnRef,
      type: PushNotificationType.PAYMENT_SELLER,
      title: 'You Have A New Payment',
      body: `<b>${buyerName}</b> just made a payment of <b>${formatCurrencyValue(params.amount)}</b> for: <b>${title}</b>.`,
      transactionInfo: {
        txnId,
        needsConfirmation: true,
        isConfirmed: false,
        isInDispute: false,
      },
    }).catch(err => {
      Logger.Error('Unable to add seller receipt notification', err.message, err.stack);
    });

    PushMessagesService.sendMessages(
      params.transactionPairOwnerId!,
      'You Have A New Payment',
      `${buyerName} just made a payment of ${formatCurrencyValue(params.amount)} for: ${title}.`,
    ).catch(err => {
      Logger.Error('Unable to send transaction receipt push message to seller', err.message, err.stack);
    });

    const seller = await UserService.getUserById(params.transactionPairOwnerId!);
    const sellerName = this.getName(seller);

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `You Have a New Payment - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionReceiptSeller',
        params: {
          ...params,
          buyerName,
          sellerName,
          buyer: {
            ...buyer,
            phone: (buyer as any).phone || buyer.primaryPhone,
          },
          referenceDate,
          confirmTransactionUrl: `${process.env.CLIENT_FRONTEND_BASE_URL}/home?intent=CONFIRM&id=${txnId}&ref=${txnRef}&email=${seller.email}`,
        },
      },
      receivers: [
        {
          name: sellerName,
          email: seller.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendMilestoneTransactionReceiptToBuyer(params: any): Promise<any> {
    const { transactionPair } = params;
    const { userId, user, transactionPairOwnerId } = <any>transactionPair;

    let buyer = <Partial<any>>user;
    let seller = await UserService.getUserById(transactionPairOwnerId!);

    if (userId) {
      try {
        buyer = await UserService.getUserById(userId);
      } catch (err) {
        Logger.Error('Unable to get user information for Id: ' + userId, err.message, err.stack);
        ReportError.reportException(err);
        throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Unable to get buyer information.');
      }
    }

    if (!buyer) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Buyer information not provided.');
    }

    const buyerName = this.getName(buyer);
    const sellerName = this.getName(seller);

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `Transaction Milestone Disbursement 🎉 - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionMilestoneReceiptBuyer',
        params: {
          ...params.transactionPair,
          buyerName,
          sellerName,
          referenceDate,
        },
      },
      receivers: [
        {
          name: buyerName,
          email: buyer.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendMilestoneTransactionReceiptToSeller(params: any): Promise<any> {
    const { txnRef, txnId, transactionPair } = params;
    const { userId, user, transactionPairOwnerId } = <any>transactionPair;

    let buyer = <Partial<any>>user;
    let seller = await UserService.getUserById(transactionPairOwnerId!);

    if (userId) {
      try {
        buyer = await UserService.getUserById(userId);
      } catch (err) {
        Logger.Error('Unable to get user information for Id: ' + userId, err.message, err.stack);
        ReportError.reportException(err);
        throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Unable to get buyer information.');
      }
    }

    if (!buyer) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Buyer information not provided.');
    }

    const buyerName = this.getName(buyer);
    const sellerName = this.getName(seller);
    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    PushNotifications.create({
      userId: transactionPairOwnerId!,
      sourceId: `notification-mtx-seller-${txnRef}`,
      type: PushNotificationType.PAYMENT_MILESTONE_SELLER,
      title: 'New Milestone Payment',
      body: `A new milestone payment of <b>${formatCurrencyValue(params.amount)}</b> was just paid, for: <b>${transactionPair.title}</b>`,
      transactionInfo: {
        txnId,
        txnRef,
        milestones: transactionPair.milestones,
      },
    }).catch(err => {
      Logger.Error('Unable to add seller milestone receipt notification', err.message, err.stack);
    });

    PushMessagesService.sendMessages(
      transactionPairOwnerId!,
      'New Milestone Payment',
      `A new milestone payment of ${formatCurrencyValue(params.amount)} was just paid, for: ${transactionPair.title}`,
    ).catch(err => {
      Logger.Error('Unable to send transaction milestone receipt push message to seller', err.message, err.stack);
    });

    const mail = await EmailService.sendEmail({
      subject: `Transaction Milestone Disbursement 🎉 - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionMilestoneReceiptSeller',
        params: {
          ...transactionPair,
          buyerName,
          sellerName,
          referenceDate,
        },
      },
      receivers: [
        {
          name: sellerName,
          email: seller.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendTransactionComplete(params: any): Promise<any> {
    const { transactionPair } = params;
    const { txnId, txnRef, userId, user, title, transactionPairOwnerId } = <any>transactionPair;

    let buyer = <Partial<any>>user;
    let seller = await UserService.getUserById(transactionPairOwnerId!);

    if (userId) {
      try {
        buyer = await UserService.getUserById(userId);
      } catch (err) {
        Logger.Error('Unable to get user information for Id: ' + userId, err.message, err.stack);
        ReportError.reportException(err);
        throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Unable to get buyer information.');
      }
    }

    if (!buyer) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Buyer information not provided.');
    }

    const buyerName = this.getName(buyer);
    const sellerName = this.getName(seller);
    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    PushNotifications.create({
      userId: transactionPairOwnerId!,
      sourceId: `notification-tx-seller-complete-${txnRef}`,
      type: PushNotificationType.TRANSACTION_COMPLETE,
      title: 'A Transaction Is Complete',
      body: `A payment for <b>${title}</b> is complete and now complete and available for withdrawal.`,
      transactionInfo: {
        txnId,
        txnRef,
        milestones: transactionPair.milestones,
      },
    }).catch(err => {
      Logger.Error('Unable to add seller milestone receipt notification', err.message, err.stack);
    });

    PushNotifications.updateOne(
      {
        sourceId: 'notification-tx-dispute-' + txnRef,
      },
      {
        $set: {
          'transactionInfo.needsResolve': false,
          'transactionInfo.resolved': true,
        },
      },
    ).catch(err => {
      Logger.Error('Unable to update existing payment dispute notification', err.message, err.stack);
    });

    PushMessagesService.sendMessages(
      transactionPairOwnerId!,
      'Transaction Complete',
      `The payment for ${title} by ${buyerName}, is now complete and available for withdrawal.`,
    ).catch(err => {
      Logger.Error('Unable to send transaction complete push message to seller', err.message, err.stack);
    });

    const mail = await EmailService.sendEmail({
      subject: `Transaction Complete 🎉 - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionCompleteSeller',
        params: {
          ...transactionPair,
          buyerName,
          sellerName,
          referenceDate,
        },
      },
      receivers: [
        {
          name: sellerName,
          email: seller.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendTransactionDeclined(params: any): Promise<any> {
    const { userId, txnId, invites } = params;

    const invite = invites![0];
    const sellerName = invite.businessName ? invite.businessName : `${invite.firstName} ${invite.lastName}`;

    const buyer = await UserService.getUserById(userId!);
    const buyerName = this.getName(buyer);

    if (!invites!.length) {
      Logger.Info('Cannot send tx declined for transaction without invite: ' + txnId);
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Transaction does not have any invites.');
    }

    PushNotifications.create({
      userId,
      sourceId: 'notification-tx-decline-' + txnId,
      type: PushNotificationType.TRANSACTION_DECLINE,
      title: 'Your Transaction Request Was Declined',
      body: `<b>${sellerName}</b> declined your transaction request for: <b>${params.title}</b> - <b>${formatCurrencyValue(
        params.amount,
      )}</b>`,
      transactionInfo: {
        txnId,
      },
    }).catch(err => {
      Logger.Error('Unable to send transaction decline notification', err.message, err.stack);
    });

    PushNotifications.updateOne(
      {
        sourceId: 'notification-tx-request-' + txnId,
      },
      {
        $set: {
          'transactionInfo.needsApproval': false,
          'transactionInfo.declined': true,
        },
      },
    ).catch(err => {
      Logger.Error('Unable to update existing transaction request notification', err.message, err.stack);
    });

    PushMessagesService.sendMessages(
      userId!,
      'Your Transaction Request Was Declined',
      `${sellerName} declined your transaction request for: ${params.title} - ${formatCurrencyValue(params.amount)}`,
    ).catch(err => {
      Logger.Error('Unable to send transaction declined push message', err.message, err.stack);
    });

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `Your Transaction Request Was Declined - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionDeclined',
        params: {
          ...params,
          buyer,
          buyerName,
          sellerName,
          referenceDate,
        },
      },
      receivers: [
        {
          name: buyerName,
          email: buyer.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendTransactionAccepted(params: any): Promise<any> {
    const { userId, txnId, code, invites } = params;

    const invite = invites![0];
    const sellerName = invite.businessName ? invite.businessName : `${invite.firstName} ${invite.lastName}`;

    const buyer = await UserService.getUserById(userId!);
    const buyerName = this.getName(buyer);

    if (!invites!.length) {
      Logger.Info('Cannot send tx accepted for transaction without invite: ' + txnId);
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Transaction does not have any invites.');
    }

    PushNotifications.create({
      userId,
      sourceId: 'notification-tx-accept-' + txnId,
      type: PushNotificationType.TRANSACTION_ACCEPT,
      title: 'Your Transaction Request Was Accepted',
      body: `<b>${sellerName}</b> accepted your transaction request for: <b>${params.title}</b> - <b>${formatCurrencyValue(
        params.amount,
      )}</b>`,
      transactionInfo: {
        txnId,
      },
    }).catch(err => {
      Logger.Error('Unable to send transaction accept notification', err.message, err.stack);
    });

    PushNotifications.updateOne(
      {
        sourceId: 'notification-tx-request-' + txnId,
      },
      {
        $set: {
          'transactionInfo.needsApproval': false,
          'transactionInfo.approved': true,
        },
      },
    ).catch(err => {
      Logger.Error('Unable to update existing transaction request notification', err.message, err.stack);
    });

    PushMessagesService.sendMessages(
      userId!,
      'Your Transaction Request Was Accepted!',
      `${sellerName} accepted your transaction request for: ${params.title} - ${formatCurrencyValue(params.amount)}`,
    ).catch(err => {
      Logger.Error('Unable to send transaction accepted push message', err.message, err.stack);
    });

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');
    const transactionUrl = `${process.env.MAIN_FRONTEND_BASE_URL}/pay/${code}`;

    const mail = await EmailService.sendEmail({
      subject: `Your Transaction Request Was Approved! - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'TransactionAccepted',
        params: {
          ...params,
          buyer,
          buyerName,
          sellerName,
          referenceDate,
          transactionUrl,
        },
      },
      receivers: [
        {
          name: buyerName,
          email: buyer.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendTransactionCode(params: { [x: string]: any }): Promise<any> {
    const { user, actionType, actionCode, isSeller, isBuyer, transactionPair } = params;

    const isDispute = actionType === 'PAYMENT_DISPUTE';
    const isConfirm = actionType === 'PAYMENT_CONFIRM';

    const userName = this.getName(user);
    const { title } = transactionPair;

    const seller = await UserService.getUserById(transactionPair.userId);
    const sellerName = this.getName(seller);

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `${isDispute ? 'Your Dispute Request' : 'Your Resolve Request'} - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'PaymentActionCode',
        params: {
          ...params,
          isSeller,
          isBuyer,
          isDispute,
          isConfirm,
          actionCode,
          userName,
          sellerName,
          title,
          referenceDate,
        },
      },
      receivers: [
        {
          name: userName,
          email: user.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendPaymentInDispute(params: { [x: string]: any }): Promise<any> {
    const { buyer, txnRef, transactionPair } = params;
    const { userId, title, txnId } = transactionPair;

    const seller = await UserService.getUserById(userId);
    const sellerName = this.getName(seller);
    const buyerName = this.getName(buyer);

    PushNotifications.create({
      userId,
      sourceId: 'notification-tx-dispute-' + txnRef,
      type: PushNotificationType.PAYMENT_DISPUTE,
      title: 'Your Pending Dispute',
      body: `<b>${buyerName}</b> started a dispute for the payment for <b>${title}</b>.`,
      transactionInfo: {
        txnId,
        txnRef,
        needsResolve: true,
        resolved: false,
      },
    }).catch(err => {
      Logger.Error('Unable to send transaction accept notification', err.message, err.stack);
    });

    PushMessagesService.sendMessages(
      userId,
      'You Have A Pending Dispute',
      `${buyerName} started a dispute for the payment for ${title}`,
    ).catch(err => {
      Logger.Error('Unable to send payment dispute push message', err.message, err.stack);
    });

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `You Have A Pending Dispute - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'PaymentActionDispute',
        params: {
          ...params,
          buyerName,
          sellerName,
          title,
          referenceDate,
        },
      },
      receivers: [
        {
          name: sellerName,
          email: seller.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendPaymentConfirmedByBuyer(params: { [x: string]: any }): Promise<any> {
    const { buyer, txnRef, transactionPair } = params;
    const { userId, title, txnId } = transactionPair;

    const seller = await UserService.getUserById(userId);
    const sellerName = this.getName(seller);
    const buyerName = this.getName(buyer);

    PushNotifications.create({
      userId,
      sourceId: 'notification-tx-confirm-buyer-' + txnRef,
      type: PushNotificationType.PAYMENT_CONFIRM_BUYER,
      title: 'Your Transaction Was Resolved',
      body: `<b>${buyerName}</b> resolved the transaction: <b>${title}</b>.`,
      transactionInfo: {
        txnId,
        txnRef,
      },
    }).catch(err => {
      Logger.Error('Unable to send transaction resolved by buyer notification', err.message, err.stack);
    });

    PushNotifications.updateOne(
      {
        sourceId: 'notification-tx-dispute-' + txnRef,
      },
      {
        $set: {
          'transactionInfo.needsResolve': false,
          'transactionInfo.resolved': true,
        },
      },
    ).catch(err => {
      Logger.Error('Unable to update existing payment dispute notification', err.message, err.stack);
    });

    PushMessagesService.sendMessages(
      userId,
      'Your Transaction Was Resolved',
      `${buyerName} just resolved the transaction for: ${title}.`,
    ).catch(err => {
      Logger.Error('Unable to send transaction resolved by buyer push message', err.message, err.stack);
    });

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `Your Transaction Was Resolved - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'PaymentActionConfirmBuyer',
        params: {
          ...params,
          buyerName,
          sellerName,
          title,
          referenceDate,
        },
      },
      receivers: [
        {
          name: sellerName,
          email: seller.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
  async sendPaymentConfirmedBySeller(params: { [x: string]: any }): Promise<any> {
    const { buyer, seller, txnRef, transactionPair } = params;
    const { title, txnId } = transactionPair;

    const sellerName = this.getName(seller);
    const buyerName = this.getName(buyer);

    const actionUrl = `${process.env.CLIENT_FRONTEND_BASE_URL}/home?id=${txnId}&ref=${txnRef}&email=${buyer.email}`;

    if (buyer.userId) {
      PushNotifications.create({
        userId: buyer.userId,
        sourceId: 'notification-tx-confirm-seller-' + txnRef,
        type: PushNotificationType.PAYMENT_CONFIRM_SELLER,
        title: 'Your Transaction Was Marked Resolved',
        body: `<b>${sellerName}</b> resolved the transaction: <b>${title}</b>.`,
        transactionInfo: {
          txnId,
          txnRef,
        },
      }).catch(err => {
        Logger.Error('Unable to send transaction resolved by seller notification', err.message, err.stack);
      });

      PushMessagesService.sendMessages(
        buyer.userId!,
        'Your Transaction Was Resolved',
        `${sellerName} just resolved the transaction for: ${title}.`,
      ).catch(err => {
        Logger.Error('Unable to send payment resolved by seller push message', err.message, err.stack);
      });
    }

    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: `Your Transaction Was Marked Resolved - ${referenceDate}`,
      sender: {
        name: 'Distinct AI',
        email: 'noreply@distinct.ai',
      },
      template: {
        id: 'PaymentActionConfirmSeller',
        params: {
          ...params,
          buyerName,
          sellerName,
          title,
          referenceDate,
          confirmTransactionUrl: actionUrl + '&intent=CONFIRM',
          disputeTransactionUrl: actionUrl + '&intent=DISPUTE',
        },
      },
      receivers: [
        {
          name: buyerName,
          email: buyer.email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Email(s) sent successfully.',
    };
  },
};
