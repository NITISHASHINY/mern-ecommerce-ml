import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Container, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productAPI } from '../services/api';

const fruits = ['🍓', '🍑', '🍒', '🍇', '🍊', '🍉'];

const HomePage = () => {
  const { data: featuredData, isLoading } = useQuery('featured', () => productAPI.getFeatured());

  const featuredProducts = featuredData?.data?.data || [];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8E0 30%, #F8D7DA 60%, #DCC8FF 100%)',
          overflow: 'hidden',
          mx: -3,
          px: 3,
          py: 8,
          borderRadius: '0 0 40px 40px',
        }}
      >
        {fruits.map((fruit, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              fontSize: '3rem',
              opacity: 0.15,
              pointerEvents: 'none',
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          >
            <Box sx={{ left: `${10 + index * 8}%`, top: `${10 + (index * 7) % 60}%` }}>
              {fruit}
            </Box>
          </motion.div>
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.8rem', md: '4.5rem' },
                    lineHeight: 1.1,
                    mb: 2,
                    color: '#4A3A3A',
                  }}
                >
                  Fresh, <br />
                  <span style={{ background: 'linear-gradient(135deg, #EFA5B6, #FFC6A8, #DCC8FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Elegant
                  </span>
                  <br />
                  Delivered
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                  Premium fruits and treats with a touch of luxury. Beautifully curated, freshly delivered.
                </Typography>
                <Button
                  component={Link}
                  to="/products"
                  size="large"
                  variant="contained"
                  sx={{ py: 1.5, px: 5, fontSize: '1.1rem' }}
                >
                  Explore Collection
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {['🍓', '🍑', '🍒', '🍇', '🍊'].map((fruit, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                      style={{ fontSize: '5rem' }}
                    >
                      {fruit}
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" align="center" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 1, color: '#4A3A3A' }}>
          Featured Collection
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Handpicked just for you
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress sx={{ color: '#EFA5B6' }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.images?.[0] || `https://via.placeholder.com/300x220/FFF5F0/EFA5B6?text=${product.emoji || '🍓'}`}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontFamily='"Playfair Display", serif' gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description?.substring(0, 60)}...
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
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center" color="text.secondary">
                  No featured products available
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Categories */}
      <Box sx={{ py: 6, bgcolor: 'rgba(239, 165, 182, 0.06)', borderRadius: 4 }}>
        <Typography variant="h2" align="center" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4, color: '#4A3A3A' }}>
          Shop by Category
        </Typography>
        <Grid container spacing={3}>
          {['🍓 Berries', '🍑 Peaches', '🍒 Cherries', '🍇 Grapes', '🍊 Citrus', '🍎 Apples'].map((cat, i) => (
            <Grid item xs={6} md={4} key={i}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.03 }}
                sx={{
                  textAlign: 'center',
                  py: 4,
                  background: `linear-gradient(135deg, ${['#FFF5F0', '#FFE8E0', '#F8D7DA', '#DCC8FF', '#BFD8B8', '#FFC6A8'][i]})`,
                }}
              >
                <Typography variant="h2" sx={{ fontSize: '3rem' }}>{cat.split(' ')[0]}</Typography>
                <Typography variant="subtitle1" fontWeight={500}>{cat.split(' ')[1]}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;

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