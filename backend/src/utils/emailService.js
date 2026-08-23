const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send order confirmation email
const sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${item.totalPrice.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order, ${user.name || 'Customer'}!</p>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
    
    <h2>Order Summary</h2>
    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
    <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    
    <h3>Shipping Address</h3>
    <p>
      ${order.shippingAddress.name}<br>
      ${order.shippingAddress.street}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
      ${order.shippingAddress.country}<br>
      ${order.shippingAddress.phone}
    </p>
    
    <p>We'll notify you when your order ships!</p>
    <p>Thank you for shopping with us! 🍓</p>
  `;

  await transporter.sendMail({
    from: `"Fruite" <${process.env.SMTP_USER}>`,
    to: user.email || order.guestEmail,
    subject: `Order Confirmation #${order.orderNumber}`,
    html,
  });
};

// Send order status update email
const sendOrderStatusUpdate = async (order, user) => {
  const statusMessages = {
    processing: 'Your order is being processed.',
    shipped: 'Your order has been shipped! 🚚',
    delivered: 'Your order has been delivered! 🎉',
    cancelled: 'Your order has been cancelled.',
  };

  const html = `
    <h1>Order Status Update</h1>
    <p>Hello ${user.name || 'Customer'}!</p>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>New Status:</strong> ${order.status}</p>
    <p>${statusMessages[order.status] || ''}</p>
    <p>Thank you for shopping with us! 🍓</p>
  `;

  await transporter.sendMail({
    from: `"Fruite" <${process.env.SMTP_USER}>`,
    to: user.email || order.guestEmail,
    subject: `Order ${order.status} - #${order.orderNumber}`,
    html,
  });
};

module.exports = {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
};