import { currentUser } from '@karkaushal/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/currentuser', currentUser,(req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
  res.status(200).send({});
});

export { router as currentUserRouter };
