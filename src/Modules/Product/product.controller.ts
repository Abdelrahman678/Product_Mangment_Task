import { Router } from "express";
import { createProduct } from "./services/product.service";
import { authorizationMiddleware, errorHandlerMiddleware } from "../../Middlewares";
import { systemRoles } from "../../Types/types";

/* Product Controller */
const productController = Router();

/* Product Routes */
productController.post("/", 
    authorizationMiddleware([systemRoles.ADMIN]),
    errorHandlerMiddleware(createProduct));

export { productController };
