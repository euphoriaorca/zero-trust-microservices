import express from 'express';
import cors from 'cors';
import { handleRouteError } from '../handlers';
import pushMessagesRoutes from './pushmessage';
import emailRoutes from './email';
import eventsRoutes from './events';
import subsRoutes from './subscriptions';

const router: express.Router = express.Router();

router.use(cors());

router.use('/health', (req, res) => {
  res.send({ status: 'OK' });
});

router.use(emailRoutes);
router.use(pushMessagesRoutes);
router.use(eventsRoutes);
router.use(subsRoutes);

router.use(handleRouteError);

export default router;
