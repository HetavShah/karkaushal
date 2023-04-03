import {
  Listener,
  OrderUpdatedEvent,
  Subjects,
  OrderStatus,
} from "@karkaushal/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

import { Order } from "../../models/order";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
    // data.version will be updated before getting event here . so we need to find 1 version older here
    const order=await Order.findOne({
      _id:data.id,
      version:data.version-1
    });

    // If no order, throw error
    if (!order) {
      throw new Error("Order not found");
    }

    if (data.isPaid) {
      order.set({
        status: data.status,
        isPaid: data.isPaid,
        paidAt: data.paidAt,
        
      });
    } else {
      // Mark the order as being cancelled by setting its status property
      order.set({ status: OrderStatus.Cancelled });
    }

    // Save the order
    await order.save();

    // ack the message
    msg.ack();
  }
}