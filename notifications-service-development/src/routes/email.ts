import express from 'express';
import { RoleTypes } from '@distinctai/security/src/interfaces/IAuthValidatorOptions';
import { SERVICE_PERMS } from '../constants/Permissions';
import { Security, validateSendMail, validateAddContactToList } from '../middlewares';
import { EmailController } from '../controllers/EmailController';

const router = express.Router();

router.get('/email-template/preview', EmailController.previewEmailTemplate);

router.post(
  '/emails/send',
  Security.requiresRolePermissions(RoleTypes.ROLE_SERVICE, [SERVICE_PERMS.EMAIL_SEND]),
  validateSendMail(),
  EmailController.sendMail,
);

router.post(
  '/emails/mailing-lists/add-user',
  Security.requiresRolePermissions(RoleTypes.ROLE_SERVICE, [SERVICE_PERMS.EMAIL_LIST_ADD]),
  validateAddContactToList(),
  EmailController.addContactToList,
);

export default router;
