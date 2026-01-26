import { useUserStore } from "@/store/useUserStore";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/Loading";

const StoreMiddleware = () => {
   const { user, loading } = useUserStore();

   if (loading) return <Loading />;

   if (user && !user.store) {
      return <Navigate to="/seller/store/create" replace />;
   }

   return <Outlet />;
};

export default StoreMiddleware;
