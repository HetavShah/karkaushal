import express,{Request,Response} from 'express';
import {param} from 'express-validator';
import {requireAuth,NotFoundError, validateRequest, NotAuthorizedError,OrderStatus} from '@karkaushal/common';
import {Order} from '../models/order'; 
import { OrderUpdatedPublisher } from '../events/publishers/order-updated-publisher';
import { natsWrapper } from '../../NatsWrapper';
const router=express.Router();

router.patch('/api/orders/:orderId',requireAuth,[
 param("orderId").isMongoId().withMessage("Order Id is invalid")
],validateRequest,async (req:Request,res:Response)=>{

  const {orderId} = req.params;
  const order= await Order.findById(orderId).populate('cart.product');
  if(!order) throw new NotFoundError();
  if(order.userId!==req.currentUser?.id) throw new NotAuthorizedError();
  if(order.status==OrderStatus.Cancelled) throw new Error("Order Already Cancelled");

  order.status=OrderStatus.Cancelled;
  await order.save();
  let cartData=[];
  for(let item of order.cart)
  {
    // @ts-ignore
    delete item.id;
    cartData.push(item);
  }
  console.log(cartData);
  new OrderUpdatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    //@ts-ignore
    cart:cartData,
    expiresAt: order.expiresAt,
    version: order.version,
    paymentMethod: order.paymentMethod,
    itemsPrice: order.itemsPrice,
    shippingPrice: order.shippingPrice,
    taxPrice: order.taxPrice,
    totalPrice: order.totalPrice,
    isPaid: order.isPaid,
    isDelivered: order.isDelivered,
  });

  res.status(200).send({
    message:"Order Cancelled Successfully"
  })

});

export {router as cancelOrder}