import { findAllBooksRepo, findBookRepo, createBookRepo, updateBookRepo, deleteBookRepo } from "./repos/book.repository";
import { uploadFileToR2 } from "./repos/storage.repository";
import { createBook, FindBooksParams, FindBooksQuery, GetBooksParams, updateBook } from "./book.types";
import { AppError } from "../../common/error/AppError";
import { findCategoryService } from "../categories/category.service";
import { redis } from "../../common/utils/redis";


export const findAllBooksService = async (params: GetBooksParams) => {
  const { limit, direction, cursor, categoryId, search } = params;

  // 1. Create a Unique Cache Key based on all query parameters
  const cacheKey = `books:page:cat-${categoryId || 'all'}:q-${search || 'none'}:lim-${limit}:cur-${cursor || 'start'}:dir-${direction}`;

  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return cachedResult; // Returns the full object (data, nextCursor, prevCursor)
  }

  // 3. If "Miss", run your existing logic
  const books = await findAllBooksRepo(params);
  const hasMore = books.length > limit;

  if (hasMore) {
    if (direction === 'next') {
      books.pop();
    } else {
      books.shift();
    }
  }

  if (books.length === 0) {
    return { data: [], nextCursor: null, prevCursor: null };
  }

  const firstItem = books[0].id;
  const lastItem = books[books.length - 1].id;

  const result = {
    data: books,
    prevCursor: (direction === 'prev' ? hasMore : !!cursor) ? firstItem : null,
    nextCursor: (direction === 'next' ? hasMore : true) ? lastItem : null,
  };


  await redis.set(cacheKey, result, { ex: 600 });

  return result;
};


export const findBookService = async (id: string) => {

  const cacheKey = `book:details:${id}`;
  const cachedBook = await redis.get(cacheKey);

  if (cachedBook) {
    return cachedBook;
  }
  const book = await findBookRepo(id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  await redis.set(cacheKey, book, { ex: 3600 });

  return book;
};
export const createBookService = async (data: createBook, file?: Express.Multer.File) => {
  await findCategoryService(data.categoryId) //check that category exist
  let imageUrl = null;
  if (file) {
    imageUrl = await uploadFileToR2(file);

  }
  const newBook = await createBookRepo({
    ...data,
    image: imageUrl
  });

  await invalidateBookListCache();

  return newBook
}

export const updateBookService = async (id: string, data: updateBook) => {
  await findBookService(id)

  if (data.categoryId) {
    await findCategoryService(data.categoryId)
  }

  const updatedBook = await updateBookRepo(id, data);

  await redis.del(`book:details:${id}`);
  await invalidateBookListCache();

  return updatedBook;
}

export const deleteBookService = async (id: string) => {
  await findBookService(id) //check the book exist
  await redis.del(`book:details:${id}`);
  await invalidateBookListCache();
  //handle the conflict error in error handler middleware
  return deleteBookRepo(id)
}


const invalidateBookListCache = async () => {
  const keys = await redis.keys("books:page:*");
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};