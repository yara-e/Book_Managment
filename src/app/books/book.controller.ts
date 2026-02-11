import { Request, Response } from 'express';
import { findAllBooksService, findBookService, createBookService, updateBookService, deleteBookService } from './book.service';
import { asyncHandler } from '../../common/utils/syncHandler';
import { deleteBookRepo } from './book.repository';

export const findAllBookController = asyncHandler(async (req: Request, res: Response) => {
    const books = await findAllBooksService()
    res.json(books)
})

export const findBookController = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const book = await findBookService(id)
    res.json(book)
})

export const createBookController = asyncHandler(async (req: Request, res: Response) => {
    const book = await createBookService(req.body)
    res.status(201).json(book)
})

export const updateBookController = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const book = await updateBookService(id, req.body);

    res.json(book);

})

export const deleteBookController = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deleteBookService(id);

    res.status(204).send();
})