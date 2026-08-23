import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (params) => api.get('/products/search', { params }),
  getCategories: () => api.get('/products/categories'),
  getFeatured: () => api.get('/products/featured'),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getTree: () => api.get('/categories/tree'),
  getFlat: () => api.get('/categories/flat'),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};
export default api;

// Review API
export const reviewAPI = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (data) => api.post('/reviews', data),
  markHelpful: (id) => api.put(`/reviews/${id}/helpful`),
};