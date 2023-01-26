import express, { Request, Response } from 'express';
import { Product } from '../models/product';
import { paginatedResults } from '@karkaushal/common';
const router = express.Router();

router.get(
  '/api/products',
  paginatedResults(Product),
  (req: Request, res: Response) => {
    res.send(res.paginatedResults || null);
  }
);

export { router as getAllProductsRouter };


