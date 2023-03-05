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
    const{ id, title, price, images, countInStock,isReserved } = data;
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
      isReserved
    });

    // Save and update version
    await product.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}