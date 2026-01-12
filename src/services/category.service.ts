import useFetch from "@/hooks/useFetch";
import myFetch from "@/lib/fetch/myFetch";
import type {
   DataResponse,
   MessageResponse,
   Pagination,
   PaginationQs,
} from "@/types/api/api.type";
import type {
   Category,
   CreateCategoryRequest,
   UpdateCategoryRequest,
} from "@/types/api/category.type";

export const useListCategories = (qs?: PaginationQs) => {
   return useFetch<Pagination<Category>>("/api/v1/categories", {
      qs,
   });
};

export const listCategories = (qs?: PaginationQs) => {
   return myFetch<Pagination<Category>>("/api/v1/categories", {
      qs,
   });
};

export const getCategory = (id: string) => {
   return myFetch<DataResponse<Category>>(`/api/v1/categories/${id}`);
};

export const createCategory = (body: CreateCategoryRequest) => {
   return myFetch<DataResponse<Category>>("/api/v1/categories", {
      method: "POST",
      body,
   });
};

export const updateCategory = (id: string, body: UpdateCategoryRequest) => {
   return myFetch<DataResponse<Category>>(`/api/v1/categories/${id}`, {
      method: "PUT",
      body,
   });
};

export const deleteCategory = (id: string) => {
   return myFetch<MessageResponse>(`/api/v1/categories/${id}`, {
      method: "DELETE",
   });
};
