import { NextFunction, Request, Response } from "express";
import { IError } from "../Types/types";

/* Error Handler Middleware */
export const errorHandlerMiddleware = (api: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    api(req, res, next).catch((error: IError) => {
      console.log(`Error in ${req.url}: Error ==> ${error}`);
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
  const errorStatus = error.status || error.cause || 500;
  res.status(errorStatus).json({
    message: "Something went wrong! Internal Server Error",
    error: error.message,
    status:error.status
  });
};
