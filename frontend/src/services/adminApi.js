import api from './api';

export const adminAPI = {
  // Product Management
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Order Management
  getOrders: () => api.get('/orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  
  // Analytics
  getProductStats: () => api.get('/products/stats'),
  getOrderStats: () => api.get('/orders/stats'),
};

export default adminAPI;