import type { PaginationQs } from "./api.type";
import type { Product } from "./product.type";

export type OrderStatus =
   | "pending"
   | "paid"
   | "shipped"
   | "completed"
   | "cancelled";

export interface OrderItem {
   _id: string;
   product: Product | string;
   name: string;
   quantity: number;
   price: number;
}

export interface Order {
   _id: string;
   userId?: string;
   customerName: string;
   customerEmail: string;
   items: OrderItem[];
   totalAmount: number;
   status: OrderStatus;
   createdAt: string;
   updatedAt: string;
}

export interface CreateOrderRequest {
   items: { productId: string; quantity: number }[];
}

export interface ListOrderRequest extends PaginationQs {
   status?: OrderStatus;
   userId?: string;
   storeId?: string;
}

export interface UpdateOrderStatusRequest {
   status: OrderStatus;
}
