import { Router } from "express";
import {
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProductService,
  getProductStatsService,
  getAllProductsService,
} from "./services/product.service";
import {
  authorizationMiddleware,
  errorHandlerMiddleware,
  validationMiddleware,
} from "../../Middlewares";
import { systemRoles } from "../../Types/types";
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema,
} from "./product.schema";

/* Product Controller */
const productController = Router();

/* Product Routes */
/* 1. Create Product (admin only) */
productController.post(
  "/",
  authorizationMiddleware([systemRoles.ADMIN]),
  validationMiddleware(createProductSchema),
  errorHandlerMiddleware(createProduct)
);
/* 2. Get All Products (with Pagination) */
productController.get(
  "/",
  authorizationMiddleware([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(listProductsSchema),
  errorHandlerMiddleware(getAllProductsService)
);
/* 5. Get Product Statistics (admin only) */
productController.get(
  "/stats",
  authorizationMiddleware([systemRoles.ADMIN]),
  errorHandlerMiddleware(getProductStatsService)
);
/* 3. Get Single Product */
productController.get(
  "/:id",
  authorizationMiddleware([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(productIdSchema),
  errorHandlerMiddleware(getSingleProduct)
);
/* 4. Update Product */
productController.put(
  "/:id",
  authorizationMiddleware([systemRoles.ADMIN]),
  validationMiddleware(productIdSchema),
  validationMiddleware(updateProductSchema),
  errorHandlerMiddleware(updateProduct)
);
/* Delete Product (admin only) */
productController.delete(
  "/:id",
  authorizationMiddleware([systemRoles.ADMIN]),
  validationMiddleware(productIdSchema),
  errorHandlerMiddleware(deleteProductService)
);

export { productController };
