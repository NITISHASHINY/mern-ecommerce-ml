import React, { useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

// Helper functions for product images
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
    'gaming': '🎮',
    'electronics': '📱',
    'clothing': '👕',
    'books': '📚',
    'beauty': '💄',
    'home': '🏠',
    'sports': '⚽',
    'toys': '🧸',
    'automotive': '🚗',
  };
  
  const lowerName = name?.toLowerCase() || '';
  for (const [key, emoji] of Object.entries(emojis)) {
    if (lowerName.includes(key)) return emoji;
  }
  return '🍓';
};

const getCategoryColor = (category) => {
  const colors = {
    'electronics': 'DCC8FF',
    'clothing': 'FFC6A8',
    'books': 'BFD8B8',
    'beauty': 'F8D7DA',
    'home': 'FFF5F0',
    'sports': 'FFE8E0',
    'toys': 'FFDDCC',
    'automotive': 'E8D5B8',
  };
  return colors[category?.toLowerCase()] || 'FFF5F0';
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
  });

  const { data, isLoading, error } = useQuery(
    ['products', searchParams],
    () => productAPI.search(searchParams),
    { keepPreviousData: true }
  );

  const products = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const handleSearch = (e) => {
    setSearchParams({ ...searchParams, keyword: e.target.value, page: 1 });
  };

  const handleCategoryChange = (e) => {
    setSearchParams({ ...searchParams, category: e.target.value, page: 1 });
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setSearchParams({ ...searchParams, sortBy, sortOrder, page: 1 });
  };

  const handlePageChange = (e, value) => {
    setSearchParams({ ...searchParams, page: value });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#EFA5B6' }} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading products</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom fontFamily='"Playfair Display", serif'>
        Our Collection
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search products"
            value={searchParams.keyword}
            onChange={handleSearch}
            placeholder="Search for fruits, treats..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 30,
              }
            }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={searchParams.category} onChange={handleCategoryChange} label="Category">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
              <MenuItem value="Beauty">Beauty</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={`${searchParams.sortBy}-${searchParams.sortOrder}`}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="createdAt-desc">Newest</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name-asc">Name: A to Z</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card
              component={motion.div}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                height="220"
                image={product.images?.[0] || `https://via.placeholder.com/300x220/${getCategoryColor(product.category)}/FFF5F0?text=${getProductEmoji(product.name)}`}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontFamily='"Playfair Display", serif' gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Category: {product.category || 'Uncategorized'}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/product/${product._id}`}
                    variant="contained"
                    size="small"
                  >
                    View
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pagination && pagination.pages > 1 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 20,
              },
              '& .Mui-selected': {
                bgcolor: '#EFA5B6 !important',
                color: 'white',
              },
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default ProductsPage;