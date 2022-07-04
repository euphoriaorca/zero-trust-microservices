import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import Bluebird from 'bluebird';
import faker from 'faker';
import moment from 'moment';
import { SendMailDto, StatusDto } from '@distinctai/service-notifications-ts';
import { createTransport } from 'nodemailer';
import { Logger, ReportError } from '../helpers';
import emailConfig, { IMailSentDto } from '../postmarkapp';

const Mailer = createTransport(emailConfig);

const defaultSender = '"Distinct AI " <noreply@distinct.ai>';

const notEmptyArray = (value: any[]) => {
  return value.length > 0;
};
const formatCurrency = (amount: { currency: string; value: number }) => {
  const { value, currency } = amount;
  return Number(value).toLocaleString('en-US', { style: 'currency', currency });
};
const milestonePercentLeft = (
  totalAmount: { value: number; currency: string },
  milestones: { amount: { value: number }; isDisbursed: boolean }[],
) => {
  const totalPaid = milestones.filter(mst => mst.isDisbursed).reduce((accum, mst) => accum + Number(mst.amount.value), 0);
  const totalLeft = totalAmount.value - totalPaid;
  const percentLeft = (totalLeft / Number(totalAmount.value)) * 100;

  return {
    percentvalue: +(Math.round(percentLeft + <any>'e+2') + 'e-2'),
    amountValue: formatCurrency({ value: totalLeft, currency: totalAmount.currency }),
  };
};
const parseMilestoneDueDate = (dueFormat: string, dateFrom: Date | string) => {
  if (!dateFrom || !dueFormat) {
    return;
  }

  const useFormat = 'ddd, MMM Do YYYY';
  const [, days, weeks, months] = dueFormat
    .trim()
    .split('/')
    .map((f: string) => f.trim())
    .filter(Boolean)
    .map(Number);

  let useDate = moment(dateFrom)
    .utc()
    .toDate();

  if (days === 0 && weeks === 0 && months === 0) {
    return moment(useDate)
      .utc()
      .format(useFormat);
  }

  if (days) {
    useDate = moment(useDate)
      .utc()
      .add(days, 'days')
      .toDate();
  }

  if (weeks) {
    useDate = moment(useDate)
      .utc()
      .add(weeks, 'weeks')
      .toDate();
  }

  if (months) {
    useDate = moment(useDate)
      .utc()
      .add(months, 'months')
      .toDate();
  }

  return moment(useDate)
    .utc()
    .format(useFormat);
};
const parseMilestoneDueText = (dueFormat: string) => {
  const [, days, weeks, months] = dueFormat
    .trim()
    .split('/')
    .map((f: string) => f.trim())
    .filter(Boolean)
    .map(Number);

  if (days) {
    return `In ${days} ` + (days == 1 ? 'Day' : 'Days');
  }

  if (weeks) {
    return `In ${weeks} ` + (weeks == 1 ? 'Week' : 'Weeks');
  }

  if (months) {
    return `In ${months} ` + (months == 1 ? 'Month' : 'Months');
  }

  return 'Immediately';
};

Handlebars.registerHelper('notEmptyArray', notEmptyArray);
Handlebars.registerHelper('formatCurrency', formatCurrency);
Handlebars.registerHelper('milestonePercentLeft', milestonePercentLeft);
Handlebars.registerHelper('getMilestoneDue', parseMilestoneDueDate);
Handlebars.registerHelper('getMilestoneDueText', parseMilestoneDueText);

export const EmailService = {
  /**
   * Send email
   *
   * @param request
   */
  async sendEmail(request: Partial<SendMailDto>): Promise<StatusDto & { data: { accepted: number; failed: number } }> {
    const { subject, template, content, receivers = [], sender } = request;

    let html: string,
      text = content;

    if (template) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const source = fs.readFileSync(path.join('templates', `${template.id}.html`), 'utf-8');

      html = Handlebars.compile(source)(template.params || {});
    }

    let accepted = 0;
    let failed = 0;

    await Bluebird.Promise.map(receivers, async (receiver: any) => {
      const { name, email } = receiver;

      Logger.Info(`Sending an email to ${email}`);

      try {
        const status: IMailSentDto = await Mailer.sendMail({
          subject,
          from: sender ? `"${sender.name || 'Distinct AI'} " <${sender.email || 'noreply@distinct.ai'}>` : defaultSender,
          to: name ? { name, address: email } : email,
          html,
          text,
        });

        accepted += 1;

        Logger.Info(`Email sent to ${email} with message-d: ${status.messageId}`);
      } catch (err) {
        failed += 1;

        Logger.Info(`Error sending email to ${email}`, err.message, err.stack);
        ReportError.reportException(err);
      }
    });

    return {
      success: true,
      message: `Request completed with ${accepted} accepted and ${failed} failed.`,
      data: {
        accepted,
        failed,
      },
    };
  },
  /**
   * Previews an email template with dummy data
   *
   * @param id
   */
  previewEmailTemplate(id: string): any {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const source = fs.readFileSync(path.join('templates', `${id}.html`), 'utf-8');

    const dummyDatas = {
      txnId: faker.random.uuid(),
      txnRef: faker.random.uuid(),
      amount: {
        value: Number(faker.finance.amount(10000, 50000, 2)),
        currency: 'NGN',
      },
      title: faker.commerce.productName(),
      description: faker.lorem.sentences(),
      actionCode: faker.random.number(367232),
      isBuyer: true,
      isDispute: true,
      milestones: [
        {
          amount: {
            value: faker.finance.amount(500, 5000, 2),
            currency: 'NGN',
          },
          dueFormat: 'Date/0/0/0',
          isDisbursed: true,
        },
        {
          amount: {
            value: faker.finance.amount(500, 5000, 2),
            currency: 'NGN',
          },
          dueFormat: 'Date/0/1/0',
          isDisbursed: false,
        },
      ],
      files: [],
      recipient: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
      },
      userName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      referenceDate: moment().format('YYYY-MM-DD HH:mm Z'),
      owner: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
      sellerName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      seller: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
      },
      buyerName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      buyer: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
      },
      extras: {
        fakeSentences: faker.lorem.sentences(),
      },
      confirmedAt: moment.utc().toDate(),
    };

    let html;

    try {
      html = Handlebars.compile(source)(dummyDatas);
    } catch (err) {
      Logger.Error('Email compilation failed: ', err.message, err.stack);
      return 'An error occurred while compiling template';
    }

    return html;
  },
};
