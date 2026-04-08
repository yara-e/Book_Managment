import { prisma } from "../../common/db/prisma"

 

 

export const findUserWithOrders = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { uuid: userId },
    select: {
      id: true,
      uuid: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      country: true,
      role: true,
       
      orders: {
        select: {
          uuid: true,
          total: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc' 
        }
      }
    }
  });
};


export const createOrUpdateReview = async (userId: number, bookId: number, rating: number, comment?: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create or Update the Review (Upsert handles the unique constraint)
    const review = await tx.review.upsert({
      where: {
        userId_bookId: { userId, bookId }
      },
      create: { userId, bookId, rating, comment },
      update: { rating, comment }
    });

    // 2. Recalculate Stats for this book
    const aggregations = await tx.review.aggregate({
      where: { bookId },
      _count: { id: true },
      _sum: { rating: true },
      _avg: { rating: true }
    });

    // 3. Update the BookReviewStats table
    await tx.bookReviewStats.upsert({
      where: { bookId },
      create: {
        bookId,
        reviewCount: aggregations._count.id,
        ratingSum: aggregations._sum.rating || 0,
        averageRate: aggregations._avg.rating || 0
      },
      update: {
        reviewCount: aggregations._count.id,
        ratingSum: aggregations._sum.rating || 0,
        averageRate: aggregations._avg.rating || 0
      }
    });

    return review;
  });
};