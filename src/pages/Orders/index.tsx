import DataTable, { createTableConfig } from "@/components/DataTable";
import { useListOrders } from "@/services/order.service";
import type { Order, OrderStatus } from "@/types/api/order.type";
import {
   Container,
   Typography,
   Box,
   Chip,
   Card,
   CardContent,
   TextField,
   MenuItem,
   InputAdornment,
   Grid,
   debounce,
} from "@mui/material";
import { useMemo, useState } from "react";
import PaginationComponent from "@/components/Pagination";
import { formatCurrency } from "@/utils/stringUtils";
import { MdSearch } from "react-icons/md";
import SelectInput from "@/components/form/SelectInput";

const config = createTableConfig({
   uniqueField: "_id",
   columns: [
      { key: "_id", label: "Order ID", type: "string" },
      { key: "createdAt", label: "Date", type: "datetime" },
      {
         key: "status",
         label: "Status",
         type: "custom",
         renderValue: (value: Order["status"]) => {
            const colors: Record<
               Order["status"],
               | "default"
               | "primary"
               | "secondary"
               | "success"
               | "error"
               | "info"
               | "warning"
            > = {
               pending: "warning",
               paid: "info",
               shipped: "primary",
               completed: "success",
               cancelled: "error",
            };
            return (
               <Chip
                  label={value.toUpperCase()}
                  color={colors[value]}
                  size="small"
               />
            );
         },
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
      {
         key: "totalAmount",
         label: "Total",
         type: "custom",
         renderValue: (value: number) => formatCurrency(value),
      },
   ],
});

const OrdersPage = () => {
   const [qs, setQs] = useState({
      page: 1,
      limit: 10,
      search: "",
      status: "" as OrderStatus,
   });
   const [searchQuery, setSearchQuery] = useState("");

   const { data, loading } = useListOrders(qs);

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

   return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
         <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            className="mb-5"
         >
            My Orders
         </Typography>

         <Card sx={{ mb: 3 }}>
            <CardContent>
               <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 9 }}>
                     <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by ID, product, or customer..."
                        value={searchQuery}
                        onChange={(e) => {
                           setSearchQuery(e.target.value);
                           debouncedSearch(e.target.value);
                        }}
                        InputProps={{
                           startAdornment: (
                              <InputAdornment position="start">
                                 <MdSearch />
                              </InputAdornment>
                           ),
                        }}
                     />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                     <SelectInput
                        fullWidth
                        size="small"
                        displayEmpty
                        value={qs.status}
                        onChange={(e) =>
                           setQs({
                              ...qs,
                              status: e.target.value as OrderStatus,
                              page: 1,
                           })
                        }
                     >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                     </SelectInput>
                  </Grid>
               </Grid>
            </CardContent>
         </Card>

         <Card>
            <CardContent>
               <DataTable
                  rows={data?.data || []}
                  config={config}
                  loading={loading}
                  sortBy="createdAt"
                  sort="desc"
               />
               <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                  <PaginationComponent
                     page={qs.page}
                     lastPage={data?.meta.lastPage || 1}
                     onChangePage={(p) => setQs({ ...qs, page: p })}
                     limit={data?.meta.limit || 0}
                     total={data?.meta.total || 0}
                     onChangeRowsPerPage={(limit) => setQs({ ...qs, limit })}
                     rowsPerPageOptions={[10, 25, 50]}
                  />
               </Box>
            </CardContent>
         </Card>
      </Container>
   );
};

export default OrdersPage;
