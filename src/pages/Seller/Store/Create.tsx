import Input from "@/components/form/Input";
import FileInput from "@/components/form/FIleInput";
import { createStore } from "@/services/store.service";
import { useUserStore } from "@/store/useUserStore";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import type { FieldAttributes, HandleSubmit } from "@/types/formik.type";
import { getStoreSchema, type StoreFormData } from "@/validations/storeSchema";
import {
   Box,
   Button,
   Container,
   FormLabel,
   Paper,
   Typography,
   Grid,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "@/services/auth.service";

const CreateStorePage = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const setSnackbar = useSnackbarStore((s) => s.setSnackbar);
   const {user, setUser} = useUserStore();
   const navigate = useNavigate();

   const storeSchema = getStoreSchema();

   const initialValues: StoreFormData = {
      name: "",
      description: "",
      avatar: null,
   };

   const handleSubmit: HandleSubmit<StoreFormData> = async (values) => {
      setIsSubmitting(true);
      try {
         const { data, error } = await createStore({
            name: values.name,
            description: values.description || "",
            avatar: values.avatar,
         });

         if (data) {
            setSnackbar({
               type: "success",
               message: "Store created successfully!",
            });

            // Refresh user profile to get store info
            const { data: profileData } = await getProfile();
            if (profileData) {
               setUser(profileData.data);
            }

            navigate("/seller/products");
         }

         if (error) {
            setSnackbar({ type: "failure", message: error.message });
         }
      } catch (err: any) {
         setSnackbar({
            type: "failure",
            message: err.message || "Failed to create store",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   useEffect(() => {
      if(user?.store) {
         navigate('/seller/products');
      }
   }, [user])

   return (
      <Container maxWidth="md" sx={{ py: 8 }}>
         <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
               Create Your Store
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
               Start selling your products by creating a store profile.
            </Typography>

            <Formik
               initialValues={initialValues}
               validationSchema={storeSchema}
               onSubmit={handleSubmit}
            >
               {({ setFieldValue }) => (
                  <Form>
                     <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                           <Box sx={{ display: "grid", gap: 1.5 }}>
                              <FormLabel htmlFor="name">Store Name</FormLabel>
                              <Field name="name">
                                 {({ field, meta }: FieldAttributes<any>) => (
                                    <Input
                                       {...field}
                                       id="name"
                                       fullWidth
                                       placeholder="Enter store name"
                                       error={
                                          meta.touched && Boolean(meta.error)
                                       }
                                       helperText={meta.touched && meta.error}
                                    />
                                 )}
                              </Field>
                           </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                           <Box sx={{ display: "grid", gap: 1.5 }}>
                              <FormLabel htmlFor="description">
                                 Description
                              </FormLabel>
                              <Field name="description">
                                 {({ field, meta }: FieldAttributes<any>) => (
                                    <Input
                                       {...field}
                                       id="description"
                                       fullWidth
                                       multiline
                                       rows={4}
                                       placeholder="Tell customers about your store"
                                       error={
                                          meta.touched && Boolean(meta.error)
                                       }
                                       helperText={meta.touched && meta.error}
                                    />
                                 )}
                              </Field>
                           </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                           <Box sx={{ display: "grid", gap: 1.5 }}>
                              <FormLabel>Store Avatar</FormLabel>
                              <Field name="avatar">
                                 {({ field, meta }: FieldAttributes<any>) => (
                                    <FileInput
                                       value={field.value}
                                       onChange={(file) =>
                                          setFieldValue("avatar", file)
                                       }
                                       error={
                                          meta.touched &&
                                          Boolean(meta.error)
                                       }
                                       helperText={
                                          meta.touched &&
                                          meta.error
                                       }
                                    />
                                 )}
                              </Field>
                           </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                           <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={isSubmitting}
                              sx={{
                                 mt: 2,
                                 py: 1.5,
                                 borderRadius: 2,
                                 fontWeight: "bold",
                              }}
                           >
                              {isSubmitting
                                 ? "Creating Store..."
                                 : "Create Store"}
                           </Button>
                        </Grid>
                     </Grid>
                  </Form>
               )}
            </Formik>
         </Paper>
      </Container>
   );
};

export default CreateStorePage;
