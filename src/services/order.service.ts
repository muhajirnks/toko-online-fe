import useFetch from "@/hooks/useFetch";
import myFetch from "@/lib/fetch/myFetch";
import type { MessageResponse, Pagination } from "@/types/api/api.type";
import type {
   CreateOrderRequest,
   ListOrderRequest,
   Order,
   UpdateOrderStatusRequest,
} from "@/types/api/order.type";

export const useListOrders = (qs?: ListOrderRequest) => {
   return useFetch<Pagination<Order>>("/api/v1/orders", {
      qs,
   });
};

export const createOrder = (body: CreateOrderRequest) => {
   return myFetch<Pagination<Order>>("/api/v1/orders", {
      body,
   });
};

export const listOrders = (qs?: ListOrderRequest) => {
   return myFetch<Pagination<Order>>("/api/v1/orders", {
      qs,
   });
};

export const getOrderById = (id: string) => {
   return myFetch<{ data: Order }>(`/api/v1/orders/${id}`);
};

export const updateOrderStatus = (id: string, body: UpdateOrderStatusRequest) => {
   return myFetch<MessageResponse>(`/api/v1/orders/${id}`, {
      method: "PUT",
      body,
   });
};
