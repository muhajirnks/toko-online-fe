import DataTable, { createTableConfig } from "@/components/DataTable";
import { useListOrders } from "@/services/order.service";
import type { Order } from "@/types/api/order.type";
import { Container, Typography, Box, Chip } from "@mui/material";
import { useState, useMemo } from "react";
import PaginationComponent from "@/components/Pagination";

const OrdersPage = () => {
   const [page, setPage] = useState(1);
   const params = useMemo(() => ({
      page,
      limit: 10,
   }), [page]);

   const { data, loading } = useListOrders(params);

   const config = createTableConfig({
      uniqueField: "id",
      columns: [
         { key: "id", label: "Order ID", type: "string" },
         { key: "createdAt", label: "Date", type: "datetime" },
         {
            key: "status",
            label: "Status",
            type: "custom",
            renderValue: (value: Order["status"]) => {
               const colors: Record<Order["status"], "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning"> = {
                  pending: "warning",
                  paid: "info",
                  shipped: "primary",
                  completed: "success",
                  cancelled: "error",
               };
               return <Chip label={value.toUpperCase()} color={colors[value]} size="small" />;
            },
         },
         {
            key: "totalAmount",
            label: "Total",
            type: "custom",
            renderValue: (value: number) => `$${value.toLocaleString()}`,
         },
      ],
   });

   return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
         <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            My Orders
         </Typography>
         <Box sx={{ mt: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
            <DataTable
               rows={data?.data || []}
               config={config}
               loading={loading}
               sortBy="createdAt"
               sort="desc"
            />
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
               <PaginationComponent
                  page={page}
                  lastPage={data?.meta.lastPage || 1}
                  onChangePage={(p) => setPage(p)}
                  limit={data?.meta.limit || 0}
                  total={data?.meta.total || 0}
                  onChangeRowsPerPage={() => {}}
                  rowsPerPageOptions={[]}
               />
            </Box>
         </Box>
      </Container>
   );
};

export default OrdersPage;
