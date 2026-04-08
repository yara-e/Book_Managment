import { Router } from 'express';
import * as UserController from './user.controller';
import { authenticate } from '../auth/middlewares/auth.middleware'

const userRouter = Router();

userRouter.get('/me', authenticate, UserController.getMe);
userRouter.post('/post-review', authenticate, UserController.postReview);

export default userRouter;