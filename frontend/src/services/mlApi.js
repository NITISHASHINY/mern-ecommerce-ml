import axios from 'axios';

const ML_API_URL = process.env.REACT_APP_ML_URL || 'http://localhost:5001';

const mlApi = axios.create({
  baseURL: ML_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mlAPI = {
  // Get recommendations for a product
  getSimilarProducts: (productId, limit = 6) => {
    return mlApi.post('/recommend', { product_id: productId, limit });
  },
  
  // Get personalized recommendations for a user
  getPersonalizedRecommendations: (userId, limit = 6) => {
    return mlApi.post('/recommend', { user_id: userId, limit });
  },
  
  // Track user interaction
  trackInteraction: (data) => {
    return mlApi.post('/track', data);
  },
  
  // Get ML service stats
  getStats: () => {
    return mlApi.get('/stats');
  },
  
  // Train the model
  trainModel: () => {
    return mlApi.post('/train');
  },
};

export default mlApi;