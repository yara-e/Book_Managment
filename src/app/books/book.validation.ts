import { z } from "zod";

export const createBookSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (val) => Number(val), z.number().min(0, "Price cannot be negative")),
  author: z.string().min(1, "Author is required"),
  stock: z.preprocess(
    (val) => Number(val), z.number().int().min(0, "Stock cannot be negative")),
  categoryId: z.preprocess(
    (val) => Number(val),
    z.number().positive()
  )
});

export const updateBookSchema = createBookSchema.partial();
