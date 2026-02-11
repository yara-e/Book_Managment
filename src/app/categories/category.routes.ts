import { Router } from "express"
import { findCategoriesController, findCategoryController, createCategoryController, updateCategoryController, deleteCategoryBIdController } from "./category.controller"
import { createCategorySchema, updateCategorySchema } from "./category.validation"
import { validate } from "../../common/Middleware/validate"

const categoryRouter = Router()


/**
 * @swagger
 * /category:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
categoryRouter.get("/", findCategoriesController)
/**
 * @swagger
 * /category/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
categoryRouter.get("/:id", findCategoryController)

/**
 * @swagger
 * /category:
 *   post:
 *     tags: [Categories]
 *     summary: Create new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Category'
 */

categoryRouter.post("/", validate(createCategorySchema), createCategoryController)

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
categoryRouter.put("/:id", validate(updateCategorySchema), updateCategoryController)
/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category contains books
 */
categoryRouter.delete("/:id", deleteCategoryBIdController)

export default categoryRouter
