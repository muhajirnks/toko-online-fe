import type { MenuItem } from "@/configs/menu";
import SidebarCollapseLg from "./SidebarCollapseLg";
import SidebarCollapseSm from "./SidebarCollapseSm";
import {useUserStore} from "@/store/useUserStore";

interface Props {
   menuItem: MenuItem;
   isCollapseItem?: boolean;
   drawerIsCollapsed: boolean;
   collapseDrawer: () => void;
}

const SidebarCollapse: React.FC<Props> = ({
   menuItem,
   isCollapseItem = false,
   drawerIsCollapsed,
   collapseDrawer,
}) => {
   const user = useUserStore((s) => s.user);
   if(menuItem.role && !menuItem.role.includes(user!.role)) {
      return;
   }

   return (
      <>
         {!drawerIsCollapsed ? (
            <SidebarCollapseLg
               menuItem={menuItem}
               isCollapseItem={isCollapseItem}
               drawerIsCollapsed={drawerIsCollapsed}
               collapseDrawer={collapseDrawer}
            />
         ) : (
            <SidebarCollapseSm
               menuItem={menuItem}
               isCollapseItem={isCollapseItem}
               drawerIsCollapsed={drawerIsCollapsed}
               collapseDrawer={collapseDrawer}
            />
         )}
      </>
   );
};

export default SidebarCollapse;
