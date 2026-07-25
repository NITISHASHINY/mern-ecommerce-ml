import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #FFF5F0, #FFE8E0)',
        }}
      >
        <Typography variant="h4" fontFamily='"Playfair Display", serif'>
          🍓 Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your store
        </Typography>
      </Paper>
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
};

export default AdminLayout;