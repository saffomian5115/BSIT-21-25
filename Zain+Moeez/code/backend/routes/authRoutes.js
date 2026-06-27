const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { getAllUsers, toggleBlockUser, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validate');

// POST /api/auth/register  — validation middleware add ki
router.post('/register', validateRegister, register);

// POST /api/auth/login  — validation middleware add ki
router.post('/login', validateLogin, login);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

// ================================
// ADMIN — User Management
// ================================

// GET /api/auth/admin/users
router.get('/admin/users', protect, adminOnly, getAllUsers);

// PUT /api/auth/admin/users/:id/block
router.put('/admin/users/:id/block', protect, adminOnly, toggleBlockUser);

// DELETE /api/auth/admin/users/:id
router.delete('/admin/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
