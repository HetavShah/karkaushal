import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@karkaushal/common";
import { Message } from "node-nats-streaming";
import {queueGroupName} from './queue-group-name';
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${Math.round(delay / (1000 * 60))} minutes to process the job`);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}