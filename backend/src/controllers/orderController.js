console.log('Order controller loaded');

const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    console.log('Create order called');
    
    // Generate order number manually
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000);
    const orderNumber = `ORD-${year}${month}-${String(random).padStart(6, '0')}`;
    
    const order = new Order({
      orderNumber: orderNumber,
      items: [{
        productId: new mongoose.Types.ObjectId(),
        name: 'Test Product',
        sku: 'TEST',
        price: 100,
        quantity: 1,
        totalPrice: 100
      }],
      subtotal: 100,
      tax: 10,
      total: 110,
      paymentMethod: 'credit_card',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '1234567890'
      },
      guestEmail: 'test@test.com'
    });
    
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: error.message });
  }
};


const getOrders = async (req, res) => {
  try {
    console.log('getOrders called');
    const orders = await Order.find();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('getOrders error:', error);
    res.json({ success: false, message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    console.log('getOrder called for id:', req.params.id);
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('getOrder error:', error);
    res.json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    console.log('updateOrderStatus called');
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }
    order.status = req.body.status || 'processing';
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.json({ success: false, message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    console.log('updatePaymentStatus called');
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }
    order.paymentStatus = req.body.paymentStatus || 'paid';
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('updatePaymentStatus error:', error);
    res.json({ success: false, message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    console.log('deleteOrder called');
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('deleteOrder error:', error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
};