import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ProductUpdatedEvent,
  NotFoundError,
} from "@karkaushal/common";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../models/product";

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent["data"], msg: Message) {
    try{

      const{ id, title, price, images, countInStock,isReserved ,userId} = data;
      // console.log(data);
  
      const product = await Product.findByEvent(data);
  
      if (!product) {
        throw new NotFoundError();
      }
  
      product.set({
        title,
        price,
        id,
        image: images[0],
        countInStock,
        isReserved,
        userId
      });
  
      // Save and update version
      await product.save();
  
      // Acknowledge the message and tell NATS server it successfully processed
      msg.ack();
    }catch(error)
    {
      console.error(error);
    }
  }
}