import express from 'express';
import { RoleTypes } from '@distinctai/security/src/interfaces/IAuthValidatorOptions';
import { CORP_PERMS, USER_PERMS } from '../constants/Permissions';
import { Security, validateAddSubscription, validateRemoveSubscription } from '../middlewares';
import { SubscriptionsController } from '../controllers/SubscriptionsController';

const router = express.Router();

router.post(
  '/me/push/subscriptions',
  Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN, CORP_PERMS.ACCESS_BASIC_INFO], false),
  validateAddSubscription(),
  SubscriptionsController.addSubscription,
);

router.delete(
  '/me/push/subscriptions',
  Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN, CORP_PERMS.ACCESS_BASIC_INFO], false),
  validateRemoveSubscription(),
  SubscriptionsController.removeSubscription,
);

export default router;
