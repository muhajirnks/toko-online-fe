import {
   Grid,
   Container,
   Typography,
   Box,
   CircularProgress,
   MenuItem,
   FormControl,
   InputAdornment,
   Breadcrumbs,
   Link as MuiLink,
   Divider,
   Card,
   CardContent,
   debounce,
} from "@mui/material";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect, useMemo } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useListProducts } from "@/services/product.service";
import { MdSearch, MdFilterList } from "react-icons/md";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import SelectInput from "@/components/form/SelectInput";
import Input from "@/components/form/Input";
import { toQueryString } from "@/lib/fetch/createFetch";

const ProductList = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
   const [qs, setQs] = useState({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      limit: 12,
   });
   const { categories, fetchCategories } = useCategoryStore();

   const debouncedSearch = useMemo(
      () =>
         debounce((search: string) => {
            setQs({
               ...qs,
               search,
            });
         }, 800),
      [qs],
   );

   const { data, loading } = useListProducts(qs);

   useEffect(() => {
      fetchCategories();
   }, []);

   useEffect(() => {
      setSearchParams(toQueryString(qs));
   }, [qs]);

   return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
         {/* Breadcrumbs */}
         <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink
               component={RouterLink}
               to="/"
               underline="hover"
               color="inherit"
            >
               Beranda
            </MuiLink>
            <Typography color="text.primary">Semua Produk</Typography>
         </Breadcrumbs>

         <Grid container spacing={4}>
            {/* Sidebar Filters */}
            <Grid size={{ xs: 12, md: 3 }}>
               <Card sx={{ position: "sticky", top: 100 }}>
                  <CardContent>
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                           mb: 3,
                           display: "flex",
                           alignItems: "center",
                           gap: 1,
                        }}
                     >
                        <MdFilterList /> Filter
                     </Typography>

                     <Box>
                        <Typography
                           variant="subtitle2"
                           fontWeight="bold"
                           sx={{ mb: 1.5 }}
                        >
                           Cari
                        </Typography>
                        <Input
                           fullWidth
                           placeholder="Nama produk..."
                           size="small"
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
                     </Box>

                     <Divider sx={{ my: 3 }} />

                     <Box>
                        <Typography
                           variant="subtitle2"
                           fontWeight="bold"
                           sx={{ mb: 1.5 }}
                        >
                           Kategori
                        </Typography>
                        <FormControl fullWidth size="small">
                           <SelectInput
                              size="small"
                              value={qs.category}
                              displayEmpty
                              onChange={(e) =>
                                 setQs(p => ({ ...p, category: e.target.value as string }))
                              }
                           >
                              <MenuItem value="">Semua Kategori</MenuItem>
                              {categories.map((cat) => (
                                 <MenuItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                 </MenuItem>
                              ))}
                           </SelectInput>
                        </FormControl>
                     </Box>
                  </CardContent>
               </Card>
            </Grid>

            {/* Product Grid */}
            <Grid size={{ xs: 12, md: 9 }}>
               <Box
                  sx={{
                     mb: 3,
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                  }}
               >
                  <Typography variant="h5" fontWeight="bold">
                     {qs.category
                        ? categories.find((c) => c._id === qs.category)?.name
                        : "Semua Produk"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Menampilkan {data?.data.length || 0} produk
                  </Typography>
               </Box>

               {loading ? (
                  <Box
                     sx={{ display: "flex", justifyContent: "center", py: 8 }}
                  >
                     <CircularProgress />
                  </Box>
               ) : (
                  <Grid container spacing={3}>
                     {data?.data.map((product) => (
                        <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
                           <ProductCard product={product} />
                        </Grid>
                     ))}
                     {data?.data.length === 0 && (
                        <Grid size={{ xs: 12 }}>
                           <Box className="text-center py-20">
                              <Typography variant="h6" color="text.secondary">
                                 Oops! Produk tidak ditemukan.
                              </Typography>
                              <Typography
                                 variant="body2"
                                 color="text.secondary"
                              >
                                 Coba cari dengan kata kunci lain atau pilih
                                 kategori berbeda.
                              </Typography>
                           </Box>
                        </Grid>
                     )}
                  </Grid>
               )}
            </Grid>
         </Grid>
      </Container>
   );
};

export default ProductList;
