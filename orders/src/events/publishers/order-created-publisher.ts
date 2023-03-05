import {Subjects,Publisher, OrderCreatedEvent} from '@karkaushal/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>
{
  readonly subject= Subjects.OrderCreated;
}