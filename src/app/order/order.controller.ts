import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../auth/middlewares/auth.middleware';
import * as OrderService from './order.service';
import { AppError } from '../../common/error/AppError';
import { OrderStatus } from '../../../generated/prisma/enums';

export const checkout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { items } = req.body;
        // Safety check: ensure items exist and is an array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return next(new AppError("Cart is empty", 400));
        }
        const userId = String(req.user?.uuid);
        const result = await OrderService.startCheckout(userId, items);
        res.status(200).json({ status: 'success', checkoutUrl: result.url });
    } catch (error) {
        next(error);
    }
};

export const verify = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { sessionId } = req.query; // Expecting ?sessionId=cs_test_...
        const order = await OrderService.verifyPayment(sessionId as string);

        res.status(200).json({
            status: 'success',
            message: 'Order paid successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const findAdminOrdersController = async (req: Request, res: Response , next:NextFunction) => {
    try{
    const params = {
        limit: parseInt(req.query.limit as string) || 10,
        cursor: req.query.cursor ? parseInt(req.query.cursor as string) : undefined,
        direction: (req.query.direction as 'next' | 'prev') || 'next',
        status: req.query.status as OrderStatus | undefined,
        searchEmail: req.query.email as string | undefined,
    };

    const result = await OrderService.findAdminOrdersService(params);
    res.json(result);}
    catch(error){
        next(error)
    }
};