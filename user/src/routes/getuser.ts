import express, { Request, Response } from 'express';
import { databseResponseTimeHistogram } from '../services/monitor';
import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@karkaushal/common';
import { User } from '../models/user';
import { param } from 'express-validator';
const router = express.Router();
// TODO Caching
router.get(
  '/api/users/:userId',
  currentUser,
  requireAuth,
  [param('userId').isMongoId().withMessage('Invalid Id')],
  validateRequest,
  async (req: Request, res: Response) => {
    // if user is trying to access another user profile
    if (req.currentUser?.id !== req.params.userId) {
      throw new NotAuthorizedError();
    }
    const metricsLabels={
      operation:'find-user'
    }

    const timer=databseResponseTimeHistogram.startTimer();
    const user = await User.findOne({ id: req.currentUser?.id });

    timer({...metricsLabels,success:'true'});
    if (!user) {
      throw new NotFoundError();
    }

    res.status(200).send(user);
  }
);

export { router as getUserRouter };
