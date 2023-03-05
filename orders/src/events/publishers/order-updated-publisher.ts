import {Subjects,Publisher, OrderUpdatedEvent} from '@karkaushal/common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent>
{
  readonly subject= Subjects.OrderUpdated;
}