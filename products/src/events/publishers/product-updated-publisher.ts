import {Subjects,Publisher, ProductUpdatedEvent} from '@karkaushal/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent>
{
  readonly subject= Subjects.ProductUpdated;
}