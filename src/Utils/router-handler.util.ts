import { Application, Request, Response, NextFunction } from "express";
import { productController } from "../Modules";
import { globalErrorHandler } from "../Middlewares";
import { rateLimit } from "express-rate-limit";

/* rate Limiter */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* Router Handler */
export const routerHandler = (app: Application) => {
  /* apply limiter to all routes */
  app.use(limiter);
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
