const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getThread,
  replyMessage,
  getUnreadCount,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// ================================
// ALL ROUTES ARE PROTECTED
// ================================

// GET /api/messages/unread-count
router.get('/unread-count', protect, getUnreadCount);

// GET /api/messages/conversations
// Returns grouped conversation threads for current user
router.get('/conversations', protect, getConversations);

// GET /api/messages/thread/:vehicleId/:userId
// Returns full message thread between current user and userId about a vehicle
router.get('/thread/:vehicleId/:userId', protect, getThread);

// POST /api/messages
// Send initial inquiry (buyer → seller)
router.post('/', protect, sendMessage);

// POST /api/messages/reply
// Reply in a thread (seller → buyer or buyer → seller)
router.post('/reply', protect, replyMessage);

module.exports = router;
