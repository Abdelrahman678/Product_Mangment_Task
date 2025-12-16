import { Router } from "express";
import {
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProductService,
} from "./services/product.service";
import {
  authorizationMiddleware,
  errorHandlerMiddleware,
} from "../../Middlewares";
import { systemRoles } from "../../Types/types";

/* Product Controller */
const productController = Router();

/* Product Routes */
productController.post(
  "/",
  authorizationMiddleware([systemRoles.ADMIN]),
  errorHandlerMiddleware(createProduct)
);
productController.get(
  "/:id",
  authorizationMiddleware([systemRoles.ADMIN, systemRoles.USER]),
  errorHandlerMiddleware(getSingleProduct)
);
productController.put(
  "/:id",
  authorizationMiddleware([systemRoles.ADMIN]),
  errorHandlerMiddleware(updateProduct)
);
productController.delete(
  "/:id",
  authorizationMiddleware([systemRoles.ADMIN]),
  errorHandlerMiddleware(deleteProductService)
);

export { productController };
