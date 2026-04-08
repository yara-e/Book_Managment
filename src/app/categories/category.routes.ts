import { Router } from "express"
import { findCategoriesController, findCategoryController, createCategoryController, updateCategoryController, deleteCategoryBIdController } from "./category.controller"
import { createCategorySchema, updateCategorySchema } from "./category.validation"
import { validate } from "../../common/Middleware/validate"
import { allowRoles, authenticate } from "../auth/middlewares/auth.middleware"

const categoryRouter = Router()



categoryRouter.get("/", authenticate, allowRoles('ADMIN'), findCategoriesController)

categoryRouter.get("/:id", authenticate, allowRoles('ADMIN'), findCategoryController)


categoryRouter.post("/", authenticate, allowRoles('ADMIN'), validate(createCategorySchema), createCategoryController)

categoryRouter.put("/:id", authenticate, allowRoles('ADMIN'), validate(updateCategorySchema), updateCategoryController)

categoryRouter.delete("/:id", authenticate, allowRoles('ADMIN'), deleteCategoryBIdController)

export default categoryRouter
