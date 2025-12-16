import { Request, Response, NextFunction } from "express";
import { IError } from "../Types/types";

export const authorizationMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.header("X-User-Role");

      /* No role provided → 401 Unauthorized */
      if (!role) {
        const error: IError = {
          message: "Unauthorized: Missing X-User-Role header",
          status: 401,
          code: "UNAUTHORIZED",
        };
        return res.status(401).json({
          success: false,
          message: error.message,
          error: { code: error.code, details: null },
        });
      }

      /* Role not allowed → 403 Forbidden */
      if (!allowedRoles.includes(role)) {
        const error: IError = {
          message: "Forbidden: You are not authorized to perform this action",
          status: 403,
          code: "FORBIDDEN",
        };
        return res.status(403).json({
          success: false,
          message: error.message,
          error: { code: error.code, details: null },
        });
      }

      /* Role allowed → proceed */
      next();
    } catch (err) {
      console.error(
        "Authorization Middleware Error:",
        (err as Error).stack || err
      );

      const error: IError = {
        message: "Internal Server Error in Authorization Middleware",
        status: 500,
        code: "INTERNAL_ERROR",
        details: (err as Error).message,
      };

      return res.status(500).json({
        success: false,
        message: error.message,
        error: { code: error.code, details: error.details },
      });
    }
  };
};
