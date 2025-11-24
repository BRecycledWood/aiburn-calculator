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

  const { timestamp, currentCost, selectedModel, savings } = req.body

  // Validate input
  if (!timestamp || currentCost === undefined || !selectedModel) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Send notification email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@aiburn.dev',
      to: process.env.ADMIN_EMAIL || 'tryaiburn@howstud.io',
      subject: 'Report Downloaded - AIBurn Usage Notification',
      html: `
        <h2>Report Download Notification</h2>
        <p>A user has downloaded an AIBurn analysis report.</p>
        <ul>
          <li><strong>Time:</strong> ${escapeHtml(new Date(timestamp).toLocaleString())}</li>
          <li><strong>Current Model:</strong> ${escapeHtml(selectedModel)}</li>
          <li><strong>Current Cost:</strong> $${escapeHtml(String(currentCost))}/month</li>
          <li><strong>Potential Savings:</strong> $${escapeHtml(String(savings))}</li>
        </ul>
        <p>This helps us track usage and engagement with AIBurn.</p>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Download notification error:', error)
    // Don't fail the frontend request if email fails
    return res.status(200).json({ success: true })
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
