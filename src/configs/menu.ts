import type { IconType } from "react-icons";
import { MdOutlineDashboard, MdOutlineStorefront, MdOutlineReceiptLong } from "react-icons/md";

export interface MenuItem {
   icon?: IconType;
   label: string;
   link: string;
   role?: ("user" | "admin")[];
   children?: MenuItem[];
}

export const menu: MenuItem[] = [
   {
      icon: MdOutlineDashboard,
      label: "Dashboard",
      link: "/seller/dashboard",
      role: ["user"],
   },
   {
      icon: MdOutlineDashboard,
      label: "Dashboard",
      link: "/admin/dashboard",
      role: ["admin"],
   },
   {
      icon: MdOutlineStorefront,
      label: "Manage Products",
      link: "/seller/products",
      role: ["user"],
   },
   {
      icon: MdOutlineReceiptLong,
      label: "Orders",
      link: "/seller/orders",
      role: ["user"],
   },
];
