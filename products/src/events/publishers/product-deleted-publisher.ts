import {Subjects,Publisher, ProductDeletedEvent} from '@karkaushal/common';

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent>
{
  readonly subject= Subjects.ProductDeleted;
}