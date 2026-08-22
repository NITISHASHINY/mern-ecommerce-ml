const User = require('../models/User');
const Product = require('../models/Product');

// Register as seller
const becomeSeller = async (req, res) => {
  try {
    const { businessName, businessAddress, gstNumber, bankDetails } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isSeller = true;
    user.sellerDetails = {
      businessName,
      businessAddress,
      gstNumber,
      bankDetails,
      joinedDate: new Date()
    };
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Successfully registered as seller',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get seller dashboard
const getSellerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ success: false, message: 'Not a seller' });
    }

    const products = await Product.find({ sellerId: req.userId });
    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, p) => sum + (p.soldCount || 0) * p.price, 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalRevenue,
        products: products.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  becomeSeller,
  getSellerDashboard
};