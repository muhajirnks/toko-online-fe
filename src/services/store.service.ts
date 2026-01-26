import myFetch from "@/lib/fetch/myFetch";
import type { DataResponse } from "@/types/api/api.type";
import type { Store } from "@/types/api/auth.type";
import type { CreateStoreRequest, UpdateStoreRequest } from "@/types/api/store.type";
import { prepareFormData } from "@/utils/prepareFormData";

export const getMyStore = () => {
   return myFetch<DataResponse<Store>>("/api/v1/stores/me");
};

export const createStore = (body: CreateStoreRequest) => {
   const data = prepareFormData(body);
   return myFetch<DataResponse<Store>>("/api/v1/stores", {
      method: "POST",
      body: data,
   });
};

export const updateStore = (body: UpdateStoreRequest) => {
   const data = prepareFormData(body);
   return myFetch<DataResponse<Store>>("/api/v1/stores", {
      method: "PUT",
      body: data,
   });
};
