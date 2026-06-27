const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ================================
// PROTECT MIDDLEWARE
// Token verify karta hai
// ================================
const protect = async (req, res, next) => {
  try {
    let token;

    // Header se token lo
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User find karo (password ke bina)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// ================================
// ADMIN MIDDLEWARE
// Sirf admin access kar sakta hai
// ================================
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied - Admins only' });
  }
};

// ================================
// SELLER MIDDLEWARE
// Sirf seller ya admin access kar sakta hai
// ================================
const sellerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied - Sellers only' });
  }
};


const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user && !user.isBlocked) {
        req.user = user;
      }
    }
  } catch (error) {
    // Token invalid hai — koi baat nahi, req.user undefined rahega
    // Public access still allowed
  }
  next();
};

module.exports = { protect, adminOnly, sellerOnly, optionalAuth };
