import { Request, Response } from 'express';
import { findAllBooksService, findBookService, createBookService, updateBookService, deleteBookService } from './book.service';
import { asyncHandler } from '../../common/utils/syncHandler';
import { deleteBookRepo } from  './repos/book.repository'
import { GetBooksParams } from './book.types';

export const findAllBookController = asyncHandler(async (req: Request, res: Response) => {
    const params: GetBooksParams = {
        limit: parseInt(req.query.limit as string) || 10,
        cursor: req.query.cursor ? parseInt(req.query.cursor as string) : undefined,
        direction: (req.query.direction as 'next' | 'prev') || 'next',
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        search: req.query.search as string | undefined,
    };

    const books = await findAllBooksService(params)
    res.json(books)
})

export const findBookController = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id)
    const book = await findBookService(id)
    res.json(book)
})

export const createBookController = asyncHandler(async (req: Request, res: Response) => {
   const bookData = req.body;
   const file = req.file;
    const book = await createBookService(bookData,file)
    
    res.status(201).json(book)
})

export const updateBookController = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const book = await updateBookService(id, req.body);

    res.json(book);

})

export const deleteBookController = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    await deleteBookService(id);

    res.status(204).send();
})

