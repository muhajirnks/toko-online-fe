import { getAdminDashboard } from "@/services/dashboard.service";
import { type AdminStats } from "@/types/api/dashboard.type";
import {
   Box,
   Card,
   CardContent,
   Container,
   Grid,
   Typography,
   CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
   MdPeople,
   MdStore,
   MdInventory,
   MdShoppingCart,
   MdAttachMoney,
} from "react-icons/md";

const AdminDashboard = () => {
   const [stats, setStats] = useState<AdminStats | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         const { data, error } = await getAdminDashboard();
         if (data) {
            setStats(data.data);
         }

         if (error) {
            console.error("Failed to fetch admin stats:", error);
         }
         setLoading(false);
      };

      fetchStats();
   }, []);

   if (loading) {
      return (
         <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
         </Box>
      );
   }

   const statCards = [
      {
         title: "Total Users",
         value: stats?.totalUsers || 0,
         icon: <MdPeople size={40} color="#1976d2" />,
         color: "#e3f2fd",
      },
      {
         title: "Total Stores",
         value: stats?.totalStores || 0,
         icon: <MdStore size={40} color="#2e7d32" />,
         color: "#e8f5e9",
      },
      {
         title: "Total Products",
         value: stats?.totalProducts || 0,
         icon: <MdInventory size={40} color="#ed6c02" />,
         color: "#fff3e0",
      },
      {
         title: "Total Orders",
         value: stats?.totalOrders || 0,
         icon: <MdShoppingCart size={40} color="#9c27b0" />,
         color: "#f3e5f5",
      },
      {
         title: "Total Revenue",
         value: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
         }).format(stats?.totalRevenue || 0),
         icon: <MdAttachMoney size={40} color="#d32f2f" />,
         color: "#ffebee",
      },
   ];

   return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
         <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
         </Typography>
         <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Overview of your marketplace performance
         </Typography>

         <Grid container spacing={3}>
            {statCards.map((card, index) => (
               <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={index}>
                  <Card
                     sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-4px)" },
                     }}
                  >
                     <CardContent>
                        <Box
                           sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 2,
                           }}
                        >
                           <Box
                              sx={{
                                 p: 1.5,
                                 borderRadius: 2,
                                 bgcolor: card.color,
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                              }}
                           >
                              {card.icon}
                           </Box>
                        </Box>
                        <Typography
                           variant="body2"
                           color="text.secondary"
                           fontWeight="medium"
                        >
                           {card.title}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                           {card.value}
                        </Typography>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>
      </Container>
   );
};

export default AdminDashboard;
