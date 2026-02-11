import { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod"
import { ValidationError } from "../error/ValidateError";


export const validate =
    (schema: ZodType) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                const errorTree = z.flattenError(result.error)
                //  return res.status(400).json(errorTree.fieldErrors);
                throw new ValidationError(errorTree.fieldErrors)
            }
            req.body = result.data
            next();
        };
