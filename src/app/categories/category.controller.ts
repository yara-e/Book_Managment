import { Request, Response, NextFunction } from "express";
import { findCategoriesService, findCategoryService, updateCategoryService, deleteCategoryService, createCategoryService } from "./category.service";
import { asyncHandler } from "../../common/utils/syncHandler";

export const findCategoriesController = asyncHandler(async (req: Request, res: Response) => {
    const categories = await findCategoriesService();
    res.json(categories)
})

export const findCategoryController = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const category = await findCategoryService(id);
    res.json(category)

})

export const createCategoryController = asyncHandler(async (req: Request, res: Response) => {
    const category = await createCategoryService(req.body)
    res.status(201).json(category)
})

export const updateCategoryController = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id)
    const category = await updateCategoryService(id, req.body)
    res.json(category)


})

export const deleteCategoryBIdController = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await deleteCategoryService(id)
    res.status(204).send()
})