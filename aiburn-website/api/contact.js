import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message } = req.body;

  // Validate inputs
  if (!name || !email || !company || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADVERTISE_EMAIL,
      subject: `New Advertiser Inquiry from ${company}`,
      html: `
        <h2>New Advertiser Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'We received your inquiry - AIBurn',
      html: `
        <h2>Thank you for your interest, ${name}!</h2>
        <p>We've received your inquiry and will get back to you within 24 hours.</p>
        <p>In the meantime, you can reach us directly at <a href="mailto:${process.env.ADVERTISE_EMAIL}">${process.env.ADVERTISE_EMAIL}</a></p>
        <p>Best regards,<br>The AIBurn Team</p>
      `,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again or email us directly.' });
  }
}
