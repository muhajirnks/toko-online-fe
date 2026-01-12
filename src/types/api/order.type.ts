import type { Product } from "./product.type";

export interface Order {
   _id: string;
   userId?: string;
   customerName: string;
   customerEmail: string;
   items: OrderItem[];
   totalAmount: number;
   status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
   createdAt: string;
   updatedAt: string;
}

export interface OrderItem {
   _id: string;
   product: Product;
   name: string;
   quantity: number;
   price: number;
}

export interface CreateOrderRequest {
   items: {
      productId: string;
      quantity: number;
   }[];
}

export interface UpdateOrderStatusRequest {
   status: Order["status"];
}
