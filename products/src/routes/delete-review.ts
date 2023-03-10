import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@karkaushal/common";

import { Product } from "../models/product";
import { Review } from "../models/review";

const router = express.Router();

router.delete(
  "/api/products/:productId/reviews",
  requireAuth,
  [param("productId").isMongoId().withMessage("Invalid Id")],
  validateRequest,
  async (req: Request, res: Response) => {
    // Check the product is existing
    const product = await Product.findById(req.params.productId);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.reviews) {
      const deletedId = product.reviews.find(
        (review) => review.userId === req.currentUser?.id
      );

      if (!deletedId) {
        throw new NotFoundError();
      }

      const deletedReview = await Review.findById(deletedId.id);

      if (!deletedReview) {
        throw new NotFoundError();
      }

      await deletedReview.remove();

      // Filter all reviews of the product *EXCEPT* the review of this user
      const updateReviews = product.reviews.filter(
        (review) => review.userId !== req.currentUser!.id
      );

      // Calculate numReviews and rating
      let numReviews;
      let productRating;
      if (updateReviews.length > 0) {
        numReviews = updateReviews.length;
        productRating =
          updateReviews.reduce((acc, item) => item.rating + acc, 0) /
          numReviews;
      } else {
        numReviews = 0;
        productRating =
          updateReviews.reduce((acc, item) => item.rating + acc, 0) / 1;
      }

      // Update Product
      product.reviews = updateReviews;
      product.numReviews = numReviews ?? product.numReviews;
      product.rating = parseFloat(productRating.toFixed(1)) ?? product.rating;

      await product.save();
    }

    res.status(200).send({
      message:"Product deleted  successfully"
    });
  }
);

export { router as deleteReviewRouter };