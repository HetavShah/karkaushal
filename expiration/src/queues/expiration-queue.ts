import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../../NatsWrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletedPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };