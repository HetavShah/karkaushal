import {
  Listener,
  OrderUpdatedEvent,
  Subjects,
  OrderStatus,
  NotFoundError
} from "@karkaushal/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../NatsWrapper";

import { Product } from "../../models/product";
import { ProductUpdatedPublisher } from "../publishers/product-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = queueGroupName

  async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
    // Check order status
    if (data.status !== OrderStatus.Cancelled) {
      // Do nothing, just ack the message
      return msg.ack();
    }

    const items = data.cart;

    if (!items) {
      throw new Error("Cart not found");
    }
    items.forEach(async (item)=>{

      const product=await Product.findById(item.productId);
      if(!product) throw new NotFoundError();

        // Increase the product quantity in stock by return quantity from the cancelled order
        const newCountInStock = product.countInStock + item.qty;

        product.countInStock = newCountInStock;

        if(product.isReserved)
        {
          product.isReserved = false;
        }

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
    });

msg.ack();


  }
}