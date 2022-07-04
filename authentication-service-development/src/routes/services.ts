import express from 'express';

import { Authentication } from '../middlewares/Authentication';
import { ADMIN_PERMS } from '../constants';
import { validateServiceRequest, validateTokenGenRequest, validateSvcsPermissionsUpdateRequest } from '../middlewares';
import { ServicesController } from '../controllers';

const router = express.Router();

router.post(
  '/',
  Authentication.validateAdminUser([ADMIN_PERMS.CREATE_SERVICES]),
  validateServiceRequest(),
  ServicesController.createService,
);

// Routes updating services permissions
router.post(
  '/permissions',
  Authentication.validateAdminUser([ADMIN_PERMS.UPDATE_SERVICES]),
  validateSvcsPermissionsUpdateRequest(),
  ServicesController.updatePermissions,
);

// Routes generating a service token
router.post('/token', Authentication.validateServiceAuth(), validateTokenGenRequest(), ServicesController.generateToken);

export default router;
