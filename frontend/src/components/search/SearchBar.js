import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Popper,
  ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const anchorRef = useRef(null);

  const { data, refetch } = useQuery(
    ['searchSuggestions', searchTerm],
    () => productAPI.search({ keyword: searchTerm, limit: 5 }),
    { enabled: searchTerm.length > 2, keepPreviousData: true }
  );

  const suggestions = data?.data?.data || [];

  useEffect(() => {
    if (searchTerm.length > 2) {
      refetch();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchTerm, refetch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setOpen(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }} ref={anchorRef}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 2 && setOpen(true)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 30,
              bgcolor: 'rgba(239, 165, 182, 0.08)',
              '&:hover': {
                bgcolor: 'rgba(239, 165, 182, 0.15)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </form>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{ width: '100%', zIndex: 1000 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper sx={{ mt: 1, borderRadius: 4, maxHeight: 300, overflow: 'auto' }}>
            {suggestions.length > 0 ? (
              <List>
                {suggestions.map((product) => (
                  <ListItem
                    key={product._id}
                    onClick={() => handleSuggestionClick(product._id)}
                    sx={{ '&:hover': { bgcolor: 'rgba(239, 165, 182, 0.08)' } }}
                  >
                    <ListItemText
                      primary={product.name}
                      secondary={`$${product.price} - ${product.category}`}
                    />
                  </ListItem>
                ))}
                <ListItem onClick={handleSearch} sx={{ '&:hover': { bgcolor: 'rgba(239, 165, 182, 0.08)' } }}>
                  <ListItemText
                    primary={`Search for "${searchTerm}"`}
                    secondary="View all results"
                    sx={{ color: 'primary.main' }}
                  />
                </ListItem>
              </List>
            ) : searchTerm.length > 2 ? (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                No products found for "{searchTerm}"
              </Box>
            ) : null}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default SearchBar;