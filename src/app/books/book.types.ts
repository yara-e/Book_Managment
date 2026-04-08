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

// types/book.types.ts
export interface GetBooksParams {
  limit: number;
  cursor?: number;
  direction: 'next' | 'prev';
  categoryId?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  prevCursor: number | null;
  nextCursor: number | null;
  count?: number;
}
export interface FindBooksParams {
  limit: number;
  cursor: number;
  direction: 'next' | 'prev';
  search?: string;
  categoryId?: string;
}

export interface FindBooksQuery {
  limit?: string;
  after?: string;
  before?: string;
  search?: string;
  categoryId?: string;
}