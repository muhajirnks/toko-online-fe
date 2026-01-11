import Root from "@/layouts/Root";
import AuthMiddleware from "@/middleware/AuthMiddleware";
import GuestMiddleware from "@/middleware/GuestMiddleware";
import ErrorBoundary from "@/pages/Error/ErrorBoundary";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
   {
      path: "/",
      Component: Root,
      errorElement: <ErrorBoundary />,
      children: [
         {
            Component: GuestMiddleware,
            children: [
               {
                  path: "/login",
                  lazy: async () => ({
                     Component: (await import("@/pages/Auth/Login")).default,
                  }),
               },
               {
                  path: "/forgot-password",
                  lazy: async () => ({
                     Component: (await import("@/pages/Auth/ForgotPassword"))
                        .default,
                  }),
               },
               {
                  path: "/reset-password",
                  lazy: async () => ({
                     Component: (await import("@/pages/Auth/ResetPassword"))
                        .default,
                  }),
               },
            ],
         },
         {
            Component: AuthMiddleware,
            children: [
               {
                  lazy: async () => ({
                     Component: (await import("@/layouts/MainLayout")).default,
                  }),
                  children: [
                     {
                        index: true,
                        lazy: async () => ({
                           Component: (await import("@/pages/Dashboard"))
                              .default,
                        }),
                     },
                     {
                        lazy: async () => ({
                           Component: (await import("@/layouts/SettingsLayout"))
                              .default,
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
            ],
         },
      ],
   },
]);
