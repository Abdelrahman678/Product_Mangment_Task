import { ProductType } from "./../../Types/types";

export interface CreateProductDTO {
  sku: string;
  name: string;
  description?: string;
  category: string;
  type?: ProductType;
  price: number;
  discountPrice?: number;
  quantity: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  category?: string;
  type?: ProductType;
  price?: number;
  discountPrice?: number;
  quantity?: number;
  updatedAt?: Date;
}

export interface getAllProductsDTO {
  page?: number;
  limit?: number;
  category?: string;
  type?: ProductType;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}
