import { useParams, Link as RouterLink } from "react-router-dom";
import { useGetProduct } from "@/services/product.service";
import { 
   Container, 
   Grid, 
   Typography, 
   Box, 
   Button, 
   CircularProgress, 
   Divider, 
   TextField, 
   Breadcrumbs, 
   Link as MuiLink,
   Paper,
   Chip,
   Stack
} from "@mui/material";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { MdAddShoppingCart, MdStorefront, MdInventory, MdInfoOutline } from "react-icons/md";
import { formatCurrency } from "@/utils/stringUtils";

const ProductDetail = () => {
   const { id } = useParams();
   const [quantity, setQuantity] = useState(1);
   const addItem = useCartStore((state) => state.addItem);

   const { data, loading } = useGetProduct(id as string);

   if (loading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress size={60} />
         </Box>
      );
   }

   if (!data?.data) {
      return (
         <Container sx={{ py: 10 }}>
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
               <MdInfoOutline size={60} color="gray" />
               <Typography variant="h5" sx={{ mt: 2 }}>Produk tidak ditemukan</Typography>
               <Button component={RouterLink} to="/products" variant="contained" sx={{ mt: 3 }}>
                  Kembali ke Toko
               </Button>
            </Paper>
         </Container>
      );
   }

   const product = data.data;

   return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
         {/* Breadcrumbs */}
         <Breadcrumbs sx={{ mb: 4 }}>
            <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
               Beranda
            </MuiLink>
            <MuiLink component={RouterLink} to="/products" underline="hover" color="inherit">
               Produk
            </MuiLink>
            <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
         </Breadcrumbs>

         <Grid container spacing={6}>
            {/* Image Gallery */}
            <Grid size={{xs: 12, md: 6}}>
               <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                  <Box
                     component="img"
                     src={product.imageUrl || "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"}
                     alt={product.name}
                     sx={{ width: '100%', display: 'block', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}
                  />
               </Paper>
            </Grid>

            {/* Product Info */}
            <Grid size={{xs: 12, md: 6}}>
               <Box>
                  <Chip 
                     label={product.category.name || "Kategori"} 
                     color="primary" 
                     variant="outlined" 
                     size="small" 
                     sx={{ mb: 2, fontWeight: 'bold' }} 
                  />
                  <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                     {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                     <Typography variant="h4" color="primary" fontWeight="bold">
                        {formatCurrency(product.price)}
                     </Typography>
                     {product.stock > 0 ? (
                        <Chip label="Stok Tersedia" color="success" size="small" variant="filled" />
                     ) : (
                        <Chip label="Stok Habis" color="error" size="small" variant="filled" />
                     )}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Deskripsi Produk</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 4 }}>
                     {product.description}
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 3, bgcolor: 'grey.50' }}>
                     <Stack direction="row" spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <MdInventory color="#666" />
                           <Typography variant="body2" color="text.secondary">
                              Stok: <strong>{product.stock}</strong>
                           </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <MdStorefront color="#666" />
                           <Typography variant="body2" color="text.secondary">
                              Penjual: <strong>{product.seller?.name || 'Official Store'}</strong>
                           </Typography>
                        </Box>
                     </Stack>
                  </Paper>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                     <TextField
                        type="number"
                        label="Jumlah"
                        size="medium"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1, max: product.stock }}
                        sx={{ width: 100 }}
                     />
                     <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<MdAddShoppingCart />}
                        onClick={() => addItem(product, quantity)}
                        disabled={product.stock <= 0}
                        sx={{ 
                           py: 1.8, 
                           borderRadius: 3, 
                           fontWeight: 'bold', 
                           fontSize: '1.1rem',
                           boxShadow: '0 4px 14px 0 rgba(0,118,210,0.39)'
                        }}
                     >
                        Tambah ke Keranjang
                     </Button>
                  </Box>
               </Box>
            </Grid>
         </Grid>
      </Container>
   );
};

export default ProductDetail;
