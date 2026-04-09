import { Request, Response, NextFunction } from "express";

import { AppError } from "../error/AppError";
import { globalRateLimiter } from "../utils/redis";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const identifier = req.ip || "anonymous";
    const { success, limit, reset, remaining } = await globalRateLimiter.limit(identifier);


    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
        return next(new AppError("Too many requests. Please try again later.", 429));
    }

    next();
};