import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@karkaushal/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Build an order
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      version: data.version,
      paymentMethod: data.paymentMethod,
      itemsPrice: data.itemsPrice,
      shippingPrice: data.shippingPrice,
      taxPrice: data.taxPrice,
      totalPrice: data.totalPrice,
    });
console.log('here on payment');
    await order.save();

    // ack the message
    msg.ack();
  }
}