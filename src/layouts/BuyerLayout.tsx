import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const BuyerLayout = () => {
   return (
      <Box className="flex flex-col min-h-screen">
         <Header />
         
         <Box component="main" className="grow">
            <Outlet />
         </Box>

         <Footer />
      </Box>
   );
};

export default BuyerLayout;
