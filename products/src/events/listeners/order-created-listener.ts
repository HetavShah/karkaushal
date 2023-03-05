// TODO : Reserve the product if the quantity becomes 0
import {  OrderCreatedEvent, Subjects } from "@karkaushal/common";
import { Listener } from "@karkaushal/common";
import {Message} from 'node-nats-streaming';
import { natsWrapper } from "../../../NatsWrapper";
import { Product } from "../../models/product";
import { ProductUpdatedPublisher } from "../publishers/product-updated-publisher";
import { queueGroupName } from "./queue-group-name";
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  readonly subject= Subjects.OrderCreated;
  queueGroupName=queueGroupName;
  async onMessage(data:OrderCreatedEvent['data'],msg:Message)
  {
    const cart= data.cart;
    

    if(!cart) throw new Error("Cart Not Found");

    for(let cartItem of cart)
    {
      console.log(cartItem.productId);
      const product = await Product.findById(cartItem.productId);
      
      
      if(!product) throw new Error("Product Not Found");

      const remainingCountInStock=product.countInStock-cartItem.qty;

      // If a user buys the entire available stock  then all the request coming after the following request must get out of stock error (temporary)

      if(remainingCountInStock===0)
      {
       product.isReserved=true;
      }
      product.countInStock=remainingCountInStock;

      await product.save();

      new ProductUpdatedPublisher(natsWrapper.client).publish({
        id: product.id,
        price: product.price,
        title: product.title,
        userId: product.userId,
        images: product.images,
        colors: product.colors,
        sizes: product.sizes,
        brand: product.brand,
        category: product.category,
        material: product.material,
        description: product.description,
        numReviews: product.numReviews,
        rating: product.rating,
        countInStock: product.countInStock,
        isReserved: product.isReserved,
        version: product.version,
      })

    }

    msg.ack();
  }

}