import moment from 'moment';
import { StatusDto } from '@distinctai/service-notifications-ts';
import { UserService } from './UserService';
import { EmailService } from './EmailService';

export const UserEventService = {
  /**
   * Sends a user welcome email
   *
   * @param userId
   */
  async sendWelcomeEmail(userId: string): Promise<StatusDto> {
    const { firstName, lastName, email } = await UserService.getUserById(userId);

    const mail = await EmailService.sendEmail({
      subject: 'Welcome to Distinct AI! 🎉',
      template: {
        id: 'WelcomeEmail',
        params: {
          firstName,
          lastName,
        },
      },
      receivers: [
        {
          name: `${firstName} ${lastName}`,
          email: email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Welcome email sent successfully.',
    };
  },
  /**
   * Send verification request notification
   *
   * @param userId
   */
  async sendVerificationRequestedNotification(userId: string): Promise<StatusDto> {
    const { firstName, lastName, email } = await UserService.getUserById(userId);

    const mail = await EmailService.sendEmail({
      subject: 'We Received Your Verification Request! 🎉',
      template: {
        id: 'VerificationRequested',
      },
      receivers: [
        {
          name: `${firstName} ${lastName}`,
          email: email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Verification request email sent successfully.',
    };
  },
  /**
   * Send account confirmation email
   *
   * @param userId
   * @param parameters
   */
  async sendAccountConfirmationEmail(userId: string, parameters: { [x: string]: any }): Promise<StatusDto> {
    const { firstName, lastName, email } = await UserService.getUserById(userId);
    const { token } = parameters;

    const mail = await EmailService.sendEmail({
      subject: 'Confirm Your Account',
      template: {
        id: 'ConfirmEmail',
        params: {
          confirmationUrl: `${process.env.MAIN_FRONTEND_BASE_URL}/login/confirm?token=${token}`,
        },
      },
      receivers: [
        {
          name: `${firstName} ${lastName}`,
          email: email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Account confirmation email sent successfully.',
    };
  },
  /**
   * Sends a password reset email
   *
   * @param userId
   * @param parameters
   */
  async sendPasswordResetEmail(userId: string, parameters: { [x: string]: any }): Promise<StatusDto> {
    const { firstName, lastName, email } = await UserService.getUserById(userId);
    const { token } = parameters;
    const referenceDate = moment().format('YYYY-MM-DD HH:mm Z');

    const mail = await EmailService.sendEmail({
      subject: 'Reset Your Password - ' + referenceDate,
      sender: {
        name: 'Distinct AI Support',
        email: 'support@distinct.ai',
      },
      template: {
        id: 'PasswordReset',
        params: {
          resetUrl: `${process.env.MAIN_FRONTEND_BASE_URL}/recover/reset?resetToken=${token}&resetId=${userId}`,
          email,
          referenceDate,
        },
      },
      receivers: [
        {
          name: `${firstName} ${lastName}`,
          email: email!,
        },
      ],
    });

    return {
      success: mail.data.accepted >= 1,
      message: 'Account confirmation email sent successfully.',
    };
  },
};
