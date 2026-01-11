import { useEffect } from "react";
import { menu } from "@/configs/menu";
import {
   Box,
   Drawer,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Tooltip,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/react.svg";
import smallLogo from "@/assets/react.svg";
import theme from "@/configs/muiLight";
import useThemeStore from "@/store/useThemeStore";

export const DRAWER_WIDTH_EXPANDED = 270;
export const DRAWER_WIDTH_COLLAPSED = 80;

interface Props {
   isCollapsed: boolean;
   setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<Props> = ({ isCollapsed, setIsCollapsed }) => {
   const { pathname } = useLocation();
   const navigate = useNavigate();

   const themeMode = useThemeStore(s => s.theme)
   const isDownLg = useMediaQuery(theme.breakpoints.down("lg"));

   const currentWidth = isCollapsed
      ? DRAWER_WIDTH_COLLAPSED
      : DRAWER_WIDTH_EXPANDED;

   useEffect(() => {
      if (isDownLg) {
         setIsCollapsed(true);
      } else {
         setIsCollapsed(false);
      }
   }, [isDownLg]);

   return (
      <Box
         className="shrink-0 transition-[width] duration-300"
         component="nav"
         sx={{ width: currentWidth }}
      >
         <Drawer
            variant="permanent"
            className="transition-[width] duration-300"
            sx={{
               "& .MuiDrawer-paper": {
                  transitionProperty: "width",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionDuration: "300ms",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  borderRadius: '0',
                  borderRight: "1px solid var(--color-background-paper-light)",
                  background: themeMode == 'dark' ? "var(--color-background)" : "var(--color-background-paper)",
                  color: "var(--color-foreground)",
                  paddingBlock: {
                     xs: "40px",
                  },
                  paddingInline: {
                     xs: isCollapsed ? "15px" : "20px",
                  },
                  width: currentWidth,
               },
            }}
         >
            {/* Logo Section */}
            {!isCollapsed && (
               <Box className="flex items-center gap-2 justify-center transition-opacity duration-300">
                  <Link className="items-center flex gap-3 mx-auto" to="/">
                     <img
                        src={logo}
                        alt="logo hrease"
                        className="items-center w-7 h-7"
                     />

                     <Typography
                        variant="h6"
                        className="text-text-primary text-base"
                     >
                        {import.meta.env.VITE_APP_NAME}
                     </Typography>
                  </Link>
               </Box>
            )}

            {/* Collapsed Logo */}
            {isCollapsed && (
               <Box className="flex items-center justify-center transition-opacity duration-300">
                  <Link className="items-center mx-auto w-[35px]" to="/">
                     <img
                        src={smallLogo}
                        alt="logo hrease"
                        className="items-center"
                     />
                  </Link>
               </Box>
            )}

            <Box className="my-5 w-full h-px"></Box>

            <Box className="flex flex-col justify-between items-end h-dvh">
               <List className="flex w-full flex-col gap-1">
                  {menu.map((m) => {
                     const isActive =
                        m.link == "/"
                           ? m.link == pathname
                           : pathname.startsWith(m.link);

                     return (
                        <Tooltip key={m.label} title={isCollapsed ? m.label : ""} placement="right">
                           <ListItem disablePadding>
                              <ListItemButton
                                 className={`relative overflow-hidden rounded-[10px] gap-3 py-3 px-4 transition-all ${
                                    isActive ? "bg-background-paper" : ""
                                 }`}
                                 onClick={() => navigate(m.link)}
                                 sx={{
                                    justifyContent: isCollapsed
                                       ? "center"
                                       : "flex-start",
                                 }}
                              >
                                 {isActive && (
                                    <Box className="absolute top-0 bottom-0 left-0 w-1 bg-primary"></Box>
                                 )}
                                 <ListItemIcon
                                    className={`min-w-0 grid place-items-center`}
                                 >
                                    <m.icon
                                       className={`text-lg ${
                                          isActive
                                             ? "text-primary"
                                             : "text-text-secondary"
                                       }`}
                                    />
                                 </ListItemIcon>
                                 {!isCollapsed && (
                                    <ListItemText
                                       primary={m.label}
                                       sx={{
                                          transition: "opacity 300ms",
                                          "& .MuiTypography-root": {
                                             fontSize: "14px",
                                             color: isActive
                                                ? "var(--color-primary)"
                                                : "var(--color-text-secondary)",
                                             fontWeight: "medium",
                                          },
                                       }}
                                    />
                                 )}
                              </ListItemButton>
                           </ListItem>
                        </Tooltip>
                     );
                  })}
               </List>
            </Box>
         </Drawer>
      </Box>
   );
};

export default Sidebar;
