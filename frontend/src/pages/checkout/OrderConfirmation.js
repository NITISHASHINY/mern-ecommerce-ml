import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { orderAPI } from '../../services/api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ['order', id],
    () => orderAPI.getById(id),
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#EFA5B6' }} />
      </Box>
    );
  }

  const order = data?.data?.data;

  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <CheckCircle sx={{ fontSize: 80, color: '#BFD8B8' }} />
      <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
        Order Confirmed! 🎉
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        Thank you for your order!
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Order Number: {order?.orderNumber}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/products')}
        sx={{ mt: 4 }}
      >
        Continue Shopping
      </Button>
    </Box>
  );
};

export default OrderConfirmation;