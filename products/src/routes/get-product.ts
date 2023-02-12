import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotFoundError, validateRequest } from "@karkaushal/common";
import { Product } from "../models/product";

const router = express.Router();

router.get(
  "/api/products/:productId",
  [param("productId").isMongoId().withMessage("Invalid id")],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.productId);
    

    if (!product) {
      throw new NotFoundError();
    }

    res.send(product);
  }
);

export { router as getProductRouter };