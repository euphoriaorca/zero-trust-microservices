import express from 'express';

import { AppsController } from '../controllers';
import { validateAppsRequest, validatePermissionsUpdateRequest, validateTokenGenRequest } from '../middlewares';
import { Authentication } from '../middlewares/Authentication';
import { ADMIN_PERMS } from '../constants/permissions';

const router = express.Router();

router.post('/', Authentication.validateAdminUser([ADMIN_PERMS.REGISTER_APPS]), validateAppsRequest(), AppsController.register);

router.post(
  '/permissions',
  Authentication.validateAdminUser([ADMIN_PERMS.UPDATE_APPS]),
  validatePermissionsUpdateRequest(),
  AppsController.updatePermissions,
);

router.post('/token', Authentication.validateAppAuth(), validateTokenGenRequest(), AppsController.generateToken);

export default router;
