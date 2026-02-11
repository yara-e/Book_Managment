import { AppError } from "../../common/error/AppError";
import { createCategoryRepo, deleteCategoryRepo, findAllCategoriesRepo, findCategoryRepo, updateCategoryRepo } from "./category.repository";
import type { createCatrgory, updateCategory } from "./category.types";

export const findCategoriesService = async () => {
  return findAllCategoriesRepo()
}

export const findCategoryService = async (id: number) => {
  const category = await findCategoryRepo(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category
}

export const createCategoryService = async (data: createCatrgory) => {
  return createCategoryRepo(data)
}
export const updateCategoryService = async (id: number, data: updateCategory) => {
  await findCategoryService(id)  //check that category exist
  return updateCategoryRepo(id, data)
}

export const deleteCategoryService = async (id: number) => {
  await findCategoryService(id)

  return deleteCategoryRepo(id)
}