import type { PaginationQs } from "./api.type";
import type { User } from "./auth.type";
import type { Category } from "./category.type";

export interface Product {
   _id: string;
   name: string;
   description: string;
   price: number;
   stock: number;
   imageUrl: string;
   category: Category;
   seller: User;
   createdAt: string;
   updatedAt: string;
}

export interface ListProductRequest extends PaginationQs {
   categoryId?: string;
   sellerId?: string;
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
