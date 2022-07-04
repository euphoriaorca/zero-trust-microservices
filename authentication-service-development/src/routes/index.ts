import express from 'express';
import { handleRouteError } from '../handlers';

import appsRoutes from './apps';
import servicesRoutes from './services';
import userRoutes from './user';

const router: express.Router = express.Router();

router.use('/health', (req, res) => {
  res.send({ status: 'OK' });
});

router.use('/apps', appsRoutes);

router.use('/services', servicesRoutes);

router.use('/user', userRoutes);

router.use(handleRouteError);

export default router;
