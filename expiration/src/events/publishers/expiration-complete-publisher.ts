import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@karkaushal/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
