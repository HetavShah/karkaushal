import {
  Subjects,
  Listener,
   PaymentCreatedEvent,
  OrderStatus,
} from '@karkaushal/common';
import { type Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../NatsWrapper';
import { Order } from '../../models/order';
import {queueGroupName} from './queue-group-name';
import { OrderUpdatedPublisher } from '../publishers/order-updated-publisher';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage (data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (order == null) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
      isPaid: true,
      paidAt: new Date()
    });
    await order.save();

    // publishing an event saying this was cancelled!
    await new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Complete,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: order.isDelivered
    });

    msg.ack();
  }
}