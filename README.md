# Mitch's Treats - Order Website

A fully functional local website for ordering Hanukkah desserts with email notifications and Google Sheets integration.

## Features

- **Home Page**: Beautiful landing page with business information
- **Order Page**: Interactive ordering with cascading dropdowns
- **Email Notifications**: Automatic email sent to mitchs.treats@gmail.com for each order
- **Google Sheets Integration**: Orders automatically saved to Google Sheets
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Ensures all required information is provided
- **Minimum Quantity Enforcement**: Validates minimum order quantities

## Project Structure

```
mitchs-treats/
├── index.html              # Home page
├── order.html              # Order page
├── package.json            # Node.js dependencies
├── .env                    # Environment variables (create this!)
├── .env.template           # Template for .env file
├── styles/
│   └── main.css           # All styling
├── scripts/
│   ├── products.js        # Product catalog
│   └── order.js           # Order page logic
├── images/                # Product images
└── server/
    ├── server.js          # Express server
    ├── emailService.js    # Email notifications
    └── sheetsService.js   # Google Sheets integration
```

## Setup Instructions

### Step 1: Google Sheets API Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create a New Project**:
   - Click "Select a project" → "New Project"
   - Name: "Mitchs Treats Orders"
   - Click "Create"

3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

4. **Create Service Account**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Service account name: "mitchs-treats-orders"
   - Click "Create and Continue"
   - Skip optional steps, click "Done"

5. **Generate Service Account Key**:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Choose "JSON" format
   - Click "Create" (file will download)

6. **Share Google Sheet with Service Account**:
   - Open the JSON file you just downloaded
   - Find the "client_email" field (looks like: something@something.iam.gserviceaccount.com)
   - Copy this email address
   - Go to your Google Sheet: https://docs.google.com/spreadsheets/d/16EVW1DjDwzhcyX3XuHIVEWasgZHJTIgMdQFxXv08STc/edit
   - Click "Share"
   - Paste the service account email
   - Give it "Editor" permissions
   - Click "Send"

### Step 2: Gmail App Password Setup

1. **Go to Google Account Settings**: https://myaccount.google.com/

2. **Enable 2-Step Verification** (if not already enabled):
   - Go to "Security"
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the steps to enable it

3. **Create App Password**:
   - Go back to "Security"
   - Under "Signing in to Google", click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Name it "Mitchs Treats Website"
   - Click "Generate"
   - **Copy the 16-character password** (you'll need this for the .env file)

### Step 3: Create Environment Variables File

1. **Copy the template**:
   ```bash
   cp .env.template .env
   ```

2. **Edit the .env file** and fill in your credentials:

   Open the `.env` file and replace the placeholders:

   ```env
   # Email Configuration
   EMAIL_USER=mitchs.treats@gmail.com
   EMAIL_PASS=your_16_character_app_password_here

   # Google Sheets Configuration
   GOOGLE_SHEET_ID=16EVW1DjDwzhcyX3XuHIVEWasgZHJTIgMdQFxXv08STc
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

   **How to fill in the Google credentials**:
   - Open the service account JSON file you downloaded
   - Copy the value of `client_email` → paste into `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Copy the value of `private_key` → paste into `GOOGLE_PRIVATE_KEY` (keep the quotes!)

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
✅ Email service initialized successfully
✅ Google Sheets service initialized successfully
✨ Server is running!

   🌐 Home page: http://localhost:3000
   🛒 Order page: http://localhost:3000/order
```

### Step 5: Test the Website

1. Open your browser to: http://localhost:3000
2. Click "Order Now"
3. Select some items
4. Fill in the customer form
5. Submit the order
6. Check:
   - Email inbox at mitchs.treats@gmail.com
   - Google Sheet for the new order row

## Product List

Current products available for order:

| Product | Price | Minimum | Notes |
|---------|-------|---------|-------|
| Sofganiyot - Strawberry Jam | $4.00 | 1 | Strawberry jam filling |
| Sofganiyot - Premium Fillings | $4.50 | 1 | Nutella, Dulce, Vanilla Custard, Biscoff, Marshmallows |
| Cake Pops | $3.00 | 6 | Vanilla cake |
| Chocolate Covered Pretzels | $2.00 | 6 | - |
| Decorated Cookies | $3.00 | 6 | - |
| Plain Hanukkah Cookies | $1.25 | 6 | - |
| Cookie Decorating Kit | $25.00 | 1 | Includes 12 cookies, 2 icings, 3 sprinkles |

## Updating Product Images

To update which image is shown for each product:

1. Open `scripts/products.js`
2. Find the product you want to update
3. Change the `image` field to the correct filename from the `images/` folder

Example:
```javascript
{
    id: 'cake-pops',
    name: 'Cake Pops',
    price: 3.00,
    image: 'images/1.jpg',  // <- Change this to your image filename
    ...
}
```

## Troubleshooting

### Email Not Sending

- Verify you're using an App Password (not your regular Gmail password)
- Check that 2-Step Verification is enabled on your Google account
- Check the server console for error messages

### Google Sheets Not Working

- Verify the service account email has Editor access to the sheet
- Check that the Sheet ID in .env matches your Google Sheet
- Make sure the private key is properly formatted with `\n` for line breaks
- Check the server console for error messages

### Server Won't Start

- Make sure you ran `npm install`
- Check that all .env variables are filled in
- Verify port 3000 is not already in use

### Products Not Showing

- Check that `images/` folder exists and has images
- Check browser console for JavaScript errors
- Verify `scripts/products.js` is loading correctly

## Customization

### Change Products

Edit `scripts/products.js` to add, remove, or modify products.

### Change Colors

Edit `styles/main.css` - look for the CSS variables at the top:
```css
:root {
    --primary-blue: #0047AB;
    --accent-gold: #FFD700;
    ...
}
```

### Change Contact Information

Edit `index.html` to update the contact information section.

## Support

For technical issues or questions:
- Email: mitchs.treats@gmail.com
- Phone: 281.236.3047

## Security Notes

- The `.env` file is ignored by git to protect your credentials
- Never share your .env file or commit it to version control
- The app uses HTTPS for Gmail communication
- Input is sanitized to prevent XSS attacks

## Future Enhancements

Possible features to add:
- Customer confirmation emails
- Admin dashboard to view all orders
- Order status tracking
- Payment integration
- Photo gallery
- Customer reviews

---

Made with ❤️ for Mitch's Treats
