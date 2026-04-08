import { Router } from "express";
import { validate } from "../../common/Middleware/validate"
import { createBookSchema, updateBookSchema } from "./book.validation";
import { createBookController, deleteBookController, findAllBookController, findBookController, updateBookController } from "./book.controller";
import { upload } from "./middleware/upload.middleware";
import { allowRoles, authenticate } from "../auth/middlewares/auth.middleware";

const bookRouter = Router();


bookRouter.get("/", findAllBookController);



bookRouter.get("/:id", findBookController);


bookRouter.post("/", authenticate, allowRoles('ADMIN'), upload.single('image'), validate(createBookSchema), createBookController);


bookRouter.put("/:id", authenticate, allowRoles('ADMIN'), validate(updateBookSchema), updateBookController);


bookRouter.delete("/:id", authenticate, allowRoles('ADMIN'), deleteBookController);


export default bookRouter;
