import DataTable, { createTableConfig } from "@/components/DataTable";
import { useListOrders, updateOrderStatus } from "@/services/order.service";
import type { Order, OrderStatus } from "@/types/api/order.type";
import {
   Typography,
   Box,
   Chip,
   Select,
   MenuItem,
   FormControl,
   IconButton,
   Menu,
   InputAdornment,
} from "@mui/material";
import { useState, useMemo } from "react";
import PaginationComponent from "@/components/Pagination";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { formatCurrency } from "@/utils/stringUtils";
import dayjs from "dayjs";
import { MdMoreVert } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import Input from "@/components/form/Input";

const SellerOrdersPage = () => {
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState("");
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
   const setSnackbar = useSnackbarStore((s) => s.setSnackbar);

   const params = useMemo(
      () => ({
         page,
         limit: 10,
         search: search || undefined,
      }),
      [page, search]
   );

   const { data, loading, fetchData } = useListOrders(params);

   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: Order) => {
      setAnchorEl(event.currentTarget);
      setSelectedOrder(order);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedOrder(null);
   };

   const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
      try {
         const { error } = await updateOrderStatus(id, { status: newStatus });
         if (error) {
            setSnackbar({ type: "failure", message: error.message });
         } else {
            setSnackbar({
               type: "success",
               message: "Order status updated successfully!",
            });
            handleMenuClose();
            fetchData();
         }
      } catch (err: any) {
         setSnackbar({
            type: "failure",
            message: err.message || "An error occurred",
         });
      }
   };

   const getStatusColor = (status: OrderStatus) => {
      switch (status) {
         case "pending":
            return "warning";
         case "paid":
            return "info";
         case "shipped":
            return "primary";
         case "completed":
            return "success";
         case "cancelled":
            return "error";
         default:
            return "default";
      }
   };

   const config = createTableConfig({
      uniqueField: "_id",
      columns: [
         {
            key: "createdAt",
            label: "Date",
            type: "custom",
            renderValue: (val) => dayjs(val as string).format("DD MMM YYYY HH:mm"),
         },
         { key: "customerName", label: "Customer", type: "string" },
         {
            key: "totalAmount",
            label: "Total",
            type: "custom",
            renderValue: (val) => formatCurrency(val as number),
         },
         {
            key: "status",
            label: "Status",
            type: "custom",
            renderValue: (val) => (
               <Chip
                  label={(val as string).toUpperCase()}
                  color={getStatusColor(val as OrderStatus)}
                  size="small"
               />
            ),
         },
         {
            key: "items",
            label: "Products",
            type: "custom",
            renderValue: (val) => {
               const items = val as any[];
               return (
                  <Box>
                     {items.map((item, idx) => (
                        <Typography key={idx} variant="body2">
                           {item.name} x {item.quantity}
                        </Typography>
                     ))}
                  </Box>
               );
            },
         },
      ],
   });

   return (
      <Box className="flex flex-col py-12 px-[50px] pb-4">
         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
         >
            <Box sx={{ p: 2, minWidth: 200 }}>
               <Typography variant="subtitle2" sx={{ mb: 1 }}>Update Status</Typography>
               <FormControl fullWidth size="small">
                  <Select
                     value={selectedOrder?.status || ""}
                     onChange={(e) =>
                        handleStatusChange(selectedOrder!._id, e.target.value as OrderStatus)
                     }
                  >
                     <MenuItem value="pending">PENDING</MenuItem>
                     <MenuItem value="paid">PAID</MenuItem>
                     <MenuItem value="shipped">SHIPPED</MenuItem>
                     <MenuItem value="completed">COMPLETED</MenuItem>
                     <MenuItem value="cancelled">CANCELLED</MenuItem>
                  </Select>
               </FormControl>
            </Box>
         </Menu>

         <Box className="bg-background-paper rounded-[10px] overflow-hidden p-7.5 shadow-[0_5px_20px_0_rgba(0,0,0,0.05)]">
            <Typography variant="h5" className="text-foreground-primary mb-5">
               Order List
            </Typography>
            <Box className="flex justify-end items-center gap-4 mb-5">
               <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  className="grow basis-0"
                  slotProps={{
                     input: {
                        startAdornment: (
                           <InputAdornment position="start">
                              <BsSearch className="text-[15px]" />
                           </InputAdornment>
                        ),
                     },
                  }}
               />
            </Box>

            <DataTable
               config={config}
               rows={data?.data || []}
               loading={loading}
               renderAction={(row) => (
                  <IconButton onClick={(e) => handleMenuOpen(e, row as Order)}>
                     <MdMoreVert />
                  </IconButton>
               )}
            />

            {data && data.meta.lastPage > 1 && (
               <Box className="mt-5">
                  <PaginationComponent
                     page={page}
                     lastPage={data.meta.lastPage}
                     onChangePage={(p) => setPage(p)}
                     limit={data.meta.limit}
                     total={data.meta.total}
                     onChangeRowsPerPage={() => {}}
                     rowsPerPageOptions={[]}
                  />
               </Box>
            )}
         </Box>
      </Box>
   );
};

export default SellerOrdersPage;
