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
