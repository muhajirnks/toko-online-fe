import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useEffect, useMemo } from "react";
import { useListProducts } from "@/services/product.service";
import ProductCard from "@/components/ProductCard";
import {
   MdChevronRight,
   MdLocalOffer,
   MdSecurity,
   MdLocalShipping,
} from "react-icons/md";
import hero from '@/assets/img/hero.jpg'

const Home = () => {
   const { categories, fetchCategories } = useCategoryStore();
   const params = useMemo(() => ({ limit: 4 }), []);
   const { data: latestProducts } = useListProducts(params);

   useEffect(() => {
      fetchCategories();
   }, []);

   return (
      <Box>
         {/* Hero Section */}
         <Box
            sx={{
               bgcolor: "primary.main",
               color: "white",
               py: { xs: 8, md: 12 },
               backgroundImage:
                  "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
               position: "relative",
               overflow: "hidden",
            }}
         >
            <Container maxWidth="xl">
               <Grid container alignItems="center" spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <Typography
                        variant="h2"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ fontSize: { xs: "2.5rem", md: "3.75rem" }, color: 'white' }}
                     >
                        Temukan Produk Impian Anda
                     </Typography>
                     <Typography variant="h5" sx={{ mb: 4, color: '#d0d0d0' }}>
                        Belanja aman, cepat, dan terpercaya hanya di TokoOnline.
                     </Typography>
                     <Button
                        component={Link}
                        to="/products"
                        variant="contained"
                        size="large"
                        sx={{
                           bgcolor: "white",
                           color: "primary.main",
                           "&:hover": { bgcolor: "grey.100" },
                           px: 4,
                           py: 1.5,
                           borderRadius: 2,
                           fontWeight: "bold",
                        }}
                     >
                        Mulai Belanja
                     </Button>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                     <Box
                        component="img"
                        src={hero}
                        alt="Hero"
                        className="rounded-md max-w-[500px] mx-auto w-full"
                     />
                  </Grid>
               </Grid>
            </Container>
         </Box>

         {/* Features Section */}
         <Container maxWidth="xl" sx={{ py: 6 }}>
            <Grid container spacing={4}>
               {[
                  {
                     icon: <MdLocalShipping />,
                     title: "Pengiriman Cepat",
                     desc: "Sampai di tujuan tepat waktu",
                  },
                  {
                     icon: <MdSecurity />,
                     title: "Pembayaran Aman",
                     desc: "Sistem pembayaran terenkripsi",
                  },
                  {
                     icon: <MdLocalOffer />,
                     title: "Harga Terbaik",
                     desc: "Kualitas premium harga minimum",
                  },
               ].map((feature, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                     <Paper
                        elevation={0}
                        sx={{
                           p: 3,
                           textAlign: "center",
                           bgcolor: "background.paper",
                           border: "1px solid",
                           borderColor: "divider",
                           borderRadius: 4,
                        }}
                     >
                        <Box
                           sx={{
                              color: "primary.main",
                              fontSize: "2.5rem",
                              mb: 2,
                           }}
                           className="mx-auto w-fit"
                        >
                           {feature.icon}
                        </Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                           {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                           {feature.desc}
                        </Typography>
                     </Paper>
                  </Grid>
               ))}
            </Grid>
         </Container>

         {/* Categories Section */}
         <Box sx={{ py: 8 }}>
            <Container maxWidth="xl">
               <Box
                  sx={{
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                     mb: 4,
                  }}
               >
                  <Typography variant="h4" fontWeight="bold">
                     Kategori Populer
                  </Typography>
                  <Button
                     component={Link}
                     to="/products"
                     endIcon={<MdChevronRight />}
                  >
                     Lihat Semua
                  </Button>
               </Box>
               <Grid container spacing={2}>
                  {categories.slice(0, 6).map((cat) => (
                     <Grid size={{ xs: 6, sm: 4, md: 2 }} key={cat._id}>
                        <Paper
                           component={Link}
                           to={`/products?categoryId=${cat._id}`}
                           className="hover:-translate-y-0.5 p-3 h-full grid place-items-center transition-all min-h-16"
                        >
                           <Typography variant="subtitle1" fontWeight="bold">
                              {cat.name}
                           </Typography>
                        </Paper>
                     </Grid>
                  ))}
               </Grid>
            </Container>
         </Box>

         {/* Latest Products Section */}
         <Container maxWidth="xl" sx={{ py: 8 }}>
            <Box
               sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
               }}
            >
               <Typography variant="h4" fontWeight="bold">
                  Produk Terbaru
               </Typography>
               <Button
                  component={Link}
                  to="/products"
                  endIcon={<MdChevronRight />}
               >
                  Lihat Semua
               </Button>
            </Box>
            <Grid container spacing={3}>
               {latestProducts?.data.map((product) => (
                  <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
                     <ProductCard product={product} />
                  </Grid>
               ))}
            </Grid>
         </Container>
      </Box>
   );
};

export default Home;
