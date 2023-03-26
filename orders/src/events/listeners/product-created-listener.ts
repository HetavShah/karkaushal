import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ProductCreatedEvent } from '@karkaushal/common';
import { queueGroupName } from './queue-group-name';
import { Product } from '../../models/product';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, title, price, images, countInStock,userId } = data;

    const product = Product.build({
      title,
      price,
      id,
      image: images[0],
      countInStock,
      isReserved: false,
      userId
    });
    // console.log("Order Service : "+product);
    await product.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
