import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import categoryRouter from './app/categories/category.routes';
import { errorMiddleware } from "./common/Middleware/errorHandler";
import bookRouter from "./app/books/book.routes";
import { setupSwagger } from "./swagger/swagger";
 
dotenv.config() ;
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/category",categoryRouter)
app.use("/book",bookRouter)

app.use(errorMiddleware);
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
