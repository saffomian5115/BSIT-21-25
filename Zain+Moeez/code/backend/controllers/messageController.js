const Message = require('../models/Message');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// ================================
// SEND MESSAGE / INQUIRY
// POST /api/messages
// Protected — Buyer sends to Seller
// ================================
const sendMessage = async (req, res) => {
  try {
    const { vehicle: vehicleId, message } = req.body;

    if (!vehicleId || !message?.trim()) {
      return res.status(400).json({ message: 'Vehicle ID and message are required' });
    }

    // Vehicle dhundo
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Seller khud ko message nahi kar sakta
    if (vehicle.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot message yourself' });
    }

    const msg = await Message.create({
      sender: req.user._id,
      receiver: vehicle.seller,
      vehicle: vehicleId,
      message: message.trim(),
    });

    // Populate karke return karo
    const populated = await Message.findById(msg._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('vehicle', 'title price city images');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// GET MY CONVERSATIONS (for Seller)
// GET /api/messages/conversations
// Returns unique conversation threads grouped by vehicle+buyer
// ================================
const getConversations = async (req, res) => {
  try {
    // All messages jahan main receiver hoon (seller) ya sender hoon (buyer)
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'name email city')
      .populate('receiver', 'name email city')
      .populate('vehicle', 'title price city images category')
      .sort({ createdAt: -1 });

    // Group by vehicle + other party
    const convMap = new Map();

    messages.forEach(msg => {
      const isSeller = msg.receiver._id.toString() === req.user._id.toString();
      const otherParty = isSeller ? msg.sender : msg.receiver;
      const key = `${msg.vehicle._id}_${otherParty._id}`;

      if (!convMap.has(key)) {
        convMap.set(key, {
          key,
          vehicle: msg.vehicle,
          otherParty,
          isSeller,
          lastMessage: msg.message,
          lastTime: msg.createdAt,
          unreadCount: (!msg.isRead && msg.receiver._id.toString() === req.user._id.toString()) ? 1 : 0,
          messages: [msg],
        });
      } else {
        const conv = convMap.get(key);
        conv.messages.push(msg);
        if (!msg.isRead && msg.receiver._id.toString() === req.user._id.toString()) {
          conv.unreadCount++;
        }
      }
    });

    const conversations = Array.from(convMap.values()).map(c => ({
      key: c.key,
      vehicle: c.vehicle,
      otherParty: c.otherParty,
      isSeller: c.isSeller,
      lastMessage: c.lastMessage,
      lastTime: c.lastTime,
      unreadCount: c.unreadCount,
    }));

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// GET MESSAGE THREAD
// GET /api/messages/thread/:vehicleId/:userId
// Returns all messages between current user and userId about vehicleId
// ================================
const getThread = async (req, res) => {
  try {
    const { vehicleId, userId } = req.params;

    const messages = await Message.find({
      vehicle: vehicleId,
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('vehicle', 'title price city images')
      .sort({ createdAt: 1 });

    // Mark as read — messages jo mujhe bheje gaye hain unhe read mark karo
    await Message.updateMany(
      { vehicle: vehicleId, sender: userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// REPLY TO MESSAGE
// POST /api/messages/reply
// Seller replies to buyer's inquiry
// ================================
const replyMessage = async (req, res) => {
  try {
    const { vehicleId, receiverId, message } = req.body;

    if (!vehicleId || !receiverId || !message?.trim()) {
      return res.status(400).json({ message: 'vehicleId, receiverId and message are required' });
    }

    // Check vehicle exists and belongs to this seller (or buyer can also reply)
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const msg = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      vehicle: vehicleId,
      message: message.trim(),
    });

    const populated = await Message.findById(msg._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('vehicle', 'title price city');

    res.status(201).json({
      message: 'Reply sent successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// GET UNREAD COUNT
// GET /api/messages/unread-count
// ================================
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getThread,
  replyMessage,
  getUnreadCount,
};
