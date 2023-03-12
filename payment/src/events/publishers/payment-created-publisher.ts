import { Subjects, Publisher, PaymentCreatedEvent } from "@karkaushal/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}