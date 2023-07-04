import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Gender, User, UserAttrs } from '../models/user';
import { BadRequestError, validateRequest } from '@karkaushal/common';
import { databseResponseTimeHistogram } from '../services/monitor';
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
    body('pehchanCardNo')
    .if(body('isSeller').custom(value=>{return value}))
       .not().isEmpty()
       .withMessage('Pehchan Card No is Required'),
    body('shopAddress')
    .if(body('isSeller').custom(value=>{return value}))
    .not().isEmpty()
    .withMessage('Shop Address is Required'),

  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      name,
      gender,
      age,
      shippingAddress,
      isSeller,
      pehchanCardNo,
      shopAddress,
      website
    }: UserAttrs = req.body;

    const existingUser = await User.findOne({
      $or:[{ email },{pehchanCardNo}]
    });

    if (existingUser) {
      throw new BadRequestError('User Already Exists');
    }
    let user;
      if(!isSeller)
      {
        user = User.build({
          email,
          password,
          name,
          gender,
          age,
          shippingAddress,
          isSeller,
        });
      }
      else
      {
        user = User.build({
          email,
          password,
          name,
          gender,
          age,
          shopAddress,
          website,
          pehchanCardNo,
          isSeller,
        });

      }

      const metricsLabels={
        operation:'create-user'
      }
      const timer=databseResponseTimeHistogram.startTimer();
   
    await user.save();

    timer({...metricsLabels,success:'true'});
    // console.log(user.isSeller);

    // Generate token
    const useJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isSeller:user.isSeller,
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
