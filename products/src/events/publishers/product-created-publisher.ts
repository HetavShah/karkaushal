import {Subjects,Publisher, ProductCreatedEvent} from '@karkaushal/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent>
{
  readonly subject= Subjects.ProductCreated;
}