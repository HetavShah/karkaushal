import express,{Request,Response} from 'express';
import {requireAuth} from '@karkaushal/common';
import {Order} from '../models/order';
const router =express.Router();

router.get('/api/orders',requireAuth,async (req:Request, res:Response)=>{
  let orders= await Order.find({
    userId:req.currentUser?.id
  });
  if (!orders) {
    orders = [];
  }

  return res.status(200).send(orders);
})

export {router as getAllOrders}