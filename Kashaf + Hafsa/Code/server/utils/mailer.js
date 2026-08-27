const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendFeedbackEmail = async ({ name, email, subject, message, rating }) => {
  const stars = '⭐'.repeat(rating || 0);
  await transporter.sendMail({
    from: `"GastroCare Website" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `New Feedback — ${subject}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #d0e8e0;border-radius:12px;overflow:hidden;">
        <div style="background:#0a4f3c;padding:24px;text-align:center;"><h2 style="color:#fff;margin:0;">🏥 GastroCare — New Feedback</h2></div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;width:120px;"><b>Name</b></td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;"><b>Email</b></td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;"><b>Subject</b></td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${subject}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;"><b>Rating</b></td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${stars} (${rating}/5)</td></tr>
            <tr><td style="padding:10px 0;color:#666;vertical-align:top;"><b>Message</b></td><td style="padding:10px 0;">${message}</td></tr>
          </table>
        </div>
        <div style="background:#f5f7f5;padding:16px;text-align:center;"><p style="color:#999;font-size:12px;margin:0;">GastroCare AI Health Assistant © 2024</p></div>
      </div>`
  });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  await transporter.sendMail({
    from: `"GastroCare AI" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'GastroCare — Password Reset Request',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #d0e8e0;border-radius:12px;overflow:hidden;">
        <div style="background:#0a4f3c;padding:24px;text-align:center;"><h2 style="color:#fff;margin:0;">🏥 GastroCare Password Reset</h2></div>
        <div style="padding:32px;text-align:center;">
          <p style="color:#3d5a52;font-size:16px;">You requested a password reset for your GastroCare account.</p>
          <p style="color:#3d5a52;">Click the button below. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:14px 36px;background:#0a4f3c;color:#fff;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;">Reset My Password</a>
          <p style="color:#999;font-size:13px;">If you didn't request this, ignore this email.</p>
        </div>
        <div style="background:#f5f7f5;padding:16px;text-align:center;"><p style="color:#999;font-size:12px;margin:0;">GastroCare AI Health Assistant © 2024</p></div>
      </div>`
  });
};

module.exports = { sendFeedbackEmail, sendPasswordResetEmail };
