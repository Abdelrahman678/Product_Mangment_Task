import { Request, Response } from "express";
import { ProductModel } from "../../../DB/Models/product.model";
import { CreateProductDTO, UpdateProductDTO } from "../product.dto";
import { IError, ProductType, systemRoles } from "../../../Types/types";

/* === Create Product === */
export const createProduct = async (req: Request, res: Response) => {
  const body: CreateProductDTO = req.body;

  /* Check if SKU already exists */
  const exists = await ProductModel.findOne({ sku: body.sku });
  if (exists)
    throw {
      message: "Product with this SKU already exists",
      status: 409,
      code: "DUPLICATE_SKU",
      details: {
        field: "sku",
        value: "EXISTING-SKU",
      },
    } as IError;
  /* Create Product */
  const product = new ProductModel(body);
  await product.save();

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

/* === Get Single Product === */
export const getSingleProduct = async (req: Request, res: Response) => {
  const role = req.header("X-User-Role") || "";
  const { id } = req.params;

  const product = await ProductModel.findById(id);
  if (!product)
    throw {
      message: "Product not found",
      status: 404,
      code: "NOT_FOUND",
      details: {
        resource: "Product",
        id,
      },
    } as IError;

  if (product.type === ProductType.PRIVATE && role !== systemRoles.ADMIN) {
    throw {
      message: "Product not found",
      status: 404,
      code: "NOT_FOUND",
      details: {
        resource: "Product",
        id,
      },
    } as IError;
  }

  return res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
};

/* === Update Product === */
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateProductDTO = { ...req.body };

  /* Prevent SKU updates */
  if ("sku" in updateData) {
    throw {
      message: "SKU cannot be updated",
      status: 400,
      code: "VALIDATION_ERROR",
      details: { field: "sku", message: "SKU cannot be modified" },
    } as IError;
  }

  /* Add updatedAt timestamp */
  updateData.updatedAt = new Date();

  /* Update the product */
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw {
      message: "Product not found",
      status: 404,
      code: "NOT_FOUND",
      details: { resource: "Product", id },
    } as IError;
  }

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
};

/* === Delete Product === */
export const deleteProductService = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedProduct = await ProductModel.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw {
      message: "Product not found",
      status: 404,
      code: "NOT_FOUND",
      details: { resource: "Product", id },
    } as IError;
  }

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: {
      id,
      sku: deletedProduct.sku,
    },
  });
};
