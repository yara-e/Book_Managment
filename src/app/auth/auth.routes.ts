import { Router } from 'express';
import { register, login, handleForgotPassword, handleResetPassword } from './auth.controller';
import { validate } from '../../common/Middleware/validate';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from './auth.validation';

const authRouter = Router();

authRouter.post('/register', validate(RegisterSchema), register);
authRouter.post('/login', validate(LoginSchema), login);
authRouter.post(
    '/forgot-password',
    validate(ForgotPasswordSchema),
    handleForgotPassword
);

authRouter.post(
    '/reset-password',
    validate(ResetPasswordSchema),
    handleResetPassword
);
export default authRouter;