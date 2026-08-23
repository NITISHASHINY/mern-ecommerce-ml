import React from 'react';
import {
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';

const ProductFilters = ({ filters, setFilters, categories }) => {
  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, minPrice: newValue[0], maxPrice: newValue[1] });
  };

  const handleCategoryChange = (event) => {
    setFilters({ ...filters, category: event.target.value });
  };

  const handleSortChange = (event) => {
    const [sortBy, sortOrder] = event.target.value.split('-');
    setFilters({ ...filters, sortBy, sortOrder });
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'rgba(239, 165, 182, 0.06)', borderRadius: 4 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Filters
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select value={filters.category} onChange={handleCategoryChange} label="Category">
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </Typography>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          onChange={handlePriceChange}
          min={0}
          max={10000}
          sx={{ color: '#EFA5B6' }}
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={handleSortChange}
          label="Sort By"
        >
          <MenuItem value="createdAt-desc">Newest</MenuItem>
          <MenuItem value="price-asc">Price: Low to High</MenuItem>
          <MenuItem value="price-desc">Price: High to Low</MenuItem>
          <MenuItem value="name-asc">Name: A to Z</MenuItem>
          <MenuItem value="ratings.average-desc">Highest Rated</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {filters.category || 'All'} • {filters.keyword ? `"${filters.keyword}"` : 'All products'}
        </Typography>
        <Chip
          label="Clear All"
          size="small"
          onClick={clearFilters}
          sx={{ bgcolor: '#EFA5B6', color: 'white' }}
        />
      </Box>
    </Box>
  );
};

export default ProductFilters;