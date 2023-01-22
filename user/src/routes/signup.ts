import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Gender, User, UserAttrs } from '../models/user';
import { BadRequestError, validateRequest } from '@karkaushal/common';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().not().isEmpty().withMessage('Email is not valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),

    body('name').not().isEmpty().withMessage('Name is required'),

    body('gender')
      .not()
      .isEmpty()
      .custom((value) => {
        return Object.values(Gender).includes(value);
      })
      .withMessage("Gender must be one of 'male' , 'female' , 'other'  "),

    body('age')
      .isInt({ gt: 0, lt: 150 })
      .not()
      .isEmpty()
      .withMessage('Age is not valid'),

  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, name, gender, age, shippingAddress ,isAdmin}: UserAttrs =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email Already Exists');
    }

    const user = User.build({
      email,
      password,
      name,
      gender,
      age,
      shippingAddress,
      isAdmin
    });
    await user.save();

    // Generate token
    const useJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: useJWT,
    };

    return res.status(201).send(user);
  }
);

export { router as signupRouter };
