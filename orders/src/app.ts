import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@karkaushal/common';
import helmet from 'helmet';

import { createOrder } from './routes/create-order';
import { cancelOrder } from './routes/cancel-order';
import { getAllOrders } from './routes/get-all-order';
import { getOrder } from './routes/get-order';

const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(helmet());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createOrder);
app.use(cancelOrder);
app.use(getOrder);
app.use(getAllOrders);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
