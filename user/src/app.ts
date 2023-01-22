import express, { Request, Response } from 'express';
import { currentUserRouter } from './routes/currentuser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from '@karkaushal/common';
import cookieSession from 'cookie-session';
import 'express-async-errors';
const app = express();

app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.all('*', async (req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

app.use(errorHandler);
export { app };
