import express,{Request,Response} from 'express';
import {requireAuth,validateRequest} from '@karkaushal/common';
import {Order} from '../models/order';
import {param } from 'express-validator';
const router =express.Router();

router.get('/api/orders/:orderId',requireAuth,[
  param("orderId").isMongoId().withMessage("invalid Order Id"),
],validateRequest,async (req:Request, res:Response)=>{

  let orders= await Order.find({
    userId:req.currentUser?.id,
    id:req.params.orderId
  });

  if (!orders) {
    orders = [];
  }

  return res.status(200).send(orders);
})

export {router as getOrder}