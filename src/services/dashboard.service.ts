import myFetch from "@/lib/fetch/myFetch";
import type { DataResponse } from "@/types/api/api.type";
import type { AdminStats, SellerStats } from "@/types/api/dashboard.type";

export const getAdminDashboard = () => {
   return myFetch<DataResponse<AdminStats>>("/api/v1/dashboard/admin");
};

export const getSellerDashboard = () => {
   return myFetch<DataResponse<SellerStats>>("/api/v1/dashboard/seller");
};
