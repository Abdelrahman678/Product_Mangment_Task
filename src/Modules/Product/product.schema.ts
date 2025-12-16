import Joi from "joi";
import { ProductType } from "./../../Types/types";

/* Create Product Schema */
export const createProductSchema = {
  body: Joi.object({
    sku: Joi.string()
      .pattern(/^[a-zA-Z0-9-_]+$/)
      .min(3)
      .max(50)
      .required()
      .messages({
        "any.required": "SKU is required",
        "string.base": "SKU must be a string",
        "string.pattern.base":
          "SKU must be alphanumeric, hyphens and underscores",
        "string.min": "SKU must be at least 3 characters",
        "string.max": "SKU must be at most 50 characters",
      }),
    name: Joi.string().trim().min(3).max(200).required().messages({
      "any.required": "Name is required",
      "string.base": "Name must be a string",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be at most 200 characters",
    }),
    description: Joi.string().trim().max(1000).optional().messages({
      "string.base": "Description must be a string",
      "string.max": "Description must be at most 1000 characters",
    }),
    category: Joi.string().trim().min(2).max(100).required().messages({
      "any.required": "Category is required",
      "string.base": "Category must be a string",
      "string.min": "Category must be at least 2 characters",
      "string.max": "Category must be at most 100 characters",
    }),
    type: Joi.string()
      .valid(ProductType.PUBLIC, ProductType.PRIVATE)
      .default(ProductType.PUBLIC)
      .messages({
        "any.only": "Type must be either 'public' or 'private'",
      }),
    price: Joi.number().positive().precision(2).required().messages({
      "any.required": "Price is required",
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "number.precision": "Price must have at most 2 decimal places",
    }),
    discountPrice: Joi.number()
      .min(0)
      .precision(2)
      .less(Joi.ref("price"))
      .optional()
      .messages({
        "number.base": "Discount Price must be a number",
        "number.min": "Discount Price must be at least 0",
        "number.precision": "Discount Price must have at most 2 decimal places",
        "number.less": "Discount Price must be less than the price",
      }),
    quantity: Joi.number().integer().min(0).required().messages({
      "any.required": "Quantity is required",
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity cannot be negative",
    }),
  }),
};

/* Update Product Schema (partial updates allowed, except SKU) */
export const updateProductSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(200).optional(),
    description: Joi.string().trim().max(1000).optional(),
    category: Joi.string().trim().min(2).max(100).optional(),
    type: Joi.string()
      .valid(ProductType.PUBLIC, ProductType.PRIVATE)
      .optional(),
    price: Joi.number().positive().precision(2).optional(),
    discountPrice: Joi.number()
      .min(0)
      .less(Joi.ref("price"))
      .precision(2)
      .optional()
      .messages({
        "number.less": "Discount price must be less than regular price",
      }),
    quantity: Joi.number().integer().min(0).optional(),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required",
    }),
};

/* Get/Delete Product by ID Schema */
export const productIdSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required().messages({
      "any.required": "Product ID is required",
      "string.base": "Product ID must be a string",
      "string.length": "Product ID must be 24 characters",
      "string.hex": "Product ID must be a valid hexadecimal",
    }),
  }),
};

/* Get All Products (with Pagination & Filters) Schema */
export const listProductsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).optional().default(10),
    category: Joi.string().trim().min(2).max(100).optional(),
    type: Joi.string()
      .valid(ProductType.PUBLIC, ProductType.PRIVATE)
      .optional(),
    search: Joi.string().trim().optional(),
    sort: Joi.string().valid("name", "price", "createdAt").optional(),
    order: Joi.string().valid("asc", "desc").optional().default("asc"),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).greater(Joi.ref("minPrice")).optional(),
  }),
};
