import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@karkaushal/common';
import { ProductDoc } from './product';

export interface CartAttrs {
  title: string;
  qty: number;
  price: number;
  productId: string;
  product?: ProductDoc;
  image?: string;
  sellerId: string;
}

interface ShippingAddressAttrs {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

enum PaymentMethod {
COD='Cash-On-Delivery',
STRIPE='Stripe-Gateway'
}
// An interface that describes the properties
// that are requried to create a new Order
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  cart: Array<CartAttrs>;
  shippingAddress?: ShippingAddressAttrs;
  paymentMethod: PaymentMethod;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: Date;
  isDelivered?: boolean;
  deliveredAt?: Date;
  image?:string
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  cart: Array<CartAttrs>;
  shippingAddress?: ShippingAddressAttrs;
  paymentMethod: PaymentMethod;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: Date;
  isDelivered?: boolean;
  deliveredAt?: Date;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const orderSchema = new mongoose.Schema<OrderDoc,OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    cart: [
      {
        title: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        productId: { type: String, required: true },
        sellerId:{type:String,required:true},
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        image:{type: String}
      },
    ],
    shippingAddress: {
      address: { type: String,required:true },
      city: { type: String,required:true },
      postalcode: { type: String ,required:true },
      country: { type: String,required:true },
    },
    paymentMethod:{
      type: String,
      enum:Object.values(PaymentMethod),
      required:true     
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    taxPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);
orderSchema.index({
  userId:'hashed'
})
orderSchema.set('versionKey', 'version');

// @ts-ignore
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
