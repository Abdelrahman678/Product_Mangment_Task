/* Error Interface */
export interface IError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  cause?: number;
  stack?: string;
}
/* Product Interface */
export interface IProduct {
  sku: string;
  name: string;
  description: string | null;
  category: string;
  type: ProductType;
  price: number;
  discountPrice: number | null;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
/* Product Type Enum */
export enum ProductType {
  PUBLIC = "public",
  PRIVATE = "private",
}
/* System Roles Enum */
export enum systemRoles {
  ADMIN = "admin",
  USER = "user",
}
