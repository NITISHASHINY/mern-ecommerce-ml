import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { mlAPI } from '../../services/mlApi';
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { addToCart } = useCart();

  // Fetch product details
  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => productAPI.getById(id),
    { enabled: !!id }
  );

  // Fetch similar products from ML service
  const { data: similarData, isLoading: similarLoading } = useQuery(
    ['similar', id],
    () => mlAPI.getSimilarProducts(id, 4),
    { enabled: !!id }
  );

  // Track view when product loads
  useEffect(() => {
    if (id) {
      const userId = localStorage.getItem('userId') || 'guest';
      mlAPI.trackInteraction({
        user_id: userId,
        product_id: id,
        type: 'view',
        session_id: sessionStorage.getItem('sessionId') || 'guest-session'
      }).catch(err => console.log('Track view error:', err));
    }
  }, [id]);

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
  const similarProducts = similarData?.data?.recommendations || [];

  return (
    <Box>
      {/* Product Detail */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: '#FFF5F0',
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
              />
            ) : (
              <Box sx={{ fontSize: '8rem' }}>
                {getProductEmoji(product.name)}
              </Box>
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

      {/* You May Also Like - ML Recommendations */}
      {similarProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography 
            variant="h5" 
            fontFamily='"Playfair Display", serif' 
            gutterBottom
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              '&::after': {
                content: '""',
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, #EFA5B6, transparent)',
                ml: 2,
              }
            }}
          >
            🍓 You May Also Like
          </Typography>

          <Grid container spacing={3}>
            {similarProducts.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <Card
                  component={motion.div}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.images?.[0] || `https://via.placeholder.com/300x180/FFF5F0/EFA5B6?text=${getProductEmoji(item.name)}`}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontFamily='"Playfair Display", serif' noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${item.price?.toFixed(2) || '0.00'}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/product/${item._id}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

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