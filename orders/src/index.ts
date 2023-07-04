import mongoose from 'mongoose';
import {app} from './app';
import { natsWrapper } from "../NatsWrapper";
import { ProductCreatedListener } from './events/listeners/product-created-listener';
import { ProductUpdatedListener } from './events/listeners/product-updated-listener';
import { ExpirationCompletedListener } from './events/listeners/expiration-completed-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { metricsService } from './service/monitor';
const start=async ()=>{
console.log("Starting Orders....");
  if(!process.env.JWT_KEY)
  {
    throw new Error('JWT_KEY environment variable is not set');
  }
  if(!process.env.MONGO_URI)
  {
    throw new Error('MONGO_URI environment variable is not set');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  
  try{
    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
  
      natsWrapper.client.on("close", () => {
        console.log("NATS connection closed!");
        process.exit();
      });
  
      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());
 
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");

      new ProductCreatedListener(natsWrapper.client).listen();
      new ProductUpdatedListener(natsWrapper.client).listen();
      new ExpirationCompletedListener(natsWrapper.client).listen();
      new PaymentCreatedListener(natsWrapper.client).listen();

    } catch (err) {
      console.error(err);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');

  }catch(err)
  {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000.');
    }); 
    metricsService();
};

start();
