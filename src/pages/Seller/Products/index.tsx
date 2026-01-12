import DataTable, { createTableConfig } from "@/components/DataTable";
import { useListProducts, createProduct, updateProduct, deleteProduct } from "@/services/product.service";
import type { CreateProductRequest, Product } from "@/types/api/product.type";
import { Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { useState, useMemo } from "react";
import PaginationComponent from "@/components/Pagination";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ProductForm from "./components/ProductForm";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { useUserStore } from "@/store/useUserStore";
import { formatRupiah } from "@/utils/numberUtils";
import type { HandleSubmit } from "@/types/formik.type";
import type { ProductFormData } from "@/validations/productSchema";

const SellerProductsPage = () => {
   const [page, setPage] = useState(1);
   const [open, setOpen] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const setSnackbar = useSnackbarStore(s => s.setSnackbar);
   const user = useUserStore(s => s.user);

   const params = useMemo(() => ({
      page,
      limit: 10,
      sellerId: user?._id.toString(),
   }), [page, user?._id]);

   const { data, loading, fetchData } = useListProducts(params);

   const handleOpen = (product?: Product) => {
      setSelectedProduct(product || null);
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
      setSelectedProduct(null);
   };

   const handleSubmit: HandleSubmit<ProductFormData> = async (values) => {
      setIsSubmitting(true);
      try {
         const { error } = selectedProduct
            ? await updateProduct(selectedProduct._id, values)
            : await createProduct(values as CreateProductRequest);

         if (error) {
            setSnackbar({ type: "failure", message: error.message });
         } else {
            setSnackbar({ type: "success", message: `Product ${selectedProduct ? 'updated' : 'created'} successfully!` });
            handleClose();
            fetchData();
         }
      } catch (err: any) {
         setSnackbar({ type: "failure", message: err.message || "An error occurred" });
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = async (_id: string) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      try {
         const { error } = await deleteProduct(_id);
         if (error) {
            setSnackbar({ type: "failure", message: error.message });
         } else {
            setSnackbar({ type: "success", message: "Product deleted successfully!" });
            fetchData();
         }
      } catch (err: any) {
         setSnackbar({ type: "failure", message: err.message || "An error occurred" });
      }
   };

   const config = createTableConfig({
      uniqueField: "_id",
      columns: [
         { key: "name", label: "Product Name", type: "string" },
         { key: "price", label: "Price", type: "custom", renderValue: (val) => formatRupiah(val as number) },
         { key: "stock", label: "Stock", type: "number" },
         { key: "category", label: "Category", type: "string" },
         {
            key: "actions",
            label: "Actions",
            type: "custom",
            renderValue: (_, row) => (
               <Box>
                  <IconButton onClick={() => handleOpen(row as Product)} size="small" color="primary">
                     <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row._id)} size="small" color="error">
                     <FaTrash />
                  </IconButton>
               </Box>
            ),
         },
      ],
   });

   return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
               My Products
            </Typography>
            <Button
               variant="contained"
               startIcon={<FaPlus />}
               onClick={() => handleOpen()}
            >
               Add Product
            </Button>
         </Box>

         <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
            <DataTable
               rows={data?.data || []}
               config={config}
               loading={loading}
               sortBy="name"
               sort="asc"
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

         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
               <ProductForm
                  initialValues={selectedProduct || {}}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
               />
            </DialogContent>
         </Dialog>
      </Container>
   );
};

export default SellerProductsPage;
