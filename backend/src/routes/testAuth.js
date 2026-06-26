const express = require('express');
const router = express.Router();

// Direct implementation without any middleware
router.post('/register', async (req, res) => {
  try {
    const User = require('../models/User');
    const { generateTokens } = require('../utils/jwtHelper');
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    const tokens = generateTokens(user._id, user.role);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, tokens }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;