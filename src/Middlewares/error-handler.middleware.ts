import { NextFunction, Request, Response } from "express";
import { IError } from "../Types/types";

/* Error Handler Middleware */
export const errorHandlerMiddleware = (api: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    api(req, res, next).catch((error: IError) => {
      console.error(
        `Error in ${req.method} ${req.url}:`,
        error.stack || error.message
      );
      next(error);
    });
  };
};

/* Global Error Handler */
export const globalErrorHandler = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.status || 500;

  /* Default message if none provided */
  const message =
    error.message || "Something went wrong! Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: error.code || undefined,
      details: error.details || undefined,
    },
  });
};
