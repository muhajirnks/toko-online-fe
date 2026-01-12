import { MdOutlineDashboard, MdOutlineStorefront } from "react-icons/md";

export const menu = [
   {
      icon: MdOutlineDashboard,
      label: "Dashboard",
      link: "/seller/products", // For now, let's point to seller products
      role: ["seller", "admin"],
   },
   {
      icon: MdOutlineStorefront,
      label: "Manage Products",
      link: "/seller/products",
      role: ["seller", "admin"],
   },
];
