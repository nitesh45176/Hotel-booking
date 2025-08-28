import nodemailer from 'nodemailer';

// Add debugging to check if env vars are loaded
console.log("🔧 SMTP Configuration Check:");
console.log("SMTP_USER:", process.env.SMTP_USER ? "✅ Loaded" : "❌ Missing");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Loaded" : "❌ Missing");
console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL ? "✅ Loaded" : "❌ Missing");

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
    ciphers: 'SSLv3',
    rejectUnauthorized: false // Only for testing, remove in production
  },
  // Add connection timeout
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,   // 30 seconds
  socketTimeout: 60000,     // 60 seconds
});

// Test the connection with better error handling
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    // Additional debugging
    if (error.code === 'EAUTH') {
      console.error('🔍 Authentication failed. Check your credentials:');
      console.error('SMTP_USER:', process.env.SMTP_USER);
      console.error('SMTP_PASS length:', process.env.SMTP_PASS?.length || 0);
    }
  } else {
    console.log('✅ SMTP server is ready to take our messages');
  }
});

export default transporter;