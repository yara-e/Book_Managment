import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../common/error/AppError";
import { verifyAccessToken } from "../utils/jwt.util";


export interface AuthRequest extends Request {
    user?: {
        
        uuid: string;
        role: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return next(new AppError("Unauthorized - No token provided", 401));
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        req.user = payload;
        next();
    } catch (err) {
        return next(new AppError("Invalid or expired token", 401));
    }
};


export const allowRoles = (...roles: string[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("Forbidden - You don't have permission", 403));
        }
        next();
    };
};