import express,{Request,Response} from 'express';
import {requireAuth,validateRequest} from '@karkaushal/common';
import {Order} from '../models/order';
import {param } from 'express-validator';
const router =express.Router();

router.get('/api/orders/:orderId',requireAuth,[
  param("orderId").isMongoId().withMessage("invalid Order Id"),
],validateRequest,async (req:Request, res:Response)=>{
  console.log(req.params.orderId);
  let order= await Order.findById(req.params.orderId).populate('cart.product');
  // console.log(orders)

  return res.status(200).send(order);
})

export {router as getOrder}