const { Resend } = require('resend');
require('dotenv').config();

class EmailService {
  constructor() {
    this.resend = null;
    this.enabled = false;
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@mitchstreats.com';
    this.toEmail = process.env.RESEND_TO_EMAIL || 'mitchs.treats@gmail.com';
  }

  async initialize() {
    // Check if Resend API key is provided
    if (!process.env.RESEND_API_KEY) {
      console.log('ℹ️  Email notifications disabled (no Resend API key provided)');
      this.enabled = false;
      return false;
    }

    try {
      // Initialize Resend
      this.resend = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Email service initialized successfully (Resend)');
      console.log(`   📧 Sending to: ${this.toEmail}`);
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

      // Send email using Resend
      const { data, error } = await this.resend.emails.send({
        from: `Mitch's Treats Orders <${this.fromEmail}>`,
        to: [this.toEmail],
        subject: `🍩 New Order from ${customerName}`,
        text: emailContent,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Order notification email sent:', data.id);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('⚠️  Error sending email:', error.message);
      console.log('ℹ️  Order was still recorded in Google Sheets');
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
