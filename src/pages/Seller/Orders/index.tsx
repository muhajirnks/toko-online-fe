import DataTable, { createTableConfig } from "@/components/DataTable";
import {
   useListSellerOrders,
   updateOrderStatus,
} from "@/services/order.service";
import type { Order, OrderStatus } from "@/types/api/order.type";
import {
   Typography,
   Box,
   Chip,
   MenuItem,
   FormControl,
   IconButton,
   Menu,
   InputAdornment,
   Card,
   CardContent,
   debounce,
} from "@mui/material";
import { useMemo, useState } from "react";
import PaginationComponent from "@/components/Pagination";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { formatCurrency } from "@/utils/stringUtils";
import dayjs from "dayjs";
import { MdMoreVert } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import Input from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";

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
         key: "_id",
         label: "Order ID",
         type: "string",
      },
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
         getLabel(value) {
            const items = value as any[];
            const itemLabels = items.map(
               (item) => `${item.name} x ${item.quantity}`,
            );
            return itemLabels.join(", ");
         },
      },
   ],
});

const SellerOrdersPage = () => {
   const [qs, setQs] = useState({
      page: 1,
      limit: 10,
      search: "",
      status: "" as OrderStatus,
   });
   const [searchQuery, setSearchQuery] = useState("");
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
   const setSnackbar = useSnackbarStore((s) => s.setSnackbar);

   const { data, loading, fetchData } = useListSellerOrders(qs);

   const debouncedSearch = useMemo(
         () =>
            debounce((search: string) => {
               setQs({
                  ...qs,
                  page: 1,
                  search,
               });
            }, 800),
         [qs],
      );

   const handleMenuOpen = (
      event: React.MouseEvent<HTMLElement>,
      order: Order,
   ) => {
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

   return (
      <Box className="flex flex-col py-12 px-[50px] pb-4">
         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
         >
            <Box sx={{ p: 2, minWidth: 200 }}>
               <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Update Status
               </Typography>
               <FormControl fullWidth size="small">
                  <SelectInput
                     value={selectedOrder?.status || ""}
                     onChange={(e) =>
                        handleStatusChange(
                           selectedOrder!._id,
                           e.target.value as OrderStatus,
                        )
                     }
                  >
                     <MenuItem value="pending">Pending</MenuItem>
                     <MenuItem value="paid">Paid</MenuItem>
                     <MenuItem value="shipped">Shipped</MenuItem>
                     <MenuItem value="completed">Completed</MenuItem>
                     <MenuItem value="cancelled">Cancelled</MenuItem>
                  </SelectInput>
               </FormControl>
            </Box>
         </Menu>

         <Card>
            <CardContent>
               <Typography
                  variant="h5"
                  className="text-foreground-primary mb-5"
               >
                  Order List
               </Typography>
               <Box className="flex justify-end items-center gap-4 mb-5">
                  <Input
                     placeholder="Search by ID, product, or customer..."
                     value={searchQuery}
                     onChange={(e) => {
                        setSearchQuery(e.target.value);
                        debouncedSearch(e.target.value);
                     }}
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
                  <SelectInput
                     size="small"
                     value={qs.status}
                     displayEmpty
                     onChange={(e) =>
                        setQs((p) => ({
                           ...p,
                           status: e.target.value as OrderStatus,
                           page: 1,
                        }))
                     }
                  >
                     <MenuItem value="">All Status</MenuItem>
                     <MenuItem value="pending">Pending</MenuItem>
                     <MenuItem value="paid">Paid</MenuItem>
                     <MenuItem value="shipped">Shipped</MenuItem>
                     <MenuItem value="completed">Completed</MenuItem>
                     <MenuItem value="cancelled">Cancelled</MenuItem>
                  </SelectInput>
               </Box>

               <DataTable
                  config={config}
                  rows={data?.data || []}
                  loading={loading}
                  renderAction={(row) => (
                     <IconButton
                        onClick={(e) => handleMenuOpen(e, row as Order)}
                     >
                        <MdMoreVert />
                     </IconButton>
                  )}
               />

               {data && data.meta.lastPage > 1 && (
                  <Box className="mt-5">
                     <PaginationComponent
                        page={qs.page}
                        lastPage={data.meta.lastPage}
                        onChangePage={(page) => setQs((p) => ({ ...p, page }))}
                        limit={data.meta.limit}
                        total={data.meta.total}
                        onChangeRowsPerPage={(limit) =>
                           setQs((p) => ({ ...p, limit }))
                        }
                        rowsPerPageOptions={[10, 25, 50]}
                     />
                  </Box>
               )}
            </CardContent>
         </Card>
      </Box>
   );
};

export default SellerOrdersPage;
