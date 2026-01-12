import { Container, Typography, Box, Grid, Card, CardContent, IconButton, Button, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { useCartStore } from "@/store/useCartStore";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "@/services/order.service";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { useState } from "react";

const CartPage = () => {
   const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
   const setSnackbar = useSnackbarStore((s) => s.setSnackbar);
   const navigate = useNavigate();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleCheckout = async () => {
      setIsSubmitting(true);
      try {
         const orderItems = items.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
         }));

         const { error } = await createOrder({ items: orderItems });

         if (error) {
            setSnackbar({ type: "failure", message: error.message });
         } else {
            setSnackbar({ type: "success", message: "Order created successfully!" });
            clearCart();
            navigate("/orders");
         }
      } catch (err: any) {
         setSnackbar({ type: "failure", message: err.message || "Failed to create order" });
      } finally {
         setIsSubmitting(false);
      }
   };

   if (items.length === 0) {
      return (
         <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
            <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
               Go Shopping
            </Button>
         </Container>
      );
   }

   return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
         <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Shopping Cart
         </Typography>
         <Grid container spacing={4}>
            <Grid size={{xs: 12, md: 8}}>
               <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                  {items.map((item) => (
                     <Box key={item.product._id}>
                        <ListItem
                           alignItems="flex-start"
                           secondaryAction={
                              <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.product._id)}>
                                 <FaTrash color="error" />
                              </IconButton>
                           }
                        >
                           <ListItemAvatar sx={{ mr: 2 }}>
                              <Avatar
                                 variant="rounded"
                                 src={item.product.imageUrl}
                                 sx={{ width: 80, height: 80 }}
                              />
                           </ListItemAvatar>
                           <ListItemText
                              primary={
                                 <Typography variant="h6" component={Link} to={`/products/${item.product._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                    {item.product.name}
                                 </Typography>
                              }
                              secondary={
                                 <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.primary">
                                       ${item.product.price.toLocaleString()}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                       <IconButton size="small" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                                          <FaMinus size={14} />
                                       </IconButton>
                                       <Typography variant="body1">{item.quantity}</Typography>
                                       <IconButton size="small" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                                          <FaPlus size={14} />
                                       </IconButton>
                                    </Box>
                                 </Box>
                              }
                           />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                     </Box>
                  ))}
               </List>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
               <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                  <CardContent>
                     <Typography variant="h6" gutterBottom>Order Summary</Typography>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1">Total Items</Typography>
                        <Typography variant="body1">{items.reduce((acc, item) => acc + item.quantity, 0)}</Typography>
                     </Box>
                     <Divider sx={{ my: 2 }} />
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Typography variant="h6">Total Price</Typography>
                        <Typography variant="h6" color="primary">${getTotalPrice().toLocaleString()}</Typography>
                     </Box>
                     <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleCheckout}
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? "Processing..." : "Checkout Now"}
                     </Button>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </Container>
   );
};

export default CartPage;
