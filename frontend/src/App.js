import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { CartProvider } from './context/CartContext';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderConfirmation from './pages/checkout/OrderConfirmation';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;