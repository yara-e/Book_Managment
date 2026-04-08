import { findAllBooksRepo, findBookRepo, createBookRepo, updateBookRepo, deleteBookRepo } from "./repos/book.repository";
import { uploadFileToR2 } from "./repos/storage.repository";
import { createBook, FindBooksParams, FindBooksQuery, GetBooksParams, updateBook } from "./book.types";
import { AppError } from "../../common/error/AppError";
import { findCategoryService } from "../categories/category.service";


export const findAllBooksService = async (params: GetBooksParams) => {
  const { limit, direction, cursor } = params;
  const books = await findAllBooksRepo(params);
  const hasMore = books.length > limit;

  if (hasMore) {
    if (direction === 'next') {
      books.pop(); // Remove the extra record from the end
    } else {
      books.shift(); // Remove the extra record from the beginning
    }
  }
  if (books.length === 0) {
    return { data: [], nextCursor: null, prevCursor: null };
  }

  const firstItem = books[0].id;
  const lastItem = books[books.length - 1].id;

  return {
    data: books,
    // If we are on the first page and didn't use a cursor, prev is null
    prevCursor: (direction === 'prev' ? hasMore : !!cursor) ? firstItem : null,
    // Next is null if we didn't find that extra (+1) record
    nextCursor: (direction === 'next' ? hasMore : true) ? lastItem : null,
  };

}

export const findBookService = async (id: string) => {
  const book = await findBookRepo(id)
  if (!book) {
    throw new AppError("Book not found", 404)
  }

  return book;
}

export const createBookService = async (data:  createBook , file?:Express.Multer.File) => {
  await findCategoryService(data.categoryId) //check that category exist
  let imageUrl = null;
  if(file){
  imageUrl = await uploadFileToR2(file);

  }
  return createBookRepo({...data,
    image:imageUrl})
}

export const updateBookService = async (id: string, data: updateBook) => {
  await findBookService(id)

  if (data.categoryId) {
    await findCategoryService(data.categoryId)
  }

  return updateBookRepo(id, data);
}

export const deleteBookService = async (id: string) => {
  await findBookService(id) //check the book exist 
  //handle the conflict error in error handler middleware
  return deleteBookRepo(id)
}


