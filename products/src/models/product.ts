import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { ProductAttrs, ProductDoc, ProductModel } from './types/product';
import { reviewSchema } from './review';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    images:[String],
    colors: { type: String },
    sizes: { type: String },
    brand: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    numReviews: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
    },
    isReserved: {
      type: Boolean,
      default: false,
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
productSchema.index({
  title: 'text',
})
productSchema.index({
  userId:'hashed'
})
productSchema.set('versionKey', 'version');

productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>('Product',productSchema);

export { Product };
