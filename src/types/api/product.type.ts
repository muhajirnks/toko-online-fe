import type { PaginationQs } from "./api.type";
import type { Store } from "./auth.type";
import type { Category } from "./category.type";

export interface Product {
   _id: string;
   name: string;
   description: string;
   price: number;
   stock: number;
   imageUrl: string;
   category: Category;
   store: Store;
   createdAt: string;
   updatedAt: string;
}

export interface ListProductRequest extends PaginationQs {
   categoryId?: string;
   storeId?: string;
}

export interface CreateProductRequest {
   name: string;
   description: string;
   price: number;
   stock: number;
   categoryId: string;
   image: File;
}

export interface UpdateProductRequest {
   name: string;
   description: string;
   price: number;
   stock: number;
   categoryId: string;
   image?: File | null;
}
