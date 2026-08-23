import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../services/api';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: shippingData,
        paymentMethod: paymentMethod,
        guestEmail: shippingData.email,
      };

      const response = await orderAPI.create(orderData);
      
      if (response.data.success) {
        clearCart();
        navigate(`/order-confirmation/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontFamily='"Playfair Display", serif'>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={shippingData.name}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={shippingData.email}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={shippingData.street}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingData.city}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  name="state"
                  value={shippingData.state}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={shippingData.zipCode}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingData.country}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleShippingChange}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontFamily='"Playfair Display", serif'>
              Payment Method
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel 
                  value="credit_card" 
                  control={<Radio />} 
                  label="Credit Card 💳" 
                />
                <FormControlLabel 
                  value="paypal" 
                  control={<Radio />} 
                  label="PayPal" 
                />
                <FormControlLabel 
                  value="cod" 
                  control={<Radio />} 
                  label="Cash on Delivery" 
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'credit_card' && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Card Number" placeholder="1234 5678 9012 3456" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Expiry Date" placeholder="MM/YY" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="CVV" placeholder="123" />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontFamily='"Playfair Display", serif'>
              Order Review
            </Typography>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 4 }}>
              <Typography variant="subtitle1" fontWeight={600}>Shipping Address</Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingData.name}<br />
                {shippingData.street}<br />
                {shippingData.city}, {shippingData.state} {shippingData.zipCode}<br />
                {shippingData.country}<br />
                {shippingData.phone}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 4 }}>
              <Typography variant="subtitle1" fontWeight={600}>Order Items</Typography>
              {cartItems.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography variant="body2">
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${getTotalPrice().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Tax (10%)</Typography>
                <Typography variant="body2">${(getTotalPrice() * 0.1).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${(getTotalPrice() * 1.1).toFixed(2)}
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="subtitle1" fontWeight={600}>Payment Method</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {paymentMethod.replace('_', ' ')}
              </Typography>
            </Paper>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CheckoutPage;