import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { name, email, company, message } = req.body

  // Validate input
  if (!name || !email || !company || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    // Email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@aiburn.dev',
      to: process.env.CONTACT_EMAIL || 'tryaiburn@howstud.io',
      subject: `New Advertising Inquiry from ${name}`,
      html: `
        <h2>New Advertising Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    })

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@aiburn.dev',
      to: email,
      subject: 'We received your advertising inquiry',
      html: `
        <h2>Thank you for your inquiry!</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>We've received your advertising inquiry and will review it shortly.</p>
        <p>Our team will get back to you within 24 hours with more information about advertising opportunities on AIBurn.</p>
        <p>In the meantime, feel free to check out our <a href="https://aiburn.dev/advertise">advertising page</a> for more details.</p>
        <p>Best regards,<br>The AIBurn Team</p>
      `,
    })

    return res.status(200).json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email sending error:', error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
