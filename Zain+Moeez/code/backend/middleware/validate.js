// ================================
// VALIDATION MIDDLEWARE
// backend/middleware/validate.js
// ================================

// Register validation
const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (role && !['buyer', 'seller', 'admin'].includes(role)) {
    errors.push('Role must be buyer, seller, or admin');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  next();
};

// Login validation
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  next();
};

// Vehicle validation
const validateVehicle = (req, res, next) => {
  const { title, description, price, city, category } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    errors.push('Valid price is required');
  }

  if (!city || city.trim().length === 0) {
    errors.push('City is required');
  }

  if (!category || !['car', 'bike', 'truck'].includes(category)) {
    errors.push('Category must be car, bike, or truck');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  next();
};

// Message validation
const validateMessage = (req, res, next) => {
  const { message, vehicle } = req.body;
  const errors = [];

  if (!message || message.trim().length === 0) {
    errors.push('Message cannot be empty');
  }

  if (message && message.trim().length > 1000) {
    errors.push('Message cannot exceed 1000 characters');
  }

  if (!vehicle) {
    errors.push('Vehicle ID is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateVehicle, validateMessage };
