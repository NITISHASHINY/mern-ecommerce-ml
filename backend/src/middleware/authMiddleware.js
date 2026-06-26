const { verifyAccessToken } = require('../utils/jwtHelper');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.'
      });
    }
    
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized.'
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

const checkAccountOwnership = (paramIdField = 'id') => {
  return (req, res, next) => {
    const targetUserId = req.params[paramIdField];
    
    if (req.user.role === 'admin' || req.user._id.toString() === targetUserId) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'You can only access your own account.'
      });
    }
  };
};

module.exports = {
  protect,
  restrictTo,
  checkAccountOwnership
};