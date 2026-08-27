const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { sendFeedbackEmail } = require('../utils/mailer');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields required' });
    }
    // Save to MongoDB
    await Feedback.create({ name, email, subject, message, rating });
    // Send email to GastroCare Gmail
    await sendFeedbackEmail({ name, email, subject, message, rating });
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ message: 'Failed to send feedback. Please try again.' });
  }
});

module.exports = router;
