import express from 'express';
import { RoleTypes } from '@distinctai/security/src/interfaces/IAuthValidatorOptions';
import { USER_PERMS, SERVICE_PERMS, CORP_PERMS } from '../constants/Permissions';
import { Security, validateSendPushMessage } from '../middlewares';
import { PushMessageController } from '../controllers/PushMessageController';

const router = express.Router();

router.get(
  '/me/push/messages',
  Security.requiresRolePermissions(RoleTypes.ROLE_USER, [USER_PERMS.FULL_LOGIN, CORP_PERMS.ACCESS_BASIC_INFO], false),
  PushMessageController.getPushMessages,
);

router.post(
  '/push/messages',
  Security.requiresRolePermissions(RoleTypes.ROLE_SERVICE, [SERVICE_PERMS.PUSH_MESSAGES_SEND]),
  validateSendPushMessage(),
  PushMessageController.sendPushMessage,
);

export default router;
