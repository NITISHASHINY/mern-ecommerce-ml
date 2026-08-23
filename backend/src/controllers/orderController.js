const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../utils/emailService');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, guestEmail } = req.body;
    
    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      
      // Check if product is active
      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }
      
      // Check inventory
      if (product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${product.name}. Available: ${product.inventory.quantity}`
        });
      }
      
      const totalPrice = product.price * item.quantity;
      subtotal += totalPrice;
      
      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        totalPrice: totalPrice
      });
      
      // Update inventory
      product.inventory.quantity -= item.quantity;
      await product.save();
    }
    
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    const orderData = {
      items: orderItems,
      subtotal,
      tax,
      total,
      paymentMethod,
      shippingAddress
    };
    
    // Add userId if logged in, otherwise add guest email
    if (req.user && req.user._id) {
      orderData.userId = req.user._id;
    } else if (guestEmail) {
      orderData.guestEmail = guestEmail;
    }
    
    const order = new Order(orderData);
    await order.save();
    
    // Send confirmation email
    try {
      const user = req.user || { email: guestEmail, name: 'Guest' };
      await sendOrderConfirmation(order, user);
      console.log(`📧 Order confirmation email sent for ${order.orderNumber}`);
    } catch (emailError) {
      console.error('❌ Email error:', emailError.message);
      // Don't fail the order if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ 
      $or: [
        { userId: userId },
        { guestEmail: userId }
      ]
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Prevent status changes for cancelled or delivered orders
    if (order.status === 'cancelled' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: `Cannot update status of ${order.status} order`
      });
    }
    
    const oldStatus = order.status;
    order.status = status;
    
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    
    if (status === 'cancelled') {
      order.cancelledAt = Date.now();
    }
    
    await order.save();
    
    // Send status update email
    try {
      let user = null;
      if (order.userId) {
        user = await User.findById(order.userId);
      }
      const emailUser = user || { email: order.guestEmail, name: 'Guest' };
      await sendOrderStatusUpdate(order, emailUser);
      console.log(`📧 Order status update email sent for ${order.orderNumber}`);
    } catch (emailError) {
      console.error('❌ Email error:', emailError.message);
      // Don't fail the order if email fails
    }
    
    res.json({
      success: true,
      message: `Order status updated from ${oldStatus} to ${status}`,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Prevent payment status changes for cancelled orders
    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update payment status for cancelled order'
      });
    }
    
    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'paid') {
      order.paymentDetails = {
        transactionId: transactionId || `TXN-${Date.now()}`,
        paidAt: Date.now()
      };
    }
    
    // If order is paid, automatically confirm it
    if (paymentStatus === 'paid' && order.status === 'pending') {
      order.status = 'confirmed';
    }
    
    await order.save();
    
    // Send status update email for payment
    if (paymentStatus === 'paid') {
      try {
        let user = null;
        if (order.userId) {
          user = await User.findById(order.userId);
        }
        const emailUser = user || { email: order.guestEmail, name: 'Guest' };
        await sendOrderStatusUpdate(order, emailUser);
        console.log(`📧 Payment confirmation email sent for ${order.orderNumber}`);
      } catch (emailError) {
        console.error('❌ Email error:', emailError.message);
      }
    }
    
    res.json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order can be cancelled
    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered order'
      });
    }
    
    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }
    
    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.inventory.quantity += item.quantity;
        await product.save();
      }
    }
    
    const oldStatus = order.status;
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();
    
    // Send cancellation email
    try {
      let user = null;
      if (order.userId) {
        user = await User.findById(order.userId);
      }
      const emailUser = user || { email: order.guestEmail, name: 'Guest' };
      await sendOrderStatusUpdate(order, emailUser);
      console.log(`📧 Cancellation email sent for ${order.orderNumber}`);
    } catch (emailError) {
      console.error('❌ Email error:', emailError.message);
    }
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete order (admin only - for testing)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusCounts
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByUser,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats
};