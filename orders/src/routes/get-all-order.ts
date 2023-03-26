import express,{Request,Response} from 'express';
import {requireAuth} from '@karkaushal/common';
import {Order} from '../models/order';
import { Product } from '../models/product';
const router =express.Router();

router.get('/api/orders',requireAuth,async (req:Request, res:Response)=>{

  if(!req.currentUser?.isSeller)
  {
    
     let orders= await Order.find({
      userId:req.currentUser?.id
    });
    return res.status(200).send(orders);
  }
  else {
    let orders=await Order.find({
      "cart.sellerId":req.currentUser?.id
    });
    return res.status(200).send(orders);
  } 
})

export {router as getAllOrders}