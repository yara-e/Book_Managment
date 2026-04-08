import { Request, Response, NextFunction } from 'express';
import * as AuthService from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, user } = await AuthService.login(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};


export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    res.json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) { next(error); }
};

export const handleResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;  
    const { password } = req.body;  
    await AuthService.resetPassword(token as string, password);
    res.json({ message: "Password updated successfully." });
  } catch (error) { next(error); }
};