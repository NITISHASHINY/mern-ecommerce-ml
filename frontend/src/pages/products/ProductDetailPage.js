import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { addToCart } = useCart();

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => productAPI.getById(id),
    { enabled: !!id }
  );

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setOpenSnackbar(true);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#EFA5B6' }} />
      </Box>
    );
  }

  if (error || !data?.data) {
    return <Typography color="error">Product not found</Typography>;
  }

  const product = data.data.data;

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              fontSize: '8rem',
              bgcolor: '#FFF5F0',
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
              />
            ) : (
              '🍓'
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom fontFamily='"Playfair Display", serif'>
            {product.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category: {product.category || 'Uncategorized'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Stock: {product.inventory?.quantity > 0 ? `${product.inventory.quantity} available` : 'Out of stock'}
          </Typography>

          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
            <IconButton 
              onClick={() => handleQuantityChange('decrease')}
              disabled={quantity <= 1}
              sx={{ border: '1px solid #EFA5B6', borderRadius: 2 }}
            >
              <Remove />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
              {quantity}
            </Typography>
            <IconButton 
              onClick={() => handleQuantityChange('increase')}
              disabled={product.inventory?.quantity <= quantity}
              sx={{ border: '1px solid #EFA5B6', borderRadius: 2 }}
            >
              <Add />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            size="large"
            disabled={product.inventory?.quantity === 0}
            onClick={handleAddToCart}
            sx={{ mt: 3, px: 6 }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success"
          sx={{ borderRadius: 4 }}
        >
          {product.name} added to cart! 🍓
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;

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
  };
  const lowerName = name?.toLowerCase() || '';
  for (const [key, emoji] of Object.entries(emojis)) {
    if (lowerName.includes(key)) return emoji;
  }
  return '🍓';
};