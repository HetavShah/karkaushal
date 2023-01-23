import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest ,BadRequestError } from '@karkaushal/common';
const router = express.Router();
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must not be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    // console.log(existingUser);

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate token
    const useJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        isSeller: existingUser.isSeller,
        name: existingUser.name,
        gender: existingUser.gender,
        age: existingUser.age,
        shippingAddress: existingUser.shippingAddress,
      },
      process.env.JWT_KEY!
    )
    // Store it on session object
    req.session = {
      jwt: useJWT,
    };

    return res.status(200).send(existingUser);
  }
);

export { router as signinRouter };

