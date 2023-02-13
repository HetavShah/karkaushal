import express, { Request, Response } from 'express';
import { Product } from '../models/product';
import { paginatedResults,validateRequest } from '@karkaushal/common';
import {query} from 'express-validator';
const router = express.Router();


router.get(
  '/api/products',
  [
    query("page").notEmpty().withMessage("page field is required"),
    query("limit").notEmpty().withMessage("Limit field is required")
  ],
  validateRequest,
  paginatedResults(Product),
  (req: Request, res: Response) => {
    res.send(res.paginatedResults || null);
  }
);

export { router as getAllProductsRouter };


