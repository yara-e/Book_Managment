import { z } from "zod";

export const createBookSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price cannot be negative"),
  author: z.string().min(1, "Author is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.number()
});

export const updateBookSchema = createBookSchema.partial();
