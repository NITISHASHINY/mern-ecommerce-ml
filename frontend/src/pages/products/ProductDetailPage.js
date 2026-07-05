import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, Grid, Paper } from '@mui/material';

const ProductDetailPage = () => {
  const { id } = useParams();

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, textAlign: 'center', fontSize: '8rem', bgcolor: '#FFF5F0' }}>
            🍓
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom fontFamily='"Playfair Display", serif'>
            Fresh Strawberries
          </Typography>
          <Typography variant="body1" paragraph>
            Premium organic strawberries from local farms. Sweet, juicy, and freshly picked.
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            $12.99
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category: Berries
          </Typography>
          <Button variant="contained" size="large" sx={{ mt: 2 }}>
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;