import { prisma } from "../../../common/db/prisma"
import { AppError } from "../../../common/error/AppError";
import { createBook, FindBooksParams, GetBooksParams, updateBook } from "../book.types";


export const findAllBooksRepo = async (params: GetBooksParams) => {

  const { limit, cursor, direction, categoryId, search } = params;

  return await prisma.book.findMany({
    where: {
      ...(categoryId && { categoryId }),
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
    },
    take: direction === 'next' ? limit + 1 : -(limit + 1),
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { id: 'desc' },
    select: {
      id: true,
      uuid: true,
      name: true,
      author: true,
      image: true,
      category: {
        select: { name: true },
      }
    },
  });

}

export const findBookRepo = (uuid: string) => {
  return prisma.book.findFirst({
    where: { uuid },
    include: { category: true }
  })
}

export const createBookRepo = async (data: any) => {


  return await prisma.$transaction(async (tx) => {
    // 1. Create the new book
    const newBook = await tx.book.create({
      data
    });

    // 2. Increment the category count
    await tx.category.update({
      where: { id: newBook.categoryId },
      data: { bookCount: { increment: 1 } }
    });

    return newBook;
  });
}

export const updateBookRepo = async (uuid: string, data: updateBook) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Get current book state
    const currentBook = await tx.book.findUnique({
      where: { uuid },
      select: { id: true, categoryId: true }
    });

    if (!currentBook) throw new Error("Book not found");

    // 2. Perform the update
    const updatedBook = await tx.book.update({
      where: { id: currentBook.id },
      data
    });

    // 3. If category changed, update both category counts
    if (data.categoryId && data.categoryId !== currentBook.categoryId) {
      // Decrement old
      await tx.category.update({
        where: { id: currentBook.categoryId },
        data: { bookCount: { decrement: 1 } }
      });
      // Increment new
      await tx.category.update({
        where: { id: data.categoryId },
        data: { bookCount: { increment: 1 } }
      });
    }

    return updatedBook;
  });
}

export const deleteBookRepo = async (uuid: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Find the book first to get the categoryId
    const book = await tx.book.findUnique({
      where: { uuid },
      select: { id: true, categoryId: true }
    });

    if (!book) throw new AppError("Book not found", 404);

    // 2. Delete the book
    await tx.book.delete({
      where: { id: book.id }
    });

    // 3. Decrement the category count
    await tx.category.update({
      where: { id: book.categoryId },
      data: { bookCount: { decrement: 1 } }
    });

    return true;
  });
}