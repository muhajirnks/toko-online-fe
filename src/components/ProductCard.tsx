import type { Product } from "@/types/api/product.type";
import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton, Tooltip, Chip } from "@mui/material";
import { useCartStore } from "@/store/useCartStore";
import { Link } from "react-router-dom";
import { MdAddShoppingCart, MdFavoriteBorder, MdVisibility } from "react-icons/md";

interface ProductCardProps {
   product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
   const addItem = useCartStore((state) => state.addItem);

   return (
      <Card 
         sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative',
            borderRadius: 4,
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
            border: '1px solid transparent',
            '&:hover': {
               boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
               borderColor: 'primary.light',
               '& .product-actions': {
                  opacity: 1,
                  transform: 'translateX(0)'
               }
            }
         }}
      >
         {/* Product Actions Overlay */}
         <Box 
            className="product-actions"
            sx={{ 
               position: 'absolute', 
               right: 12, 
               top: 12, 
               display: 'flex', 
               flexDirection: 'column', 
               gap: 1,
               zIndex: 2,
               opacity: 0,
               transform: 'translateX(20px)',
               transition: 'all 0.3s ease'
            }}
         >
            <Tooltip title="Lihat Detail" placement="left">
               <IconButton 
                  component={Link} 
                  to={`/products/${product._id}`}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'primary.main', color: 'white' }, boxShadow: 2 }}
               >
                  <MdVisibility size={20} />
               </IconButton>
            </Tooltip>
            <Tooltip title="Tambah ke Favorit" placement="left">
               <IconButton 
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'error.main', color: 'white' }, boxShadow: 2 }}
               >
                  <MdFavoriteBorder size={20} />
               </IconButton>
            </Tooltip>
         </Box>

         {/* Category Chip */}
         {product.category && (
            <Chip 
               label={product.category.name}
               size="small"
               sx={{ 
                  position: 'absolute', 
                  left: 12, 
                  top: 12, 
                  zIndex: 2, 
                  bgcolor: 'rgba(255,255,255,0.9)', 
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)'
               }}
            />
         )}

         <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
               <CardMedia
                  component="img"
                  height="220"
                  image={product.imageUrl || "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"}
                  alt={product.name}
                  sx={{ 
                     objectFit: 'cover',
                     transition: 'transform 0.5s ease',
                     '&:hover': { transform: 'scale(1.1)' }
                  }}
               />
               {product.stock <= 0 && (
                  <Box 
                     sx={{ 
                        position: 'absolute', 
                        inset: 0, 
                        bgcolor: 'rgba(0,0,0,0.5)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                     }}
                  >
                     <Typography color="white" fontWeight="bold" variant="h6">STOK HABIS</Typography>
                  </Box>
               )}
            </Box>
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
               <Typography 
                  gutterBottom 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  component="div" 
                  noWrap
                  sx={{ mb: 0.5 }}
               >
                  {product.name}
               </Typography>
               <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{
                     display: '-webkit-box',
                     WebkitLineClamp: 1,
                     WebkitBoxOrient: 'vertical',
                     overflow: 'hidden',
                     mb: 1.5
                  }}
               >
                  {product.description}
               </Typography>
               <Typography variant="h6" color="primary.main" fontWeight="bold">
                  Rp {product.price.toLocaleString('id-ID')}
               </Typography>
            </CardContent>
         </Link>
         <Box sx={{ p: 2, pt: 0 }}>
            <Button
               fullWidth
               variant="contained"
               startIcon={<MdAddShoppingCart />}
               onClick={() => addItem(product)}
               disabled={product.stock <= 0}
               sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
               }}
            >
               {product.stock > 0 ? "Beli Sekarang" : "Stok Habis"}
            </Button>
         </Box>
      </Card>
   );
};

export default ProductCard;
