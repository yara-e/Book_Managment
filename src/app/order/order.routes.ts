import { Router } from 'express';
import * as OrderController from './order.controller';
import { allowRoles, authenticate } from '../auth/middlewares/auth.middleware'

const orderRouter = Router();





// 1. Start the process
orderRouter.post('/checkout', authenticate, OrderController.checkout);

// 2. Complete the process (Called after redirect)
orderRouter.get('/verify', authenticate, OrderController.verify);

orderRouter.get('/getall',authenticate,allowRoles('ADMIN') , OrderController.findAdminOrdersController)



export default orderRouter;