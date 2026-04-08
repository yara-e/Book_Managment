import { Request, Response, NextFunction } from 'express';
import * as UserService from './user.service';
import { AuthRequest } from '../auth/middlewares/auth.middleware';

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const userId = String(req.user?.uuid);

        const profile = await UserService.getMyProfile(userId);

        res.status(200).json({
            status: "success",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

export const postReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { bookUuid, rating, comment } = req.body;
    const uuid=String(req.user?.uuid)
    const review = await UserService.addReview(
      uuid, 
      bookUuid, 
      rating, 
      comment
    );

    res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    next(error);
  }
};