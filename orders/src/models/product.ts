import mongoose, { Mongoose } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are requried to create a new Product
interface ProductAttrs {
  title: string;
  price: number;
  id:string;
  image: string;
  countInStock: number;
  isReserved: boolean;
  userId:string
}

// An interface that describes the properties
// that a Product Model has
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ProductDoc | null>;
}

// An interface that describes the properties
// that a Product Document has
export interface ProductDoc extends mongoose.Document<ProductAttrs> {
  title: string;
  price: number;
  id:string;
  image: string;
  countInStock: number;
  version: number;
  isReserved:boolean;
  userId:string;
}

const productSchema = new mongoose.Schema<ProductDoc,ProductModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      default: 1,
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
    image:{
      type:String,
      required:true,
    },
    userId:{
      type:String,
      required:true,
    }

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

productSchema.set("versionKey", "version");

// @ts-ignore
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Product.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id:attrs.id,
    title:attrs.title,
    price:attrs.price,
    countInStock:attrs.countInStock,
    image:attrs.image,
    isReserved:attrs.isReserved,
    userId:attrs.userId
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };