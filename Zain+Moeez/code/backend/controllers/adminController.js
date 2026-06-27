const User = require('../models/User');

// ================================
// GET ALL USERS (Admin only)
// GET /api/auth/admin/users
// ================================
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      users,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// BLOCK / UNBLOCK USER (Admin only)
// PUT /api/auth/admin/users/:id/block
// ================================
const toggleBlockUser = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot block another admin' });

    user.isBlocked = !!isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: { id: user._id, name: user.name, isBlocked: user.isBlocked },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// DELETE USER (Admin only)
// DELETE /api/auth/admin/users/:id
// ================================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete an admin account' });

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsers, toggleBlockUser, deleteUser };
