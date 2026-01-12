import { 
   Grid, 
   Container, 
   Typography, 
   Box, 
   CircularProgress, 
   TextField, 
   MenuItem, 
   Select, 
   FormControl, 
   InputLabel,
   InputAdornment,
   Breadcrumbs,
   Link as MuiLink,
   Paper,
   Divider
} from "@mui/material";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect, useMemo } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useListProducts } from "@/services/product.service";
import { MdSearch, MdFilterList } from "react-icons/md";
import { Link as RouterLink, useSearchParams } from "react-router-dom";

const ProductList = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [search, setSearch] = useState(searchParams.get("search") || "");
   const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
   const { categories, fetchCategories } = useCategoryStore();

   const params = useMemo(() => ({
      search,
      categoryId,
      limit: 12,
   }), [search, categoryId]);

   const { data, loading } = useListProducts(params);

   useEffect(() => {
      fetchCategories();
   }, []);

   useEffect(() => {
      const params: any = {};
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      setSearchParams(params);
   }, [search, categoryId]);

   return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
         {/* Breadcrumbs */}
         <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
               Beranda
            </MuiLink>
            <Typography color="text.primary">Semua Produk</Typography>
         </Breadcrumbs>

         <Grid container spacing={4}>
            {/* Sidebar Filters */}
            <Grid size={{xs: 12, md: 3}}>
               <Paper sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 100 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                     <MdFilterList /> Filter
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                     <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>Cari</Typography>
                     <TextField
                        fullWidth
                        placeholder="Nama produk..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                     <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>Kategori</Typography>
                     <FormControl fullWidth size="small">
                        <InputLabel>Pilih Kategori</InputLabel>
                        <Select
                           value={categoryId}
                           label="Pilih Kategori"
                           onChange={(e) => setCategoryId(e.target.value)}
                        >
                           <MenuItem value="">Semua Kategori</MenuItem>
                           {categories.map((cat) => (
                              <MenuItem key={cat._id} value={cat._id}>
                                 {cat.name}
                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </Box>
               </Paper>
            </Grid>

            {/* Product Grid */}
            <Grid size={{xs: 12, md: 9}}>
               <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">
                     {categoryId ? categories.find(c => c._id === categoryId)?.name : 'Semua Produk'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Menampilkan {data?.data.length || 0} produk
                  </Typography>
               </Box>

               {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                     <CircularProgress />
                  </Box>
               ) : (
                  <Grid container spacing={3}>
                     {data?.data.map((product) => (
                        <Grid key={product._id} size={{xs: 12, sm: 6, md: 4}}>
                           <ProductCard product={product} />
                        </Grid>
                     ))}
                     {data?.data.length === 0 && (
                        <Grid size={{xs: 12}}>
                           <Paper sx={{ py: 10, textAlign: 'center', borderRadius: 4, bgcolor: 'grey.50' }}>
                              <Typography variant="h6" color="text.secondary">
                                 Oops! Produk tidak ditemukan.
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                 Coba cari dengan kata kunci lain atau pilih kategori berbeda.
                              </Typography>
                           </Paper>
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
