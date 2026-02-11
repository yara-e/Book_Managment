export interface createBook {
  name: string;
  description: string;
  price: number;
  author: string;
  stock: number;
  categoryId: number;
}

export interface updateBook {
  name?: string;
  description?: string;
  price?: number;
  author?: string;
  stock?: number;
  categoryId?: number;
}
