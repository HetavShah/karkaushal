import { requireAuth,sellerOnly,validateRequest } from "@karkaushal/common";
import express, { Request, Response } from "express";
import { Product } from "../models/product";
import { param } from "express-validator";
const router = express.Router();

router.get(
  "/api/products/seller/:id",
  requireAuth,sellerOnly,[
    param("id").isMongoId().withMessage("Valid Seller Id is required")
  ],validateRequest,
  async (req: Request, res: Response) => {
   const products=await Product.find({
    userId:req.params.id
   })

    res.status(200).send({
      results:products
    });
  }
);

export { router as getSellerProductsRouter };