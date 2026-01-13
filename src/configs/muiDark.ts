"use client";

import { createTheme } from "@mui/material/styles";

// Augment the palette to include custom colors
declare module "@mui/material/styles" {
   interface Palette {}

   interface PaletteOptions {}
}

const theme = createTheme({
   typography: {
      allVariants: {
         fontSize: 14,
         fontFamily: '"Work Sans", sans-serif',
         color: "var(--color-foreground-secondary)",
      },
      h1: {
         fontSize: 50,
         lineHeight: 1.5,
         fontFamily: '"Work Sans", sans-serif',
         fontWeight: 700,
      },
      h2: {
         fontSize: 30,
         lineHeight: 1.5,
         fontFamily: '"Work Sans", sans-serif',
         fontWeight: 700,
      },
      h3: {
         fontSize: 25,
         lineHeight: 1.5,
         fontFamily: '"Work Sans", sans-serif',
         fontWeight: 600,
      },
      h4: {
         fontSize: 22,
         lineHeight: 1.5,
         fontFamily: '"Work Sans", sans-serif',
         fontWeight: 600,
      },
      h5: {
         fontSize: 20,
         lineHeight: 1.5,
         fontFamily: '"Work Sans", sans-serif',
         fontWeight: 500,
      },
      h6: {
         fontSize: 18,
         lineHeight: 1.5,
         fontFamily: '"Work Sans", sans-serif',
         fontWeight: 500,
      },
      body1: {
         fontSize: 14,
         lineHeight: 1.5,
      },
      body2: {
         fontSize: 12,
         lineHeight: 1.5,
      },
      caption: {
         fontSize: 12,
         lineHeight: 1.5,
         fontFamily: '"Work Sans", sans-serif',
      },
      fontFamily: '"Work Sans", sans-serif',
   },
   palette: {
      mode: "dark",
      primary: {
         light: "#5d8ce3",
         main: "#5584DC",
         dark: "#4977cc",
         contrastText: "#fff",
      },
      secondary: {
         light: "#acb2fa",
         main: "#00C2FF",
         dark: "#9299f0",
         contrastText: "#fff",
      },
      background: {
         default: "#0D1120",
         paper: "#131629",
      },
      text: {
         primary: "#FFFFFF",
         secondary: "#AEB9E1",
      },
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: 8,
               textTransform: "none",
               fontWeight: 600,
               boxShadow: "none",
               "&:hover": {
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
               },
            },
         },
      },
      MuiCard: {
         styleOverrides: {
            root: {
               borderRadius: 12,
               boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            },
         },
      },
      MuiPaper: {
         styleOverrides: {
            root: {
               borderRadius: 12,
               backgroundImage: "unset",
            },
         },
      },
   },
   breakpoints: {
      values: {
         xs: 0,
         sm: 640,
         md: 768,
         lg: 1024,
         xl: 1280,
      },
   },
});

export default theme;
