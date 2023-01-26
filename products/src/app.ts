import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@karkaushal/common';
import { createProductRouter } from './routes/product-create';
import { getAllProductsRouter } from './routes/get-all-products';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(createProductRouter);
app.use(getAllProductsRouter)
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
