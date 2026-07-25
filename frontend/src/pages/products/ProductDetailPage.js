import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Typography, Box, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { productAPI } from '../../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => productAPI.getById(id),
    { enabled: !!id }
  );

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
            SKU: {product.sku}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Stock: {product.inventory?.quantity > 0 ? `${product.inventory.quantity} available` : 'Out of stock'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            disabled={product.inventory?.quantity === 0}
            sx={{ mt: 2 }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;