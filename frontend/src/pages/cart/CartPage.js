import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import { Add, Remove, DeleteOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

// Helper function for product emoji
const getProductEmoji = (name) => {
  const emojis = {
    'laptop': '💻',
    'phone': '📱',
    'book': '📚',
    'tshirt': '👕',
    'shirt': '👔',
    'shoes': '👟',
    'bag': '👜',
    'watch': '⌚',
    'headphones': '🎧',
    'camera': '📷',
    'electronics': '📱',
    'clothing': '👕',
    'books': '📚',
    'beauty': '💄',
    'home': '🏠',
    'sports': '⚽',
    'toys': '🧸',
    'automotive': '🚗',
    'strawberry': '🍓',
    'peach': '🍑',
    'cherry': '🍒',
    'grape': '🍇',
    'orange': '🍊',
    'apple': '🍎',
  };
  
  const lowerName = name?.toLowerCase() || '';
  for (const [key, emoji] of Object.entries(emojis)) {
    if (lowerName.includes(key)) return emoji;
  }
  return '🍓';
};

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" sx={{ fontSize: '4rem' }}>
          🛒
        </Typography>
        <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added any items yet.
        </Typography>
        <Button component={Link} to="/products" variant="contained" size="large">
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
        Your Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card
              key={item._id}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ mb: 2, display: 'flex', alignItems: 'center', p: 2, borderRadius: 4 }}
            >
              <CardMedia
                component="img"
                image={item.images?.[0] || `https://via.placeholder.com/80/FFF5F0/EFA5B6?text=${getProductEmoji(item.name)}`}
                alt={item.name}
                sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontFamily='"Playfair Display", serif'>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${item.price.toFixed(2)}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  sx={{ border: '1px solid #EFA5B6', borderRadius: 2 }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  sx={{ border: '1px solid #EFA5B6', borderRadius: 2 }}
                >
                  <Add fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => removeFromCart(item._id)}
                  sx={{ color: '#F76C82' }}
                >
                  <DeleteOutline />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontFamily='"Playfair Display", serif' gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Items ({cartItems.length})
              </Typography>
              <Typography variant="body2">
                ${getTotalPrice().toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Shipping
              </Typography>
              <Typography variant="body2">
                $0.00
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Tax
              </Typography>
              <Typography variant="body2">
                ${(getTotalPrice() * 0.1).toFixed(2)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontFamily='"Playfair Display", serif'>
                Total
              </Typography>
              <Typography variant="h6" color="primary">
                ${(getTotalPrice() + getTotalPrice() * 0.1).toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              component={Link}
              to="/checkout"
              sx={{ py: 1.5 }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;