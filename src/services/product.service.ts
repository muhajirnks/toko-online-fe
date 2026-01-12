import useFetch from "@/hooks/useFetch";
import myFetch from "@/lib/fetch/myFetch";
import type {
   DataResponse,
   MessageResponse,
   Pagination,
} from "@/types/api/api.type";
import type {
   Product,
   CreateProductRequest,
   UpdateProductRequest,
   ListProductRequest,
} from "@/types/api/product.type";
import { prepareFormData } from "@/utils/prepareFormData";

export const useListProducts = (qs?: ListProductRequest) => {
   return useFetch<Pagination<Product>>(`/api/v1/products`, {
      qs,
   });
};

export const useGetProduct = (id: string) => {
   return useFetch<DataResponse<Product>>(`/api/v1/products/${id}`);
};

export const getProduct = (id: string) => {
   return myFetch<DataResponse<Product>>(`/api/v1/products/${id}`);
};

export const createProduct = (body: CreateProductRequest) => {
   const data = prepareFormData(body);
   return myFetch<DataResponse<Product>>("/api/v1/products", {
      method: "POST",
      body: data,
   });
};

export const updateProduct = (id: string, body: UpdateProductRequest) => {
   const data = prepareFormData(body);
   return myFetch<DataResponse<Product>>(`/api/v1/products/${id}`, {
      method: "PUT",
      body: data,
   });
};

export const deleteProduct = (id: string) => {
   return myFetch<MessageResponse>(`/api/v1/products/${id}`, {
      method: "DELETE",
   });
};
