/**
 * Contact Form Handler for Advertiser Inquiries
 * 
 * Sends email via Zoho Mail SMTP
 * Endpoint: POST /api/contact
 */

const nodemailer = require('nodemailer');

// CORS helper
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

module.exports = async (req, res) => {
  // Set CORS headers first
  setCORSHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message } = req.body || {};

  // Validate required fields
  if (!name || !email || !company || !message) {
    console.error('Missing required fields:', { name, email, company, message });
    return res.status(400).json({ error: 'All fields (name, email, company, message) are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Missing SMTP configuration');
      throw new Error('Email service not configured');
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test connection
    await transporter.verify();
    console.log('✓ SMTP connection verified');

    // Email to admin
    console.log(`Sending admin notification to ${process.env.ADVERTISE_EMAIL}`);
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADVERTISE_EMAIL,
      subject: `New Advertiser Inquiry from ${company}`,
      html: `
        <h2>New Advertiser Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <hr/>
        <p><small>Sent from AIBurn Contact Form</small></p>
      `,
      replyTo: email,
    });
    console.log('✓ Admin email sent');

    // Confirmation email to user
    console.log(`Sending confirmation to ${email}`);
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'We received your inquiry - AIBurn',
      html: `
        <h2>Thank you for your interest, ${escapeHtml(name)}!</h2>
        <p>We've received your inquiry and will get back to you within 24 hours.</p>
        <p>In the meantime, you can reach us directly at <a href="mailto:${process.env.ADVERTISE_EMAIL}">${process.env.ADVERTISE_EMAIL}</a></p>
        <p>Best regards,<br>The AIBurn Team</p>
      `,
    });
    console.log('✓ Confirmation email sent');

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Contact form error:', error.message);
    console.error('Error details:', error);

    // Return generic error to client
    return res.status(500).json({ 
      error: 'Failed to send email. Please try emailing directly at aiburnads@howstud.io',
      // Remove in production - only for debugging
      ...(process.env.NODE_ENV === 'development' && { debug: error.message })
    });
  }
};

// Simple HTML escape
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
