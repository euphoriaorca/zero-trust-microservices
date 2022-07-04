import express from 'express';
import { RoleTypes } from '@distinctai/security/src/interfaces/IAuthValidatorOptions';
import { SERVICE_PERMS } from '../constants/Permissions';
import { Security, validateEventReceive } from '../middlewares';
import { EventController } from '../controllers/EventController';

const router = express.Router();

router.post(
  '/receive-event',
  Security.requiresRolePermissions(RoleTypes.ROLE_SERVICE, [SERVICE_PERMS.EVENT_SEND]),
  validateEventReceive(),
  EventController.receiveEvent,
);

export default router;
