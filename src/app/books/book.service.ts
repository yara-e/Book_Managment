import { findAllBooksRepo, findBookRepo, createBookRepo, updateBookRepo, deleteBookRepo } from "./book.repository";
import { createBook, updateBook } from "./book.types";
import { AppError } from "../../common/error/AppError";
import { findCategoryService } from "../categories/category.service";

export const findAllBooksService = async () => {
    return findAllBooksRepo()
}

export const findBookService = async (id: number) => {
    const book = await findBookRepo(id)
    if (!book) {
        throw new AppError("Book not found", 404)
    }

    return book;
}

export const createBookService = async (data: createBook) => {
    await findCategoryService(data.categoryId) //check that category exist
    return createBookRepo(data)
}

export const updateBookService = async (id: number, data: updateBook) => {
    await findBookService(id)

    if (data.categoryId) {
        await findCategoryService(data.categoryId)
    }

    return updateBookRepo(id, data);
}

export const deleteBookService = async (id: number) => {
    await findBookService(id) //check the book exist 
    //handle the conflict error in error handler middleware
    return deleteBookRepo(id)
}


