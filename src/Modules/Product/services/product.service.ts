import { Request, Response } from "express";
import { ProductModel } from "../../../DB/Models/product.model";
import {
  CreateProductDTO,
  getAllProductsDTO,
  UpdateProductDTO,
} from "../product.dto";
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

/* === Get Product Statistics === */
export const getProductStatsService = async (req: Request, res: Response) => {
  const products = await ProductModel.find();

  if (!products || products.length === 0) {
    throw {
      message: "No products found",
      status: 404,
      code: "NOT_FOUND",
      details: { resource: "Product" },
    } as IError;
  }

  /* 1. Calculate total products */
  const totalProducts = products.length;

  let totalInventoryValue = 0;
  let totalDiscountedValue = 0;
  let outOfStockCount = 0;
  const categoryMap: {
    [category: string]: { count: number; totalValue: number };
  } = {};
  const typeMap: { [type: string]: { count: number; totalValue: number } } = {};

  products.forEach((product) => {
    /* 2. Calculate total inventory value and total discounted value */
    totalInventoryValue += (product.price || 0) * (product.quantity || 0);
    totalDiscountedValue +=
      (product.discountPrice || 0) * (product.quantity || 0);

    /* 3. Calculate out of stock count */
    if (product.quantity === 0) outOfStockCount++;

    /* Category */
    if (product.category) {
      categoryMap[product.category] = categoryMap[product.category] || {
        count: 0,
        totalValue: 0,
      };
      categoryMap[product.category].count += 1;
      categoryMap[product.category].totalValue +=
        product.price * product.quantity;
    }

    /* Type */
    if (product.type) {
      typeMap[product.type] = typeMap[product.type] || {
        count: 0,
        totalValue: 0,
      };
      typeMap[product.type].count += 1;
      typeMap[product.type].totalValue += product.price * product.quantity;
    }
  });

  /* 4. Calculate average price */
  const averagePrice =
    totalProducts > 0 ? totalInventoryValue / totalProducts : 0;
  /* Format numbers to 2 decimal places */
  const formatNumber = (num: number) => parseFloat(num.toFixed(2));

  const stats = {
    totalProducts,
    totalInventoryValue: formatNumber(totalInventoryValue),
    totalDiscountedValue: formatNumber(totalDiscountedValue),
    averagePrice: formatNumber(averagePrice),
    outOfStockCount,
    productsByCategory: Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      totalValue: formatNumber(data.totalValue),
    })),
    productsByType: Object.entries(typeMap).map(([type, data]) => ({
      type,
      count: data.count,
      totalValue: formatNumber(data.totalValue),
    })),
  };

  return res.status(200).json({
    success: true,
    message: "Statistics retrieved successfully",
    data: stats,
  });
};

/* === Get All Products (with Pagination) === */
export const getAllProductsService = async (req: Request, res: Response) => {
  const role = req.header("X-User-Role");
  if (!role) {
    throw {
      message: "Authentication required",
      status: 401,
      code: "UNAUTHORIZED",
      details: "X-User-Role header is missing or invalid",
    } as IError;
  }

  const {
    page = 1,
    limit = 10,
    category,
    type,
    search,
    sort = "createdAt",
    order = "asc",
    minPrice,
    maxPrice,
  } = req.query as getAllProductsDTO;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  /* filter object */
  const filter: any = {};

  /* uesr only see public products */
  if (role !== systemRoles.ADMIN) {
    filter.type = ProductType.PUBLIC;
  }
  /* if type given & admin */
  if (type && role === systemRoles.ADMIN) {
    filter.type = type;
  }
  /* if category given add it to the filter */
  if (category) {
    filter.category = category;
  }
  /* if there is range min or max price */
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  /* Search by name or description */
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  /* sort and it's order */
  const sortOrder = order === "desc" ? -1 : 1;
  const sortOption: any = { [sort]: sortOrder };
  /* for only one DB query */
  const [products, totalProducts] = await Promise.all([
    ProductModel.find(filter).sort(sortOption).skip(skip).limit(limitNumber),

    ProductModel.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalProducts / limitNumber);

  return res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalItems: totalProducts,
      itemsPerPage: limitNumber,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
  });
};
