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
} from '@mui/material';
import { motion } from 'framer-motion';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'Fresh Strawberries', price: 12.99, category: 'Berries', image: '🍓' },
    { id: 2, name: 'Organic Peaches', price: 9.99, category: 'Peaches', image: '🍑' },
    { id: 3, name: 'Sweet Cherries', price: 14.99, category: 'Cherries', image: '🍒' },
    { id: 4, name: 'Green Grapes', price: 7.99, category: 'Grapes', image: '🍇' },
    { id: 5, name: 'Fresh Oranges', price: 5.99, category: 'Citrus', image: '🍊' },
    { id: 6, name: 'Red Apples', price: 4.99, category: 'Apples', image: '🍎' },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom fontFamily='"Playfair Display", serif'>
        Our Collection
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for fruits, treats..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 30,
            }
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              component={motion.div}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Box sx={{ fontSize: '5rem', textAlign: 'center', py: 2, bgcolor: '#FFF5F0' }}>
                {product.image}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontFamily='"Playfair Display", serif' gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Category: {product.category}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button variant="contained" size="small">
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsPage;