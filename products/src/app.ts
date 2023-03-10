import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@karkaushal/common';
import { createProductRouter } from './routes/create-product';
import { getAllProductsRouter } from './routes/get-all-products';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';


import  rateLimit  from 'express-rate-limit';
import { updateProductRouter } from './routes/update-product';
import { deleteProductRouter } from './routes/delete-product';
import { createReviewRouter } from './routes/create-review';
import { deleteReviewRouter } from './routes/delete-review';
import { getProductRouter } from './routes/get-product';
import { bestsellerRouter } from './routes/best-seller';
import { uploadImageRouter } from './routes/upload-images';
import { getSellerProductsRouter } from './routes/get-product-by-seller';
const WINDOW_TIME=15*60*1000; // 15 mins
const MAX_REQ=5;
const limiter=rateLimit({
  windowMs:WINDOW_TIME,
  max:MAX_REQ,
  standardHeaders: true, 
	legacyHeaders: false,
  message:JSON.stringify(
    [{
      message:"Too many requests , Try after 15 mins"
    }]
    ) 
  })
const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy:false
}));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(cors());
const dirname = path.resolve()
console.log(path.join(dirname, '/uploads'));
app.use('/uploads', express.static(path.join(dirname, '/uploads')))
app.use(currentUser);
app.use(uploadImageRouter);
app.use(createProductRouter);
app.use(bestsellerRouter);
app.use(getSellerProductsRouter);
app.use(getAllProductsRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);
app.use(createReviewRouter);
app.use(deleteReviewRouter);
app.use(getProductRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
