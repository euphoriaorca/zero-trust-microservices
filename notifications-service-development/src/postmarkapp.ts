/// <reference types="./@types/nodemailer-postmark-transport" />

import postmarkTransport from 'nodemailer-postmark-transport';

export interface IMailSentDto {
  messageId: string;
  accepted: [
    {
      To: string;
      SubmittedAt: string;
      MessageID: string;
      ErrorCode: string;
      Message: string;
    },
  ];
  rejected: [];
}

export default postmarkTransport({
  auth: {
    apiKey: process.env.POSTMARK_API_KEY || '_postmarkapp-key',
  },
});
