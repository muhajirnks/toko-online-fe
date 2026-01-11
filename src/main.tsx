import { createRoot } from "react-dom/client";
import "@/assets/css/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./configs/routes.tsx";
import { GlobalStyles, StyledEngineProvider, ThemeProvider } from "@mui/material";
import theme from "./configs/muiLight.ts";
import SilentAuthMiddleware from "./middleware/SilentAuthMiddleware.tsx";

createRoot(document.getElementById("root")!).render(
   <StyledEngineProvider enableCssLayer>
      <SilentAuthMiddleware />
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
         <RouterProvider router={router} />
      </ThemeProvider>
   </StyledEngineProvider>
);
