import DataTable, { createTableConfig } from "@/components/DataTable";
import {
   useListSellerProducts,
   createProduct,
   updateProduct,
   deleteProduct,
} from "@/services/product.service";
import type { CreateProductRequest, Product } from "@/types/api/product.type";
import {
   Typography,
   Box,
   Button,
   IconButton,
   Menu,
   MenuItem,
   InputAdornment,
   Card,
   CardContent,
   debounce,
} from "@mui/material";
import { useMemo, useState } from "react";
import PaginationComponent from "@/components/Pagination";
import { FaEdit, FaTrash } from "react-icons/fa";
import ProductForm from "./components/ProductForm";
import ModalDelete from "./components/ModalDelete";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import type { HandleSubmit } from "@/types/formik.type";
import type { ProductFormData } from "@/validations/productSchema";
import { formatCurrency } from "@/utils/stringUtils";
import { BsSearch } from "react-icons/bs";
import { MdAdd, MdMoreVert } from "react-icons/md";
import Input from "@/components/form/Input";

const config = createTableConfig({
   uniqueField: "_id",
   columns: [
      { key: "name", label: "Product Name", type: "string" },
      {
         key: "price",
         label: "Price",
         type: "custom",
         renderValue: (val) => formatCurrency(val as number),
      },
      { key: "stock", label: "Stock", type: "number" },
      { key: "category.name", label: "Category", type: "string" },
   ],
});

const SellerProductsPage = () => {
   const [qs, setQs] = useState({
      page: 1,
      limit: 10,
      search: "",
   });
   const [searchQuery, setSearchQuery] = useState("");
   const [open, setOpen] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [menuProduct, setMenuProduct] = useState<Product | null>(null);
   const [openDelete, setOpenDelete] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const setSnackbar = useSnackbarStore((s) => s.setSnackbar);

   const { data, loading, fetchData } = useListSellerProducts(qs);

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

   const handleOpen = (product?: Product) => {
      setSelectedProduct(product || null);
      setOpen(true);
      handleMenuClose();
   };

   const handleClose = () => {
      setOpen(false);
      setSelectedProduct(null);
   };

   const handleMenuOpen = (
      event: React.MouseEvent<HTMLElement>,
      product: Product,
   ) => {
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
            setSnackbar({
               type: "success",
               message: "Product deleted successfully!",
            });
            setOpenDelete(false);
            setMenuProduct(null);
            fetchData();
         }
      } catch (err: any) {
         setSnackbar({
            type: "failure",
            message: err.message || "An error occurred",
         });
      } finally {
         setIsDeleting(false);
      }
   };

   const handleSubmit: HandleSubmit<ProductFormData> = async (
      values,
      { setErrors },
   ) => {
      setIsSubmitting(true);
      const { error, data } = selectedProduct
         ? await updateProduct(selectedProduct._id, values)
         : await createProduct(values as CreateProductRequest);

      if (error) {
         if (error.errors) {
            setErrors(error.errors);
         } else {
            setSnackbar({
               type: "failure",
               message: error.message || "Error occured while saving data",
            });
         }
      }

      if (data) {
         setSnackbar({
            type: "success",
            message: `Product ${selectedProduct ? "updated" : "created"} successfully!`,
         });
         handleClose();
         fetchData();
      }
      setIsSubmitting(false);
   };

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
            <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
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

         <Card>
            <CardContent>
               <Typography
                  variant="h5"
                  className="text-foreground-primary mb-5"
               >
                  Product List
               </Typography>
               <Box className="flex justify-end items-center gap-4 mb-5">
                  <Input
                     placeholder="Search"
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
                     <IconButton
                        onClick={(e) => handleMenuOpen(e, row as Product)}
                     >
                        <MdMoreVert />
                     </IconButton>
                  )}
               />

               <Box className="mt-5">
                  <PaginationComponent
                     page={qs.page}
                     lastPage={data?.meta.lastPage || 1}
                     onChangePage={(p) => setQs({ ...qs, page: p })}
                     limit={data?.meta.limit || 10}
                     total={data?.meta.total || 0}
                     onChangeRowsPerPage={(limit) => setQs({ ...qs, limit })}
                     rowsPerPageOptions={[10, 25, 50]}
                  />
               </Box>
            </CardContent>
         </Card>

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
