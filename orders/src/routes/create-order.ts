import express, { Request, Response } from 'express';
import { natsWrapper } from '../../NatsWrapper';
import { body } from 'express-validator';
import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@karkaushal/common';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { CartAttrs } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
const router = express.Router();

// Payment window opening time in seconds
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

// 12% current GST rate for all handicraft products
const GST_RATE = 0.12;

// Shipping Charge
const SHIPPING_RATE = 100;

// TODO write validation code for cart  , paymentmethod and shipping address
router.post(
  '/api/orders',
  requireAuth,
  [
    body('cart').notEmpty().withMessage('Cart Items Must be Provided'),
    body('paymentMethod')
      .notEmpty()
      .withMessage('Payment Method must be provided'),
    body('shippingAddress')
      .notEmpty()
      .withMessage('Shipping Address must be provided'),
  ],
  validateRequest,
  async(req: Request, res: Response) => {
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    let { cart, paymentMethod, shippingAddress,image } = req.body;

    let finalItemAmount = 0;
  for(let item of cart) {
      console.log(item.productId);
      console.log(item.sellerId);
      console.log(item.qty);
      const product = await Product.findById(item.productId);
      if (!product) throw new NotFoundError();
      // if the required quantity of the product is grester then the available quantity then throw error
      console.log(product.countInStock);
      if (item.qty > product.countInStock)
        throw new Error('Cannot buy more than ' + product.countInStock);

      // check if the product is reserved or not.
      /* Logic for Reserved Product : If a product available quantity count is equal to 0 then it will have the reserved property*/
      if (product.isReserved) throw new Error('Product is reserved');
      // Calculate the final amount of the cart
      finalItemAmount = finalItemAmount+ (product.price * item.qty);
      // check if product is a valid product
    }
    const totalAmount =
      finalItemAmount + (finalItemAmount * GST_RATE) + SHIPPING_RATE;

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      paymentMethod: paymentMethod,
      itemsPrice: finalItemAmount,
      shippingPrice: SHIPPING_RATE,
      taxPrice: finalItemAmount * GST_RATE,
      totalPrice: totalAmount,
      image:image,
      shippingAddress: shippingAddress,
      cart: cart,
    });
    await order.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart: cart,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    });
    res.status(201).send(order);
  }
);

export { router as createOrder };
