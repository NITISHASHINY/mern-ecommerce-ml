import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { productAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';

const ProductManagement = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sku: '',
    inventory: { quantity: '' },
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isLoading } = useQuery('products', () => productAPI.getAll());

  const createMutation = useMutation(productAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      handleCloseDialog();
      setSnackbar({ open: true, message: 'Product created successfully!', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => productAPI.updateProduct(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        handleCloseDialog();
        setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
      },
      onError: (error) => {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      },
    }
  );

  const deleteMutation = useMutation(productAPI.deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    },
  });

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        sku: product.sku,
        inventory: { quantity: product.inventory?.quantity || '' },
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        sku: '',
        inventory: { quantity: '' },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setFormData({
        ...formData,
        inventory: { ...formData.inventory, quantity: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      inventory: {
        quantity: parseInt(formData.inventory.quantity) || 0,
      },
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const products = data?.data?.data || [];

  if (isLoading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: '#EFA5B6' }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontFamily='"Playfair Display", serif'>
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#FFF5F0' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price?.toFixed(2)}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.inventory?.quantity || 0}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(product)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product._id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Stock Quantity"
              name="quantity"
              type="number"
              value={formData.inventory.quantity}
              onChange={handleFormChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 4 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ProductManagement;