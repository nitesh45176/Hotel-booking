import nodemailer from 'nodemailer';

// Create transporter with debugging enabled
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Enable debugging
  debug: true,
  logger: true,
  // Additional options for better reliability
  tls: {
    rejectUnauthorized: false // Only for testing, remove in production
  }
});

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP server is ready to take our messages');
  }
});

export default transporter;