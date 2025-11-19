const { google } = require('googleapis');
require('dotenv').config();

class SheetsService {
  constructor() {
    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.auth = null;
    this.sheets = null;
  }

  async initialize() {
    try {
      // Create auth client from service account
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });

      // Initialize sheet headers if needed
      await this.ensureHeaders();

      console.log('✅ Google Sheets service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Error initializing Google Sheets:', error.message);
      throw error;
    }
  }

  async ensureHeaders() {
    try {
      // Check if headers exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Sheet1!A1:Z1',
      });

      // If no headers, create them
      if (!response.data.values || response.data.values.length === 0) {
        const headers = [
          'Order ID',
          'Timestamp',
          'Customer Name',
          'Email',
          'Phone',
          'Pickup Date',
          'Sofganiyot - Strawberry Jam',
          'Sofganiyot - Nutella',
          'Sofganiyot - Dulce de Leche',
          'Sofganiyot - Vanilla Custard',
          'Sofganiyot - Biscoff',
          'Sofganiyot - Marshmallows',
          'Cake Pops',
          'Chocolate Covered Pretzels',
          'Decorated Cookies',
          'Plain Hanukkah Cookies',
          'Cookie Decorating Kits',
          'Special Instructions',
          'Total Items',
          'Total Amount'
        ];

        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.sheetId,
          range: 'Sheet1!A1',
          valueInputOption: 'RAW',
          resource: {
            values: [headers],
          },
        });

        // Apply formatting
        await this.formatSheet(20); // 20 columns total

        console.log('✅ Sheet headers created and formatted');
      }
    } catch (error) {
      console.error('Error ensuring headers:', error.message);
    }
  }

  async formatSheet(numColumns) {
    try {
      const requests = [
        // Format header row - bold, background color, centered, borders
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: numColumns,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.0, green: 0.28, blue: 0.67 }, // Blue
                textFormat: {
                  foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, // White
                  fontSize: 11,
                  bold: true,
                },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE',
                wrapStrategy: 'WRAP',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
          },
        },
        // Auto-resize all columns
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: numColumns,
            },
          },
        },
        // Add borders to all cells
        {
          updateBorders: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1000, // Apply to first 1000 rows
              startColumnIndex: 0,
              endColumnIndex: numColumns,
            },
            top: {
              style: 'SOLID',
              width: 1,
              color: { red: 0.8, green: 0.8, blue: 0.8 },
            },
            bottom: {
              style: 'SOLID',
              width: 1,
              color: { red: 0.8, green: 0.8, blue: 0.8 },
            },
            left: {
              style: 'SOLID',
              width: 1,
              color: { red: 0.8, green: 0.8, blue: 0.8 },
            },
            right: {
              style: 'SOLID',
              width: 1,
              color: { red: 0.8, green: 0.8, blue: 0.8 },
            },
            innerHorizontal: {
              style: 'SOLID',
              width: 1,
              color: { red: 0.8, green: 0.8, blue: 0.8 },
            },
            innerVertical: {
              style: 'SOLID',
              width: 1,
              color: { red: 0.8, green: 0.8, blue: 0.8 },
            },
          },
        },
        // Freeze header row
        {
          updateSheetProperties: {
            properties: {
              sheetId: 0,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        // Set row height for header
        {
          updateDimensionProperties: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: 0,
              endIndex: 1,
            },
            properties: {
              pixelSize: 40,
            },
            fields: 'pixelSize',
          },
        },
      ];

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.sheetId,
        resource: { requests },
      });

      console.log('✅ Sheet formatting applied');
    } catch (error) {
      console.error('Error formatting sheet:', error.message);
    }
  }

  async addOrder(orderData) {
    try {
      const timestamp = new Date().toISOString();
      const orderId = `ORDER-${Date.now()}`;

      // Create row data matching the headers
      const rowData = [
        orderId,
        timestamp,
        orderData.customer.name || '',
        orderData.customer.email || '',
        orderData.customer.phone || '',
        orderData.customer.pickupDate || '',
      ];

      // Initialize all product flavor columns
      const productColumns = {
        'sofganiyot-strawberry': 0,
        'sofganiyot-nutella': 0,
        'sofganiyot-dulce': 0,
        'sofganiyot-vanilla': 0,
        'sofganiyot-biscoff': 0,
        'sofganiyot-marshmallows': 0,
        'cake-pops': 0,
        'pretzels': 0,
        'decorated-cookies': 0,
        'plain-cookies': 0,
        'cookie-kit': 0,
      };

      // Calculate total amount
      let totalAmount = 0;

      // Fill in ordered items
      orderData.items.forEach(item => {
        totalAmount += item.quantity * item.price;

        // Map products to their specific flavor columns
        if (item.productId === 'sofganiyot-4') {
          productColumns['sofganiyot-strawberry'] = item.quantity;
        } else if (item.productId === 'sofganiyot-4.5') {
          const flavorKey = this.getFlavorKey(item.flavor);
          if (flavorKey) {
            productColumns[flavorKey] = item.quantity;
          }
        } else if (item.productId === 'cake-pops') {
          productColumns['cake-pops'] = item.quantity;
        } else if (item.productId === 'pretzels') {
          productColumns['pretzels'] = item.quantity;
        } else if (item.productId === 'decorated-cookies') {
          productColumns['decorated-cookies'] = item.quantity;
        } else if (item.productId === 'plain-cookies') {
          productColumns['plain-cookies'] = item.quantity;
        } else if (item.productId === 'cookie-kit') {
          productColumns['cookie-kit'] = item.quantity;
        }
      });

      // Add to row in correct order
      rowData.push(
        productColumns['sofganiyot-strawberry'],
        productColumns['sofganiyot-nutella'],
        productColumns['sofganiyot-dulce'],
        productColumns['sofganiyot-vanilla'],
        productColumns['sofganiyot-biscoff'],
        productColumns['sofganiyot-marshmallows'],
        productColumns['cake-pops'],
        productColumns['pretzels'],
        productColumns['decorated-cookies'],
        productColumns['plain-cookies'],
        productColumns['cookie-kit'],
        orderData.specialInstructions || '',
        orderData.totalItems,
        `$${totalAmount.toFixed(2)}`
      );

      // Append to sheet
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'Sheet1!A:Z',
        valueInputOption: 'RAW',
        resource: {
          values: [rowData],
        },
      });

      // Auto-resize columns after adding data
      await this.autoResizeColumns(20); // 20 columns total

      console.log(`✅ Order ${orderId} added to Google Sheets`);
      return { success: true, orderId };
    } catch (error) {
      console.error('❌ Error adding order to sheets:', error.message);
      throw error;
    }
  }

  getFlavorKey(flavor) {
    const flavorMap = {
      'Nutella': 'sofganiyot-nutella',
      'Dulce de Leche': 'sofganiyot-dulce',
      'Vanilla Custard': 'sofganiyot-vanilla',
      'Biscoff': 'sofganiyot-biscoff',
      'Marshmallows': 'sofganiyot-marshmallows',
    };
    return flavorMap[flavor] || null;
  }

  async autoResizeColumns(numColumns) {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.sheetId,
        resource: {
          requests: [
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: numColumns,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error auto-resizing columns:', error.message);
    }
  }
}

module.exports = new SheetsService();
