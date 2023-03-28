import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@karkaushal/common';
import helmet from 'helmet';
import { CreateChargeRouter } from './routes/create-payment';
const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(helmet());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);
app.use(CreateChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
