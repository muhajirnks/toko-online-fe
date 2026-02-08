import { getSellerDashboard } from "@/services/dashboard.service";
import { type SellerStats } from "@/types/api/dashboard.type";
import {
   Box,
   Card,
   CardContent,
   Container,
   Grid,
   Typography,
   CircularProgress,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdInventory, MdShoppingCart, MdAttachMoney } from "react-icons/md";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/stringUtils";

const SellerDashboard = () => {
   const [stats, setStats] = useState<SellerStats | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         const { data, error } = await getSellerDashboard();
         if (data) {
            setStats(data.data);
         }

         if (error) {
            console.error("Failed to fetch seller stats:", error);
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
         value: formatCurrency(stats?.totalRevenue || 0),
         icon: <MdAttachMoney size={40} color="#d32f2f" />,
         color: "#ffebee",
      },
   ];

   const getStatusColor = (status: string) => {
      switch (status) {
         case "paid":
            return "success";
         case "pending":
            return "warning";
         case "shipped":
            return "info";
         case "completed":
            return "primary";
         case "cancelled":
            return "error";
         default:
            return "default";
      }
   };

   return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
         <Typography variant="h4" fontWeight="bold" gutterBottom>
            Seller Dashboard
         </Typography>
         <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Overview of your store performance
         </Typography>

         <Grid container spacing={3} sx={{ mb: 6 }}>
            {statCards.map((card, index) => (
               <Grid size={{ xs: 12, md: 4 }} key={index}>
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

         <Typography variant="h6" fontWeight="bold" className="mb-3">
            Recent Orders
         </Typography>
         <Card>
            <CardContent className="p-0">
               <TableContainer sx={{ borderRadius: 2 }}>
                  <Table>
                     <TableHead sx={{ bgcolor: "grey.50" }}>
                        <TableRow>
                           <TableCell className="font-bold">Order ID</TableCell>
                           <TableCell className="font-bold">Customer</TableCell>
                           <TableCell className="font-bold">Date</TableCell>
                           <TableCell className="font-bold">Total</TableCell>
                           <TableCell className="font-bold">Status</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {stats?.recentOrders.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                 No recent orders found
                              </TableCell>
                           </TableRow>
                        ) : (
                           stats?.recentOrders.map((order) => (
                              <TableRow key={order._id}>
                                 <TableCell sx={{ fontWeight: "medium" }}>
                                    #{order._id.substring(order._id.length - 8)}
                                 </TableCell>
                                 <TableCell>{order.customerName}</TableCell>
                                 <TableCell>
                                    {dayjs(order.createdAt).format("DD MMM YYYY")}
                                 </TableCell>
                                 <TableCell>
                                    {formatCurrency(order.totalAmount)}
                                 </TableCell>
                                 <TableCell>
                                    <Chip
                                       label={order.status.toUpperCase()}
                                       color={getStatusColor(order.status) as any}
                                       size="small"
                                       sx={{ fontWeight: "bold" }}
                                    />
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </TableContainer>
            </CardContent>
         </Card>
      </Container>
   );
};

export default SellerDashboard;
