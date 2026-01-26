import type { MenuItem } from "@/configs/menu";
import theme from "@/configs/mui/muiLight";
import {useUserStore} from "@/store/useUserStore";
import { Button, Tooltip, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
   menuItem: MenuItem;
   drawerIsCollapsed: boolean;
   collapseDrawer: () => void;
   isCollapseItem?: boolean;
}

const SidebarItem: React.FC<Props> = ({
   menuItem,
   drawerIsCollapsed,
   collapseDrawer,
   isCollapseItem = false,
}) => {
   const isDownLg = useMediaQuery(theme.breakpoints.down("lg"));
   const { pathname } = useLocation();
   const navigate = useNavigate();

   const isActive =
      menuItem.link == "/"
         ? menuItem.link == pathname
         : pathname.startsWith(menuItem.link);

   const user = useUserStore((s) => s.user);
   if(menuItem.role && !menuItem.role.includes(user!.role)) {
      return;
   }

   return (
      <Tooltip
         key={menuItem.label}
         title={drawerIsCollapsed ? menuItem.label : ""}
         placement="right"
      >
         <li className={`mb-2 ${isCollapseItem ? "menu-line" : ""}`}>
            <Button
               className={`flex w-full shadow-none items-center text-primary-contrast whitespace-nowrap text-ellipsis overflow-hidden gap-3 rounded-md py-[10px] px-3 min-w-0 ${
                  !drawerIsCollapsed ? "justify-start" : "justify-center"
               } ${
                  isActive
                     ? "bg-primary-light font-semibold"
                     : "hover:bg-primary-light font-normal"
               }`}
               onClick={() => {
                  isDownLg && collapseDrawer();
                  navigate(menuItem.link);
               }}
            >
               {menuItem.icon && <menuItem.icon className="text-xl" />}
               {!drawerIsCollapsed && menuItem.label}
            </Button>
         </li>
      </Tooltip>
   );
};

export default SidebarItem;
