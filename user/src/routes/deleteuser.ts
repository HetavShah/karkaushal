import express, { Request, Response } from "express";
import { param } from "express-validator";
import { currentUser, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@karkaushal/common";

import { User } from "../models/user";

const router = express.Router();

router.delete(
  "/api/users/:userId",
  [param("userId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
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