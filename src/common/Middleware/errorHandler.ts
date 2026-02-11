import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";
import { ValidationError } from "../error/ValidateError";


export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errors: err.errors
        });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }



    const prismaError = err as { cause?: { code?: string } };
    if (prismaError.cause?.code === "23001") {
        return res.status(409).json({
            message: "Cannot delete category because it contains books"
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal Server Error"
    });
};
