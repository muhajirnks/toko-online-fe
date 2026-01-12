import type { PaginationQs } from "./api.type";
import type { User } from "./auth.type";

export interface Product {
   _id: string;
   name: string;
   description: string;
   price: number;
   stock: number;
   imageUrl?: string;
   category?: string;
   sellerId: number;
   createdAt: string;
   updatedAt: string;

   seller: User;
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
   category: string;
   image?: File | null;
}

export interface UpdateProductRequest extends CreateProductRequest {}
