import { type Order } from "./order.type";

export interface AdminStats {
   totalUsers: number;
   totalStores: number;
   totalProducts: number;
   totalOrders: number;
   totalRevenue: number;
}

export interface SellerStats {
   totalProducts: number;
   totalOrders: number;
   totalRevenue: number;
   recentOrders: Order[];
}
