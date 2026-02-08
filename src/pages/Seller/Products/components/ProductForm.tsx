import { Formik, Form, Field } from "formik";
import {
   Button,
   Grid,
   FormLabel,
   MenuItem,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Box,
   IconButton,
} from "@mui/material";
import Input from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import FileInput from "@/components/form/FIleInput";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useEffect } from "react";
import type { Product } from "@/types/api/product.type";
import {
   getProductSchema,
   type ProductFormData,
} from "@/validations/productSchema";
import type { FieldAttributes, HandleSubmit } from "@/types/formik.type";
import { MdClose } from "react-icons/md";

interface ProductFormProps {
   open: boolean;
   onClose: () => void;
   initialValues?: Partial<Product> | null;
   onSubmit: HandleSubmit<ProductFormData>;
   isSubmitting: boolean;
}

const productSchema = getProductSchema();

const ProductForm = ({
   open,
   onClose,
   initialValues,
   onSubmit,
   isSubmitting,
}: ProductFormProps) => {
   const { categories, fetchCategories } = useCategoryStore();

   useEffect(() => {
      if (open) {
         fetchCategories();
      }
   }, [fetchCategories, open]);

   const formData: ProductFormData = {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      price: initialValues?.price || 0,
      stock: initialValues?.stock || 0,
      categoryId:
         (initialValues?.category as any)?._id ||
         initialValues?.category?._id ||
         "",
      image: null,
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
         <Box className="flex items-center justify-between pr-3">
            <DialogTitle>
               {initialValues?._id ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <IconButton onClick={onClose}>
               <MdClose />
            </IconButton>
         </Box>
         <Formik
            initialValues={formData}
            validationSchema={productSchema}
            onSubmit={onSubmit}
            enableReinitialize
         >
            {({ setFieldValue, submitForm }) => (
               <>
                  <DialogContent sx={{ pt: 2 }} dividers>
                     <Form>
                        <Grid container spacing={3}>
                           <Grid size={{ xs: 12 }}>
                              <Box className="grid gap-[13px]">
                                 <FormLabel htmlFor="name">
                                    Product Name
                                 </FormLabel>
                                 <Field name="name">
                                    {({
                                       field,
                                       meta,
                                    }: FieldAttributes<any>) => (
                                       <Input
                                          {...field}
                                          id="name"
                                          fullWidth
                                          placeholder="Enter product name"
                                          error={
                                             meta.touched && Boolean(meta.error)
                                          }
                                          helperText={
                                             meta.touched && meta.error
                                          }
                                       />
                                    )}
                                 </Field>
                              </Box>
                           </Grid>

                           <Grid size={{ xs: 12 }}>
                              <Box className="grid gap-[13px]">
                                 <FormLabel htmlFor="description">
                                    Description
                                 </FormLabel>
                                 <Field name="description">
                                    {({
                                       field,
                                       meta,
                                    }: FieldAttributes<any>) => (
                                       <Input
                                          {...field}
                                          id="description"
                                          fullWidth
                                          multiline
                                          rows={4}
                                          placeholder="Enter product description"
                                          error={
                                             meta.touched && Boolean(meta.error)
                                          }
                                          helperText={
                                             meta.touched && meta.error
                                          }
                                       />
                                    )}
                                 </Field>
                              </Box>
                           </Grid>

                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="grid gap-[13px]">
                                 <FormLabel htmlFor="price">Price</FormLabel>
                                 <Field name="price">
                                    {({
                                       field,
                                       meta,
                                    }: FieldAttributes<any>) => (
                                       <Input
                                          {...field}
                                          id="price"
                                          type="number"
                                          fullWidth
                                          placeholder="0"
                                          error={
                                             meta.touched && Boolean(meta.error)
                                          }
                                          helperText={
                                             meta.touched && meta.error
                                          }
                                       />
                                    )}
                                 </Field>
                              </Box>
                           </Grid>

                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="grid gap-[13px]">
                                 <FormLabel htmlFor="stock">Stock</FormLabel>
                                 <Field name="stock">
                                    {({
                                       field,
                                       meta,
                                    }: FieldAttributes<any>) => (
                                       <Input
                                          {...field}
                                          id="stock"
                                          type="number"
                                          fullWidth
                                          placeholder="0"
                                          error={
                                             meta.touched && Boolean(meta.error)
                                          }
                                          helperText={
                                             meta.touched && meta.error
                                          }
                                       />
                                    )}
                                 </Field>
                              </Box>
                           </Grid>

                           <Grid size={{ xs: 12 }}>
                              <Box className="grid gap-[13px]">
                                 <FormLabel htmlFor="categoryId">
                                    Category
                                 </FormLabel>
                                 <Field name="categoryId">
                                    {({
                                       field,
                                       meta,
                                    }: FieldAttributes<any>) => (
                                       <>
                                          <SelectInput
                                             {...field}
                                             id="categoryId"
                                             fullWidth
                                             error={
                                                meta.touched &&
                                                Boolean(meta.error)
                                             }
                                          >
                                             <MenuItem value="" disabled>
                                                Select Category
                                             </MenuItem>
                                             {categories.map((cat) => (
                                                <MenuItem
                                                   key={cat._id}
                                                   value={cat._id}
                                                >
                                                   {cat.name}
                                                </MenuItem>
                                             ))}
                                          </SelectInput>
                                          {meta.touched && meta.error && (
                                             <Box className="text-xs text-red-500 ml-3">
                                                {meta.error}
                                             </Box>
                                          )}
                                       </>
                                    )}
                                 </Field>
                              </Box>
                           </Grid>

                           <Grid size={{ xs: 12 }}>
                              <Box className="grid gap-[13px]">
                                 <FormLabel>Product Image</FormLabel>
                                 <Field name="image">
                                    {({
                                       field,
                                       meta,
                                    }: FieldAttributes<any>) => (
                                       <FileInput
                                          multiple={false}
                                          value={
                                             field.value ||
                                             initialValues?.imageUrl ||
                                             null
                                          }
                                          onChange={(file) =>
                                             setFieldValue(
                                                "image",
                                                file === "_delete"
                                                   ? null
                                                   : file,
                                             )
                                          }
                                          error={
                                             meta.touched && Boolean(meta.error)
                                          }
                                          helperText={
                                             meta.touched &&
                                             (meta.error as string)
                                          }
                                       />
                                    )}
                                 </Field>
                              </Box>
                           </Grid>
                        </Grid>
                     </Form>
                  </DialogContent>

                  <DialogActions>
                     <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        loading={isSubmitting}
                        onClick={submitForm}
                     >
                        Save Product
                     </Button>
                  </DialogActions>
               </>
            )}
         </Formik>
      </Dialog>
   );
};

export default ProductForm;
