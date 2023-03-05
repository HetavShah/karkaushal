import express, { Request, Response } from "express";
import { body } from "express-validator";
import { sellerOnly, requireAuth, validateRequest } from "@karkaushal/common";
import { Product } from "../models/product";
import type { ProductAttrs } from "../models/types/product";
import { ProductCreatedPublisher } from "../events/publishers/product-created-publisher";
const router = express.Router();
import { natsWrapper } from "../../NatsWrapper";
router.post(
  "/api/products",
  requireAuth,sellerOnly,
  [
    body("title").not().isEmpty().withMessage("title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("price must be greater than 0"),
    body("description").not().isEmpty().withMessage("description is required"),
    body("images").custom((value)=>{
      const size=value.length;
      return size>0 && size<5
    }).withMessage("images must be between 1 to 4"),
    body("category").not().isEmpty().withMessage("category is required"),
    body("countInStock").not().isEmpty()
    .isInt({gt:0}).withMessage("Product count is required")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      images,
      colors,
      sizes,
      brand,
      category,
      material,
      description,
      countInStock,
    }: ProductAttrs = req.body;

    const product = Product.build({
      title,
      price,
      userId: req.currentUser!.id,
      images,
      colors,
      sizes,
      brand,
      category,
      material,
      description,
      countInStock,
    });
    await product.save();
    new ProductCreatedPublisher(natsWrapper.client).publish({
      id: product.id,
      price: product.price,
      title: product.title,
      userId: product.userId,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      brand: product.brand,
      category: product.category,
      material: product.material,
      description: product.description,
      numReviews: product.numReviews,
      rating: product.rating,
      countInStock: product.countInStock,
      isReserved: product.isReserved,
      version: product.version,

    });
    res.status(201).send(product);
  }
);

export { router as createProductRouter };