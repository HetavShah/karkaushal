import express, { Request, Response } from "express";
import { param } from "express-validator";
import { currentUser, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@karkaushal/common";

import { User } from "../models/user";

const router = express.Router();

//  TODO : reviews  of the user should be deleted from the product .create one listener in product and create one producer in user and crearte user:deleted event 
router.delete(
  "/api/users/:userId",
  [param("userId").isMongoId().withMessage("Invalid Id")],
  currentUser,requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
   
    if (req.currentUser?.id !== req.params.userId) {
      throw new NotAuthorizedError();
    }

    const user = await User.findOne({ id: req.currentUser?.id });
    if (!user) {
      throw new NotFoundError();
    }
    await user.remove();

    res.status(200).send({message:"User deleted successfully"});
  }
);

export { router as deleteUserRouter };