import mongoose from "mongoose";
import { IProduct, ProductType } from "../../Types/types";

const { Schema } = mongoose;

/* Product Schema */
const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: /^[A-Za-z0-9_-]+$/,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    description: {
      type: String,
      maxlength: 1000,
      default: null,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    type: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
      default: ProductType.PUBLIC,
    },

    price: {
      type: Number,
      required: true,
      min: 0.01,
      validate: {
        validator: (v: number) =>
          Number.isFinite(v) && Number.isInteger(Math.round(v * 100)),
        message: "Price must have at most 2 decimal places",
      },
    },

    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (this: IProduct, value: number | null) {
          if (value === null) return true;
          return value >= 0 && value < this.price;
        },
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger,
    },
  },
  {
    timestamps: true,
  }
);

/* Indexes */
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ type: 1 });

/* Product Model */
export const ProductModel =
  mongoose.models.ProductModel ||
  mongoose.model<IProduct>("ProductModel", productSchema);
