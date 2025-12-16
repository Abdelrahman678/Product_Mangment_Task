import { Request, Response } from "express";
import { ProductModel } from "../../../DB/Models/product.model";
import { CreateProductDTO } from "../product.dto";
import { IError } from "../../../Types/types";

/* === Create Product === */
export const createProduct = async (req: Request, res: Response) => {
  const body: CreateProductDTO = req.body;

  /* Check if SKU already exists */
  const exists = await ProductModel.findOne({ sku: body.sku });
  if (exists)
    throw {
      message: "SKU already exists",
      status: 409,
      code: "DUPLICATE_SKU",
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
