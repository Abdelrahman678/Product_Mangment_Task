import { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import { errorHandlerMiddleware } from "./error-handler.middleware";

export const validationMiddleware = (schema: Record<string, ObjectSchema>) => {
  return errorHandlerMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
      /* Get all keys from the schema ('body', 'query', 'params') */
      const schemaKeys = Object.keys(schema);
      /* Array to collect validation errors */
      const validationErrors: { key: string; error: string[] }[] = [];

      /* Validate each part of the request specified in the schema */
      for (const key of schemaKeys) {
        /* validate request part against its schema */
        const { error } = schema[key].validate(req[key as keyof Request], {
          abortEarly: false,
        });

        if (error) {
          /* push validation errors */
          validationErrors.push({
            key,
            error: error.details.map((detail) => detail.message),
          });
        }
      }

      /* validation failed return errors */
      if (validationErrors.length) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      /* validation passed */
      next();
    }
  );
};
