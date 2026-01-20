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
      // New multi-holiday headers
      const headers = [
        'Order ID',
        'Timestamp',
        'Holiday',
        'Customer Name',
        'Email',
        'Phone',
        'Pickup Date',
        'Pickup Time',
        'Items Summary',
        'Special Instructions',
        'Total Items',
        'Total Amount'
      ];

      // Always update headers to ensure they match current structure
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: 'Sheet1!A1:L1',
        valueInputOption: 'RAW',
        resource: {
          values: [headers],
        },
      });

      // Apply formatting
      await this.formatSheet(12); // 12 columns total

      console.log('✅ Sheet headers updated and formatted');
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
                backgroundColor: { red: 0.18, green: 0.22, blue: 0.28 }, // Dark charcoal
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

  // Format items into a readable summary
  formatItemsSummary(items) {
    return items.map(item => {
      let summary = `${item.productName} x${item.quantity}`;
      if (item.flavor) {
        summary += ` (${item.flavor})`;
      }
      if (item.cookieSelection && item.cookieSelection.length > 0) {
        summary += ` [Cookies: ${item.cookieSelection.join(', ')}]`;
      }
      if (item.fillingSelection && item.fillingSelection.length > 0) {
        summary += ` [Fillings: ${item.fillingSelection.join(', ')}]`;
      }
      if (item.designDescription) {
        summary += ` [Design: ${item.designDescription}]`;
      }
      return summary;
    }).join('\n');
  }

  async addOrder(orderData) {
    try {
      const timestamp = new Date().toISOString();
      const orderId = `ORDER-${Date.now()}`;

      // Calculate total amount
      let totalAmount = 0;
      orderData.items.forEach(item => {
        totalAmount += item.quantity * item.price;
      });

      // Create row data matching the new headers
      const rowData = [
        orderId,
        timestamp,
        orderData.holiday || 'General',
        orderData.customer.name || '',
        orderData.customer.email || '',
        orderData.customer.phone || '',
        orderData.customer.pickupDate || '',
        orderData.customer.pickupTime || '',
        this.formatItemsSummary(orderData.items),
        orderData.specialInstructions || '',
        orderData.totalItems,
        `$${totalAmount.toFixed(2)}`
      ];

      // Append to sheet
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'Sheet1!A:L',
        valueInputOption: 'RAW',
        resource: {
          values: [rowData],
        },
      });

      // Auto-resize columns after adding data
      await this.autoResizeColumns(12); // 12 columns total

      console.log(`✅ Order ${orderId} added to Google Sheets (Holiday: ${orderData.holiday || 'General'})`);
      return { success: true, orderId };
    } catch (error) {
      console.error('❌ Error adding order to sheets:', error.message);
      throw error;
    }
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
