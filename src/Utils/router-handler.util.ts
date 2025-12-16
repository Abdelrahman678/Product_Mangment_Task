import { Application, Request, Response, NextFunction } from "express";
import { productController } from "../Modules";
import { globalErrorHandler } from "../Middlewares";

/* Router Handler */
export const routerHandler = (app: Application) => {
  /* Home Route */
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome to Product Mangment App!" });
  });
  /* Product Routes */
  app.use("/api/products", productController);
  /* Not Found Route */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" });
  });

  /* Global Error Handler Middleware call */
  app.use(globalErrorHandler);
};
