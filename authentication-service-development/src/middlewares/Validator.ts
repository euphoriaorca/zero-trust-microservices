/* istanbul ignore file */

import { validationResult, body } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ContextRunner } from 'express-validator/src/chain';
import { ErrorCode } from '../constants';
import { AppTypes } from '../interfaces';

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

/**
 * Validate request for app registration
 */
export const validateAppsRequest = () => {
  const inspectAppTypes = (appType: string): boolean => appType === AppTypes.BROWSER;
  const isBrowser = (v: any, { req }: any) => req.body.appType === AppTypes.BROWSER;

  return Validator.validate([
    body('appType', 'Provide valid application type. See docs.').custom(inspectAppTypes),
    body('description', 'Describe this application')
      .isLength({
        min: 15,
        max: 1000,
      })
      .trim(),
    body('permissions', 'An array of permissions is expected').optional().isArray(),
    body('domain', 'Provide the domain where requests will be made from').if(isBrowser).isURL(),
  ]);
};

/**
 * Validate request for permissions update
 */
export const validatePermissionsUpdateRequest = () => {
  return Validator.validate([
    body('appId', 'Provide a valid application identifier').isUUID(),
    body('permissions', 'An array of permissions is expected').custom((permissions: string[]) => {
      return permissions.length > 0;
    }),
  ]);
};

/**
 * Validate request for token generation
 */
export const validateTokenGenRequest = () => {
  return Validator.validate([
    body('payload', 'Provide a valid payload value. Payload can only ever be an object, number or string.')
      .optional()
      .custom((payload: any) => {
        const pt = typeof payload;

        return pt === 'object' || pt === 'string' || pt === 'number';
      }),
  ]);
};

/**
 * Validate service creation request
 */
export const validateServiceRequest = () => {
  return Validator.validate([
    body('description', 'Describe this application')
      .isLength({
        min: 2,
        max: 1000,
      })
      .trim(),
    body('permissions', 'An array of permissions is expected').optional().isArray(),
  ]);
};

/**
 * Validate request for permissions update
 */
export const validateSvcsPermissionsUpdateRequest = () => {
  return Validator.validate([
    body('serviceId', 'Provide a valid service identifier').isUUID(),
    body('permissions', 'An array of permissions is expected').isArray(),
  ]);
};

/**
 * Validate user handshake token request
 */
export const validateUserHtokenRequest = () => {
  return Validator.validate([
    body('userId', 'A valid user ID is required').isUUID().trim(),
    body('payload', 'Provide a valid payload value. Payload can only ever be an object, number or string.')
      .optional()
      .custom((payload: any) => {
        const pt = typeof payload;

        return pt === 'object' || pt === 'string' || pt === 'number';
      }),
  ]);
};

/**
 * validate user token request
 */
export const validateUserTokenRequest = () => {
  return Validator.validate([
    body('htoken', 'A JWT handskahe token is expected').isJWT(),
    body('permissions', 'An array of permissions is expected').custom((permissions: string[]) => {
      return permissions && permissions.length > 0;
    }),
    // eslint-disable-next-line quotes
    body('ttl', "Token's TTL in seconds").isNumeric(),
    body('payload', 'Provide a valid payload value. Payload can only ever be an object, number or string.')
      .optional()
      .custom((payload: any) => {
        const pt = typeof payload;

        return pt === 'object' || pt === 'string' || pt === 'number';
      }),
  ]);
};
