import Root from "@/layouts/Root";
import AuthMiddleware from "@/middleware/AuthMiddleware";
import GuestMiddleware from "@/middleware/GuestMiddleware";
import RoleMiddleware from "@/middleware/RoleMiddleware";
import ErrorBoundary from "@/pages/Error/ErrorBoundary";
import NotFound from "@/pages/Error/NotFound";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

const guestRoutes: RouteObject[] = [
   {
      path: "/login",
      lazy: async () => ({
         Component: (await import("@/pages/Auth/Login")).default,
      }),
   },
   {
      path: "/forgot-password",
      lazy: async () => ({
         Component: (await import("@/pages/Auth/ForgotPassword")).default,
      }),
   },
   {
      path: "/reset-password",
      lazy: async () => ({
         Component: (await import("@/pages/Auth/ResetPassword")).default,
      }),
   },
];

const authRoutes: RouteObject[] = [
   {
      lazy: async () => ({
         Component: (await import("@/layouts/MainLayout")).default,
      }),
      children: [
         {
            element: <RoleMiddleware allowedRoles={["seller", "admin"]} />,
            children: [
               {
                  path: "/seller/products",
                  lazy: async () => ({
                     Component: (await import("@/pages/Seller/Products"))
                        .default,
                  }),
               },
            ],
         },
         {
            lazy: async () => ({
               Component: (await import("@/layouts/SettingsLayout")).default,
            }),
            children: [
               {
                  path: "/settings/profile",
                  lazy: async () => ({
                     Component: (await import("@/pages/Settings/Profile"))
                        .default,
                  }),
               },
               {
                  path: "/settings/password",
                  lazy: async () => ({
                     Component: (await import("@/pages/Settings/Password"))
                        .default,
                  }),
               },
               {
                  path: "/settings/appearance",
                  lazy: async () => ({
                     Component: (await import("@/pages/Settings/Appearance"))
                        .default,
                  }),
               },
            ],
         },
      ],
   },
   {
      lazy: async () => ({
         Component: (await import("@/layouts/BuyerLayout")).default,
      }),
      children: [
         {
            path: "/cart",
            lazy: async () => ({
               Component: (await import("@/pages/Cart")).default,
            }),
         },
         {
            path: "/orders",
            lazy: async () => ({
               Component: (await import("@/pages/Orders")).default,
            }),
         },
      ],
   },
];

const publicRoutes: RouteObject[] = [
   {
      lazy: async () => ({
         Component: (await import("@/layouts/BuyerLayout")).default,
      }),
      children: [
         {
            index: true,
            lazy: async () => ({
               Component: (await import("@/pages/Home")).default,
            }),
         },
         {
            path: "/products",
            lazy: async () => ({
               Component: (await import("@/pages/Products/List")).default,
            }),
         },
         {
            path: "/products/:id",
            lazy: async () => ({
               Component: (await import("@/pages/Products/Detail")).default,
            }),
         },
      ],
   },
];

export const router = createBrowserRouter([
   {
      path: "/",
      Component: Root,
      ErrorBoundary: ErrorBoundary,
      children: [
         {
            Component: GuestMiddleware,
            children: guestRoutes,
         },
         {
            Component: AuthMiddleware,
            children: authRoutes,
         },
         ...publicRoutes,
         {
            path: "*",
            Component: NotFound,
         }
      ],
   },
]);
