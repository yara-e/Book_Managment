import { Router } from "express";
import { validate } from "../../common/Middleware/validate"
import { createBookSchema, updateBookSchema } from "./book.validation";
import { createBookController, deleteBookController, findAllBookController, findBookController, updateBookController } from "./book.controller";
 
const bookRouter = Router();

/**
 * @swagger
 * /book:
 *   get:
 *     tags: [Books]
 *     summary: Get all books with their categories
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
bookRouter.get("/", findAllBookController);


/**
 * @swagger
 * /book/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ID with category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookWithCategory'
 *       404:
 *         description: Book not found
 */

bookRouter.get("/:id", findBookController);

/**
 * @swagger
 * /book:
 *   post:
 *     tags: [Books]
 *     summary: Create new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Category not found
 */
bookRouter.post("/", validate(createBookSchema), createBookController);

/**
 * @swagger
 * /book/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookInput'
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book or Category not found
 */


bookRouter.put("/:id", validate(updateBookSchema), updateBookController);

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */


bookRouter.delete("/:id", deleteBookController);

export default bookRouter;
