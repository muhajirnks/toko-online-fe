import useFetch from "@/hooks/useFetch";
import myFetch from "@/lib/fetch/myFetch";
import type {
   DataResponse,
   MessageResponse,
   Pagination,
   PaginationQs,
} from "@/types/api/api.type";
import type {
   Order,
   CreateOrderRequest,
   UpdateOrderStatusRequest,
} from "@/types/api/order.type";

export const useListOrders = (qs?: PaginationQs) => {
   return useFetch<Pagination<Order>>(`/api/v1/orders`, {
      qs,
   });
};

export const useGetOrder = (id: string) => {
   return useFetch<DataResponse<Order>>(`/api/v1/orders/${id}`);
};

export const getOrder = (id: string) => {
   return myFetch<DataResponse<Order>>(`/api/v1/orders/${id}`);
};

export const createOrder = (body: CreateOrderRequest) => {
   return myFetch<DataResponse<Order>>("/api/v1/orders", {
      method: "POST",
      body,
   });
};

export const updateOrder = (
   id: string,
   body: UpdateOrderStatusRequest
) => {
   return myFetch<DataResponse<Order>>(`/api/v1/orders/${id}/status`, {
      method: "PUT",
      body,
   });
};

export const deleteOrder = (id: string) => {
   return myFetch<MessageResponse>(`/api/v1/orders/${id}`, {
      method: "DELETE",
   });
};
