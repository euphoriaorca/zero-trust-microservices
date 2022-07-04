/* istanbul ignore file */

import { validationResult, body } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ContextRunner } from 'express-validator/src/chain';
import { ErrorCode } from '../../constants';
import { isObject } from 'util';

/**
 * Uniform handling of express validators
 * @param validations
 */
export const Validator = {
  validate: (validations: ContextRunner[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validations.map((validation: ContextRunner) => validation.run(req)));

      const errors = validationResult(req);

      if (errors.isEmpty()) return next();

      res.status(400).json({
        code: ErrorCode.BAD_REQUEST,
        errors: errors.array().map(({ param, msg }) => ({
          param,
          message: msg,
        })),
      });
    };
  },
};

const isNonEmptyString = (str: any, len?: number) => str && 'string' === typeof str && str.length > (len! || 0);

export const validateSendMail = () => {
  return Validator.validate([
    body('subject', 'All outgoing Distinct AI email must always have a subject.').custom((subject: any) => isNonEmptyString(subject)),
    body('template.id', 'Provide a valid template Id.')
      .if((v: any, { req }: any) => !req.body.content)
      .custom((id: any) => isNonEmptyString(id)),
    body('template.params', 'Provide a valid template param object.')
      .optional()
      .custom((params: any) => isObject(params)),
    body('content', 'Provide a valid email text content.')
      .if((v: any, { req }: any) => !req.body.template)
      .custom((content: any) => isNonEmptyString(content)),
    body('sender.name', 'Provide a valid sender name.').optional().isString(),
    body('sender.email', 'Provide a valid sender email.').optional().isEmail(),
    body('receivers', 'Provide an array of one or more receivers').custom(
      (receivers: any) => Array.isArray(receivers) && receivers.length >= 1,
    ),
    body('receivers.*.name', 'Provide a valid recipient name')
      .optional()
      .custom((name: any) => isNonEmptyString(name)),
    body('receivers.*.email', 'Provide a valid recipient email').isEmail(),
    // eslint-disable-next-line quotes
    body('cc', "Provide an array of cc's")
      .optional()
      .custom((ccs: any) => Array.isArray(ccs)),
    body('cc.*.name', 'Provide a valid cc name')
      .optional()
      .custom((name: any) => isNonEmptyString(name)),
    body('cc.*.email', 'Provide a valid cc email').isEmail(),
    // eslint-disable-next-line quotes
    body('bcc', "Provide an array of bcc's")
      .optional()
      .custom((bccs: any) => Array.isArray(bccs)),
    body('bcc.*.name', 'Provide a valid bcc name')
      .optional()
      .custom((name: any) => isNonEmptyString(name)),
    body('bcc.*.email', 'Provide a valid bcc email').isEmail(),
  ]);
};

export const validateAddContactToList = () => {
  return Validator.validate([
    body('listId', 'Provide mailing list Id.').isUUID(),
    body('contact', 'Provide a contact object.').custom((recipient: any) => isObject(recipient)),
    body('contact.email', 'Provide a valid contact email address.').isEmail(),
    body('contact.firstName', 'Provide a valid contact firstName')
      .optional()
      .custom((firstName: any) => isNonEmptyString(firstName, 3)),
    body('contact.lastName', 'Provide a valid contact lastName')
      .optional()
      .custom((lastName: any) => isNonEmptyString(lastName, 3)),
    body('contact.country', 'Provide a valid country')
      .optional()
      .custom((country: any) => isNonEmptyString(country, 2)),
    body('contact.phoneNumber', 'Provide a valid contact firstName').optional().isMobilePhone('any'),
  ]);
};

export const validateSendPushMessage = () => {
  return Validator.validate([
    body('recipient', 'Provide a recipient object').custom(
      (recipient: any) => isObject(recipient) && (recipient.userId || recipient.subscriptionId),
    ),
    body('recipient.userId', 'Provide a valid recipient userId').optional().isUUID(4),
    body('recipient.subscriptionId', 'Provide a valid recipient subscriptionId').optional().isUUID(4),

    body('message', 'Provide a valid message object').custom((recipient: any) => isObject(recipient)),
    body('message.title', 'Provide a valid message body')
      .optional()
      .custom((body) => isNonEmptyString(body)),
    body('message.body', 'Provide a valid message body').custom((body) => isNonEmptyString(body)),
    body('message.data', 'Provide a recipient object')
      .optional()
      .custom((data: any) => isObject(data) || Array.isArray(data)),
  ]);
};

export const validateAddSubscription = () => {
  return Validator.validate([
    body('platform', 'Provide a valid platform type.').custom((platform) => isNonEmptyString(platform)),
    body('subscriptionId', 'Provide a subscription Identifier.').custom((subscriptionId) => isNonEmptyString(subscriptionId)),
  ]);
};

export const validateRemoveSubscription = () => {
  return Validator.validate([
    body('subscriptionId', 'Provide a subscription Identifier.').custom((subscriptionId) => isNonEmptyString(subscriptionId)),
  ]);
};
