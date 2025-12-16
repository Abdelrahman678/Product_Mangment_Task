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

  // Default message if none provided
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

// export const globalErrorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   _next: NextFunction
// ) => {
//   // Defaults
//   let status = typeof err?.status === "number" ? err.status : 500;
//   let message = "Internal server error";
//   let code: string | undefined;
//   let details: unknown;
//   // Known Mongo/Mongoose errors
//   if (err?.code === 11000) {
//     // Duplicate key (e.g., sku)
//     status = 409;
//     message = "Duplicate value";
//     code = "DUPLICATE_KEY";
//     details = { fields: Object.keys(err.keyPattern || err.keyValue || {}) };
//   } else if (err?.name === "ValidationError") {
//     status = 400;
//     message = "Validation failed";
//     code = "VALIDATION_ERROR";
//     details = Object.values(err.errors || {}).map((e: any) => ({
//       path: e?.path,
//       message: e?.message,
//     }));
//   } else if (err?.name === "CastError") {
//     status = 400;
//     message = "Invalid ID format";
//     code = "INVALID_ID";
//     details = { path: err?.path, value: err?.value };
//   } else if (typeof err?.status === "number" && err?.message) {
//     // App-defined errors (401/403/404 etc.)
//     message = err.message;
//     code = err.code;
//     details = err.details;
//   }
//   // Minimal server-side log
//   console.error(`[${req.method} ${req.originalUrl}] ${status}${code ? " " + code : ""}`);
//   // Unified response format, no internal leakage
//   return res.status(status).json({
//     success: false,
//     message,
//     error: {
//       code,
//       details,
//     },
//   });
// };
