import express, { Request, Response } from "express";
import { body,param } from "express-validator";
import { sellerOnly, requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from "@karkaushal/common";
import { Product } from "../models/product";
import type { ProductAttrs } from "../models/types/product";
import { natsWrapper } from "../../NatsWrapper";
import { ProductUpdatedPublisher } from "../events/publishers/product-updated-publisher";
const router = express.Router();
import  rateLimit  from 'express-rate-limit';
const WINDOW_TIME=15*60*1000; // 15 mins
const MAX_REQ=30;
const limiter=rateLimit({
  windowMs:WINDOW_TIME,
  max:MAX_REQ,
  standardHeaders: true, 
	legacyHeaders: false,
  message:JSON.stringify(
    [{
      message:"Too many requests , Try after 15 mins"
    }]
    ) 
  })

// TODO appy rate-limit functionality 
// TODO seller should only be allowed to change the price if the product is not reserved

router.patch(
  "/api/products/:id",
  requireAuth,sellerOnly,limiter,
  [
    param("id").isMongoId().withMessage("correct product id is required"),
    body("title").optional().not().isEmpty().withMessage("title is required"),
    body("price").optional().isFloat({ gt: 0 }).withMessage("price must be greater than 0"),
    body("description").optional().not().isEmpty().withMessage("description is required"),
    body("images").optional().custom((value)=>{
      const size=value.length;
      return size>0 && size<5
    }).withMessage("images must be between 1 to 4"),
    body("category").optional().not().isEmpty().withMessage("category is required"),
    body("countInStock").optional().not().isEmpty()
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
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }
    if(product.userId!==req.currentUser?.id)
    {
        throw new NotAuthorizedError();
    }
    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.images = images ?? product.images;
    product.colors = colors ?? product.colors;
    product.sizes = sizes ?? product.sizes;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.material = material ?? product.material;
    product.description = description ?? product.description;
    product.countInStock = countInStock ?? product.countInStock;

    await product.save();
    
    new ProductUpdatedPublisher(natsWrapper.client).publish({
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

export { router as updateProductRouter };