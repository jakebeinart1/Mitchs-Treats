const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.enabled = false;
  }

  async initialize() {
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('ℹ️  Email notifications disabled (no credentials provided)');
      this.enabled = false;
      return false;
    }

    try {
      // Create transporter using Gmail SMTP
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
      this.enabled = true;
      return true;
    } catch (error) {
      console.error('⚠️  Email service initialization failed:', error.message);
      console.log('ℹ️  Orders will still work, but email notifications are disabled');
      this.enabled = false;
      return false;
    }
  }

  async sendOrderNotification(orderData) {
    // Skip if email is not enabled
    if (!this.enabled) {
      console.log('ℹ️  Email notification skipped (email disabled)');
      return { success: false, skipped: true };
    }

    try {
      // Build items list
      let itemsList = '';
      let totalAmount = 0;

      orderData.items.forEach(item => {
        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;

        itemsList += `- ${item.productName}: Quantity ${item.quantity}`;
        if (item.flavor) {
          itemsList += `, Flavor: ${item.flavor}`;
        }
        itemsList += ` ($${item.price.toFixed(2)} each = $${itemTotal.toFixed(2)})\n`;
      });

      // Create email content
      const customerName = orderData.customer.name || 'Anonymous Customer';
      const emailContent = `
New Order from ${customerName}

Order Details:
--------------
Customer Name: ${orderData.customer.name || 'Not provided'}
Email: ${orderData.customer.email || 'Not provided'}
Phone: ${orderData.customer.phone || 'Not provided'}
Pickup Date: ${orderData.customer.pickupDate || 'Not provided'}

Items Ordered:
${itemsList}

Estimated Total: $${totalAmount.toFixed(2)}

${orderData.specialInstructions ? `Special Instructions:\n${orderData.specialInstructions}\n\n` : ''}Order Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}

Total Items: ${orderData.totalItems}
      `.trim();

      // Send email
      const info = await this.transporter.sendMail({
        from: `"Mitch's Treats Orders" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Order from ${customerName}`,
        text: emailContent,
      });

      console.log('✅ Order notification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('⚠️  Error sending email:', error.message);
      console.log('ℹ️  Order was still recorded in Google Sheets');
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
