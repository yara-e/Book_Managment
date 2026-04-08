import * as UserRepo from './user.repository';
import { AppError } from '../../common/error/AppError';
import { prisma } from "../../common/db/prisma"


export const getMyProfile = async (userId: string) => {
  const user = await UserRepo.findUserWithOrders(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const addReview = async (userUuid: string, bookUuid: string, rating: number, comment?: string) => {
 
  const user = await prisma.user.findUnique({ where: { uuid: userUuid }, select: { id: true } });
  const book = await prisma.book.findUnique({ where: { uuid: bookUuid }, select: { id: true } });

  if (!user || !book) throw new AppError("User or Book not found", 404);
  if (rating < 1 || rating > 5) throw new AppError("Rating must be between 1 and 5", 400);

  
  return await UserRepo.createOrUpdateReview(user.id, book.id, rating, comment);
};