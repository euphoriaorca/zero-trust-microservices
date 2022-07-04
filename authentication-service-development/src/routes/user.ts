import express from 'express';

import { Authentication } from '../middlewares/Authentication';
import { PERMS } from '../constants/permissions';
import { UserController } from '../controllers/UserController';
import { validateUserHtokenRequest, validateUserTokenRequest } from '../middlewares';

const router = express.Router();

router.post(
  '/htoken',
  Authentication.validateJWToken([PERMS.GENERATE_USER_TOKEN]),
  validateUserHtokenRequest(),
  UserController.generateHToken,
);

router.post(
  '/token',
  Authentication.validateJWToken([PERMS.GENERATE_USER_TOKEN]),
  validateUserTokenRequest(),
  UserController.generateToken,
);

export default router;
