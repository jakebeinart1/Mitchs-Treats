const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const emailService = require('./emailService');
const sheetsService = require('./sheetsService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/purim', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'purim.html'));
});

app.get('/valentines', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'valentines.html'));
});

app.get('/passover', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'passover.html'));
});

// Legacy order route - redirect to home
app.get('/order', (req, res) => {
  res.redirect('/');
});

// Archive routes
app.get('/archive/hanukkah', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'archive', 'hanukkah', 'index.html'));
});

app.get('/archive/hanukkah/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'archive', 'hanukkah', 'index.html'));
});

app.get('/archive/hanukkah/order.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'archive', 'hanukkah', 'order.html'));
});

// Order submission endpoint
app.post('/api/submit-order', async (req, res) => {
  try {
    const orderData = req.body;

    console.log(`📝 Received new ${orderData.holiday || 'General'} order from:`, orderData.customer.name);

    // Validate order data
    if (!orderData.customer || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order data',
      });
    }

    // Send email notification
    try {
      await emailService.sendOrderNotification(orderData);
    } catch (emailError) {
      console.error('Email error:', emailError.message);
      // Continue even if email fails
    }

    // Add to Google Sheets
    try {
      await sheetsService.addOrder(orderData);
    } catch (sheetsError) {
      console.error('Sheets error:', sheetsError.message);
      // Continue even if sheets fails
    }

    res.json({
      success: true,
      message: 'Order received successfully!',
    });
  } catch (error) {
    console.error('❌ Error processing order:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing order. Please try again or call 281.236.3047',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize services and start server
async function startServer() {
  try {
    console.log('🚀 Starting Mitch\'s Treats server...\n');

    // Initialize email service
    try {
      await emailService.initialize();
    } catch (error) {
      console.warn('⚠️  Email service initialization failed. Orders will still be recorded.');
    }

    // Initialize Google Sheets service
    try {
      await sheetsService.initialize();
    } catch (error) {
      console.warn('⚠️  Google Sheets service initialization failed. Orders will still be emailed.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log('\n✨ Server is running!\n');
      console.log(`   🌐 Home page: http://localhost:${PORT}`);
      console.log(`   🎭 Purim: http://localhost:${PORT}/purim`);
      console.log(`   💝 Valentines: http://localhost:${PORT}/valentines`);
      console.log(`   🍷 Passover: http://localhost:${PORT}/passover`);
      console.log(`   📁 Archive: http://localhost:${PORT}/archive/hanukkah/`);
      console.log(`\n   Press Ctrl+C to stop the server\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
