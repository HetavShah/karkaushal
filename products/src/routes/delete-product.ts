import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  sellerOnly,
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorizedError
} from "@karkaushal/common";
import { ProductDeletedPublisher } from "../events/publishers/product-deleted-publisher";
import { natsWrapper } from "../../NatsWrapper";
import { Product } from "../models/product";

const router = express.Router();

router.delete(
  "/api/products/:productId",
  requireAuth,
  sellerOnly,
  [param("productId").isMongoId().withMessage("Invalid Id")],
  validateRequest,
  async (req: Request, res: Response) => {
    const deletedProduct = await Product.findById(req.params.productId);

    // Check the product is existing
    if (!deletedProduct) {
      throw new NotFoundError();
    }

    // check if the product belongs to the correct seller
    if(deletedProduct.userId!==req.currentUser?.id){
      throw new NotAuthorizedError();
    }
    

    await deletedProduct.remove();
    new ProductDeletedPublisher(natsWrapper.client).publish({
      id: deletedProduct.id,
      version: deletedProduct.version
    })

    res.status(200).send({
      message: "Product deleted successfully"
    });
  }
);

export { router as deleteProductRouter };