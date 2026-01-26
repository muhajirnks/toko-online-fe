import DataTable, { createTableConfig } from "@/components/DataTable";
import { useListProducts, createProduct, updateProduct, deleteProduct } from "@/services/product.service";
import type { CreateProductRequest, Product } from "@/types/api/product.type";
import { Typography, Box, Button, IconButton, Menu, MenuItem, InputAdornment } from "@mui/material";
import { useState, useMemo } from "react";
import PaginationComponent from "@/components/Pagination";
import { FaEdit, FaTrash } from "react-icons/fa";
import ProductForm from "./components/ProductForm";
import ModalDelete from "./components/ModalDelete";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { useUserStore } from "@/store/useUserStore";
import type { HandleSubmit } from "@/types/formik.type";
import type { ProductFormData } from "@/validations/productSchema";
import { formatCurrency } from "@/utils/stringUtils";
import { BsSearch } from "react-icons/bs";
import { MdAdd, MdMoreVert } from "react-icons/md";
import Input from "@/components/form/Input";

const SellerProductsPage = () => {
   const [page, setPage] = useState(1);
   const [open, setOpen] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [search, setSearch] = useState("");
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [menuProduct, setMenuProduct] = useState<Product | null>(null);
   const [openDelete, setOpenDelete] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const setSnackbar = useSnackbarStore(s => s.setSnackbar);
   const user = useUserStore(s => s.user);

   const params = useMemo(() => ({
      page,
      limit: 10,
      storeId: user?.store?._id.toString(),
      search: search || undefined,
   }), [page, user?.store?._id, search]);

   const { data, loading, fetchData } = useListProducts(params);

   const handleOpen = (product?: Product) => {
      setSelectedProduct(product || null);
      setOpen(true);
      handleMenuClose();
   };

   const handleClose = () => {
      setOpen(false);
      setSelectedProduct(null);
   };

   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
      setAnchorEl(event.currentTarget);
      setMenuProduct(product);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
      setMenuProduct(null);
   };

   const handleDeleteClick = () => {
      setOpenDelete(true);
      setAnchorEl(null);
   };

   const handleConfirmDelete = async () => {
      if (!menuProduct) return;
      setIsDeleting(true);
      try {
         const { error } = await deleteProduct(menuProduct._id);
         if (error) {
            setSnackbar({ type: "failure", message: error.message });
         } else {
            setSnackbar({ type: "success", message: "Product deleted successfully!" });
            setOpenDelete(false);
            setMenuProduct(null);
            fetchData();
         }
      } catch (err: any) {
         setSnackbar({ type: "failure", message: err.message || "An error occurred" });
      } finally {
         setIsDeleting(false);
      }
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

   const config = createTableConfig({
      uniqueField: "_id",
      columns: [
         { key: "name", label: "Product Name", type: "string" },
         { key: "price", label: "Price", type: "custom", renderValue: (val) => formatCurrency(val as number) },
         { key: "stock", label: "Stock", type: "number" },
         { key: "category.name", label: "Category", type: "string" },
      ],
   });

   return (
      <Box className="flex flex-col py-12 px-[50px] pb-4">
         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
         >
            <MenuItem onClick={() => handleOpen(menuProduct!)}>
               <Box className="flex items-center gap-2">
                  <FaEdit /> Edit
               </Box>
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
               <Box className="flex items-center gap-2">
                  <FaTrash /> Delete
               </Box>
            </MenuItem>
         </Menu>

         <ModalDelete
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            onDelete={handleConfirmDelete}
            loading={isDeleting}
         />

         <Box className="bg-background-paper rounded-[10px] overflow-hidden p-7.5 shadow-[0_5px_20px_0_rgba(0,0,0,0.05)]">
            <Typography variant="h5" className="text-foreground-primary mb-5">
               Product List
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
               <Button
                  variant="contained"
                  startIcon={<MdAdd className="text-xl" />}
                  onClick={() => handleOpen()}
               >
                  Add Product
               </Button>
            </Box>

            <DataTable
               rows={data?.data || []}
               config={config}
               loading={loading}
               sortBy="name"
               sort="asc"
               renderAction={(row) => (
                  <IconButton onClick={(e) => handleMenuOpen(e, row as Product)}>
                     <MdMoreVert />
                  </IconButton>
               )}
            />

            <Box className="mt-5">
               <PaginationComponent
                  page={page}
                  lastPage={data?.meta.lastPage || 1}
                  onChangePage={(p) => setPage(p)}
                  limit={data?.meta.limit || 10}
                  total={data?.meta.total || 0}
                  onChangeRowsPerPage={() => {}}
                  rowsPerPageOptions={[]}
               />
            </Box>
         </Box>

         <ProductForm
            open={open}
            onClose={handleClose}
            initialValues={selectedProduct}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
         />
      </Box>
   );
};

export default SellerProductsPage;
