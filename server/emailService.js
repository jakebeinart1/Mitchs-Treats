const { Resend } = require('resend');
const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.resend = null;
    this.gmailTransporter = null;
    this.enabled = false;
    this.gmailEnabled = false;
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@mitchstreats.com';
    this.toEmail = process.env.RESEND_TO_EMAIL || 'mitchs.treats@gmail.com';
    this.gmailUser = 'mitchs.treats@gmail.com';
  }

  async initialize() {
    // Initialize Resend for owner notifications
    if (!process.env.RESEND_API_KEY) {
      console.log('ℹ️  Email notifications disabled (no Resend API key provided)');
      this.enabled = false;
    } else {
      try {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        console.log('✅ Email service initialized successfully (Resend)');
        console.log(`   📧 Sending to: ${this.toEmail}`);
        this.enabled = true;
      } catch (error) {
        console.error('⚠️  Email service initialization failed:', error.message);
        this.enabled = false;
      }
    }

    // Initialize Gmail for customer confirmations
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.log('ℹ️  Customer confirmation emails disabled (no GMAIL_APP_PASSWORD provided)');
      this.gmailEnabled = false;
    } else {
      try {
        this.gmailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: this.gmailUser,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });
        console.log('✅ Gmail transporter initialized for customer confirmations');
        this.gmailEnabled = true;
      } catch (error) {
        console.error('⚠️  Gmail initialization failed:', error.message);
        this.gmailEnabled = false;
      }
    }

    return this.enabled;
  }

  // Get theme colors based on holiday
  getThemeColors(holiday) {
    switch (holiday) {
      case 'Purim':
        return { primary: '#6B46C1', accent: '#F6AD55', emoji: '🎭' };
      case 'Valentines':
        return { primary: '#C53030', accent: '#F687B3', emoji: '💝' };
      case 'Hanukkah':
        return { primary: '#0047AB', accent: '#FFD700', emoji: '🕎' };
      case 'Challah & Babka':
        return { primary: '#b07d2a', accent: '#e8c96e', emoji: '🍞' };
      case 'Passover':
        return { primary: '#1A4B8C', accent: '#C8A951', emoji: '✡️' };
      default:
        return { primary: '#2D3748', accent: '#C9A76B', emoji: '🍩' };
    }
  }

  async sendOrderNotification(orderData) {
    // Skip if email is not enabled
    if (!this.enabled) {
      console.log('ℹ️  Email notification skipped (email disabled)');
      return { success: false, skipped: true };
    }

    try {
      // Get theme colors
      const holiday = orderData.holiday || 'General';
      const theme = this.getThemeColors(holiday);

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
        if (item.cookieSelection && item.cookieSelection.length > 0) {
          itemsList += `\n  Cookies: ${item.cookieSelection.join(', ')}`;
        }
        if (item.fillingSelection && item.fillingSelection.length > 0) {
          itemsList += `\n  Fillings: ${item.fillingSelection.join(', ')}`;
        }
        if (item.designDescription) {
          itemsList += `\n  Design: ${item.designDescription}`;
        }
        itemsList += ` ($${item.price.toFixed(2)} each = $${itemTotal.toFixed(2)})\n`;
      });

      // Create email content
      const customerName = orderData.customer.name || 'Anonymous Customer';
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        dateStyle: 'full',
        timeStyle: 'short'
      });

      // Plain text version
      const textContent = `
New ${holiday} Order from ${customerName}

Order Details:
--------------
Holiday: ${holiday}
Customer Name: ${orderData.customer.name || 'Not provided'}
Email: ${orderData.customer.email || 'Not provided'}
Phone: ${orderData.customer.phone || 'Not provided'}
Pickup Date: ${orderData.customer.pickupDate || 'Not provided'}
${orderData.customer.pickupTime ? `Pickup Time: ${orderData.customer.pickupTime}` : ''}

Items Ordered:
${itemsList}

Estimated Total: $${totalAmount.toFixed(2)}

${orderData.specialInstructions ? `Special Instructions:\n${orderData.specialInstructions}\n\n` : ''}Order Timestamp: ${timestamp}

Total Items: ${orderData.totalItems}
      `.trim();

      // HTML version - professional design with holiday theme
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1d1d1f; margin: 0; padding: 0; background-color: #f5f5f7; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}cc 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header .subtitle { color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; }
    .header .holiday-badge { display: inline-block; background: ${theme.accent}; color: #1d1d1f; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 12px; }
    .content { padding: 40px 30px; }
    .section { margin-bottom: 30px; }
    .section-title { color: ${theme.primary}; font-size: 18px; font-weight: 700; margin: 0 0 16px 0; border-bottom: 2px solid ${theme.accent}; padding-bottom: 8px; }
    .info-grid { display: table; width: 100%; }
    .info-row { display: table-row; }
    .info-label { display: table-cell; padding: 8px 16px 8px 0; font-weight: 600; color: #666; width: 140px; }
    .info-value { display: table-cell; padding: 8px 0; color: #1d1d1f; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .items-table th { background-color: #f5f5f7; padding: 12px; text-align: left; font-weight: 600; color: #1d1d1f; border-bottom: 2px solid #e5e5e7; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e5e7; vertical-align: top; }
    .item-name { font-weight: 600; color: #1d1d1f; }
    .item-details { color: #666; font-size: 14px; margin-top: 4px; }
    .item-price { text-align: right; font-weight: 600; color: ${theme.primary}; }
    .total-row { background-color: #fafaf9; font-weight: 700; }
    .total-row td { border-top: 2px solid ${theme.accent}; padding: 16px 12px; font-size: 18px; color: ${theme.primary}; }
    .special-instructions { background-color: #fafaf9; border-left: 4px solid ${theme.accent}; padding: 16px; border-radius: 4px; margin-top: 12px; }
    .special-instructions-title { font-weight: 600; color: ${theme.primary}; margin: 0 0 8px 0; }
    .special-instructions-text { margin: 0; color: #1d1d1f; white-space: pre-wrap; }
    .footer { background-color: #f5f5f7; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    .timestamp { color: #999; font-size: 13px; }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px 20px; }
      .header { padding: 30px 20px; }
      .info-label { display: block; padding: 8px 0 4px 0; }
      .info-value { display: block; padding: 0 0 12px 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${theme.emoji} New Order Received!</h1>
      <p class="subtitle">Mitch's Treats Order Notification</p>
      <span class="holiday-badge">${holiday}</span>
    </div>

    <div class="content">
      <div class="section">
        <h2 class="section-title">Customer Information</h2>
        <div class="info-grid">
          <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${orderData.customer.name || 'Not provided'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value"><a href="mailto:${orderData.customer.email}" style="color: ${theme.primary}; text-decoration: none;">${orderData.customer.email || 'Not provided'}</a></div>
          </div>
          <div class="info-row">
            <div class="info-label">Phone:</div>
            <div class="info-value"><a href="tel:${orderData.customer.phone}" style="color: ${theme.primary}; text-decoration: none;">${orderData.customer.phone || 'Not provided'}</a></div>
          </div>
          <div class="info-row">
            <div class="info-label">Pickup Date:</div>
            <div class="info-value"><strong>${orderData.customer.pickupDate || 'Not provided'}</strong></div>
          </div>
          ${orderData.customer.pickupTime ? `
          <div class="info-row">
            <div class="info-label">Pickup Time:</div>
            <div class="info-value"><strong>${orderData.customer.pickupTime}</strong></div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Order Items</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map(item => {
              const itemTotal = item.quantity * item.price;
              let details = '';
              if (item.flavor) {
                details += `<div class="item-details">Flavor: ${item.flavor}</div>`;
              }
              if (item.cookieSelection && item.cookieSelection.length > 0) {
                details += `<div class="item-details">Cookies: ${item.cookieSelection.join(', ')}</div>`;
              }
              if (item.fillingSelection && item.fillingSelection.length > 0) {
                details += `<div class="item-details">Fillings: ${item.fillingSelection.join(', ')}</div>`;
              }
              if (item.designDescription) {
                details += `<div class="item-details">Design: ${item.designDescription}</div>`;
              }
              return `
                <tr>
                  <td>
                    <div class="item-name">${item.productName}</div>
                    ${details}
                  </td>
                  <td style="text-align: right;">${item.quantity}</td>
                  <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                  <td class="item-price">$${itemTotal.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
            <tr class="total-row">
              <td colspan="3">Estimated Total</td>
              <td style="text-align: right;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${orderData.specialInstructions ? `
      <div class="section">
        <h2 class="section-title">Special Instructions</h2>
        <div class="special-instructions">
          <p class="special-instructions-text">${orderData.specialInstructions}</p>
        </div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p class="timestamp">Order received: ${timestamp}</p>
      <p>Total Items: ${orderData.totalItems}</p>
    </div>
  </div>
</body>
</html>
      `.trim();

      // Send email using Resend
      const { data, error } = await this.resend.emails.send({
        from: `Mitch's Treats Orders <${this.fromEmail}>`,
        to: [this.toEmail],
        subject: `${theme.emoji} New ${holiday} Order from ${customerName}`,
        text: textContent,
        html: htmlContent,
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

  async sendCustomerConfirmation(orderData) {
    if (!this.gmailEnabled) return { success: false, skipped: true };

    const customerEmail = orderData.customer && orderData.customer.email;
    if (!customerEmail) {
      console.log('ℹ️  Customer confirmation skipped (no email provided)');
      return { success: false, skipped: true };
    }

    try {
      const holiday = orderData.holiday || 'General';
      const theme = this.getThemeColors(holiday);
      const customerName = orderData.customer.name || 'Valued Customer';

      let totalAmount = 0;
      const itemRows = orderData.items.map(item => {
        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;

        let details = '';
        if (item.flavor) details += `<div class="item-details">Flavor: ${item.flavor}</div>`;
        if (item.cookieSelection && item.cookieSelection.length > 0)
          details += `<div class="item-details">Cookies: ${item.cookieSelection.join(', ')}</div>`;
        if (item.fillingSelection && item.fillingSelection.length > 0)
          details += `<div class="item-details">Fillings: ${item.fillingSelection.join(', ')}</div>`;
        if (item.designDescription)
          details += `<div class="item-details">Design: ${item.designDescription}</div>`;

        return `
          <tr>
            <td>
              <div class="item-name">${item.productName}</div>
              ${details}
            </td>
            <td style="text-align: right;">${item.quantity}</td>
            <td style="text-align: right;">$${item.price.toFixed(2)}</td>
            <td class="item-price">$${itemTotal.toFixed(2)}</td>
          </tr>`;
      }).join('');

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1d1d1f; margin: 0; padding: 0; background-color: #f5f5f7; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}cc 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header .subtitle { color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; }
    .header .holiday-badge { display: inline-block; background: ${theme.accent}; color: #1d1d1f; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 12px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; margin-bottom: 24px; color: #1d1d1f; }
    .section { margin-bottom: 30px; }
    .section-title { color: ${theme.primary}; font-size: 18px; font-weight: 700; margin: 0 0 16px 0; border-bottom: 2px solid ${theme.accent}; padding-bottom: 8px; }
    .info-grid { display: table; width: 100%; }
    .info-row { display: table-row; }
    .info-label { display: table-cell; padding: 8px 16px 8px 0; font-weight: 600; color: #666; width: 140px; }
    .info-value { display: table-cell; padding: 8px 0; color: #1d1d1f; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .items-table th { background-color: #f5f5f7; padding: 12px; text-align: left; font-weight: 600; color: #1d1d1f; border-bottom: 2px solid #e5e5e7; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e5e7; vertical-align: top; }
    .item-name { font-weight: 600; color: #1d1d1f; }
    .item-details { color: #666; font-size: 14px; margin-top: 4px; }
    .item-price { text-align: right; font-weight: 600; color: ${theme.primary}; }
    .total-row td { border-top: 2px solid ${theme.accent}; padding: 16px 12px; font-size: 18px; font-weight: 700; color: ${theme.primary}; background-color: #fafaf9; }
    .special-instructions { background-color: #fafaf9; border-left: 4px solid ${theme.accent}; padding: 16px; border-radius: 4px; margin-top: 12px; }
    .special-instructions-text { margin: 0; color: #1d1d1f; white-space: pre-wrap; }
    .contact-box { background-color: #f5f5f7; border-radius: 8px; padding: 20px; text-align: center; margin-top: 30px; }
    .contact-box p { margin: 4px 0; color: #444; font-size: 15px; }
    .contact-box a { color: ${theme.primary}; text-decoration: none; font-weight: 600; }
    .footer { background-color: #f5f5f7; padding: 24px 30px; text-align: center; color: #999; font-size: 13px; border-top: 1px solid #e5e5e7; }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px 20px; }
      .header { padding: 30px 20px; }
      .info-label { display: block; padding: 8px 0 4px 0; }
      .info-value { display: block; padding: 0 0 12px 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${theme.emoji} Order Confirmed!</h1>
      <p class="subtitle">Mitch's Treats</p>
      <span class="holiday-badge">${holiday}</span>
    </div>

    <div class="content">
      <p class="greeting">Hi ${customerName},<br>Thank you so much for your order! We've received it and can't wait to bake something delicious for you. Here's a summary of what you ordered.</p>

      <div class="section">
        <h2 class="section-title">Pickup Details</h2>
        <div class="info-grid">
          <div class="info-row">
            <div class="info-label">Pickup Date:</div>
            <div class="info-value"><strong>${orderData.customer.pickupDate || 'Not provided'}</strong></div>
          </div>
          ${orderData.customer.pickupTime ? `
          <div class="info-row">
            <div class="info-label">Pickup Time:</div>
            <div class="info-value"><strong>${orderData.customer.pickupTime}</strong></div>
          </div>` : ''}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Your Order</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
            <tr class="total-row">
              <td colspan="3">Estimated Total</td>
              <td style="text-align: right;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${orderData.specialInstructions ? `
      <div class="section">
        <h2 class="section-title">Special Instructions</h2>
        <div class="special-instructions">
          <p class="special-instructions-text">${orderData.specialInstructions}</p>
        </div>
      </div>` : ''}

      <div class="contact-box">
        <p>Questions about your order? Reach out anytime:</p>
        <p><a href="tel:2812363047">📞 281.236.3047</a></p>
        <p><a href="mailto:mitchs.treats@gmail.com">✉️ mitchs.treats@gmail.com</a></p>
      </div>
    </div>

    <div class="footer">
      <p>Mitch's Treats &mdash; Handmade with love</p>
    </div>
  </div>
</body>
</html>`.trim();

      const textContent = `
Hi ${customerName},

Thank you for your order from Mitch's Treats! Here's your confirmation:

Pickup Date: ${orderData.customer.pickupDate || 'Not provided'}
${orderData.customer.pickupTime ? `Pickup Time: ${orderData.customer.pickupTime}\n` : ''}
Your Order:
${orderData.items.map(item => {
  const itemTotal = item.quantity * item.price;
  let line = `- ${item.productName}: qty ${item.quantity} @ $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}`;
  if (item.flavor) line += ` (${item.flavor})`;
  return line;
}).join('\n')}

Estimated Total: $${totalAmount.toFixed(2)}
${orderData.specialInstructions ? `\nSpecial Instructions: ${orderData.specialInstructions}\n` : ''}
Questions? Call or text 281.236.3047 or email mitchs.treats@gmail.com

Mitch's Treats — Handmade with love
      `.trim();

      const info = await this.gmailTransporter.sendMail({
        from: `Mitch's Treats <${this.gmailUser}>`,
        to: customerEmail,
        subject: `${theme.emoji} Your Mitch's Treats Order is Confirmed!`,
        text: textContent,
        html: htmlContent,
      });

      console.log('✅ Customer confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('⚠️  Error sending customer confirmation:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
