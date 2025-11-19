# Quick Setup Guide for Mitch's Treats Website

## What You Need to Do Next

You need to set up two things before the website can work:

1. **Google Sheets API credentials** (to save orders to your Google Sheet)
2. **Gmail App Password** (to send order notification emails)

---

## Part 1: Google Sheets API Setup (15 minutes)

### Step 1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Click "New Project"
5. Name it: **Mitchs Treats Orders**
6. Click "Create"

### Step 2: Enable Google Sheets API

1. Make sure your new project is selected
2. Click the hamburger menu (≡) → **APIs & Services** → **Library**
3. In the search box, type: **Google Sheets API**
4. Click on "Google Sheets API"
5. Click the blue **Enable** button

### Step 3: Create Service Account

1. Click the hamburger menu (≡) → **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in:
   - Service account name: **mitchs-treats-orders**
   - Service account ID: (auto-filled, leave as is)
4. Click **Create and Continue**
5. Skip the optional "Grant this service account access" section
6. Click **Continue**
7. Skip the optional "Grant users access" section
8. Click **Done**

### Step 4: Download Service Account Key (JSON)

1. You should now see your service account in the list
2. Click on the service account email address
3. Go to the **Keys** tab
4. Click **Add Key** → **Create New Key**
5. Choose **JSON** format
6. Click **Create**
7. A JSON file will download to your computer
   - **Keep this file safe!** You'll need it in a moment

### Step 5: Share Your Google Sheet with the Service Account

1. Open the JSON file you just downloaded in a text editor
2. Look for the line that says `"client_email":`
3. Copy the email address (it looks like: `mitchs-treats-orders@xxxxx.iam.gserviceaccount.com`)
4. Open your Google Sheet:
   - https://docs.google.com/spreadsheets/d/16EVW1DjDwzhcyX3XuHIVEWasgZHJTIgMdQFxXv08STc/edit
5. Click the **Share** button (top right)
6. Paste the service account email address
7. Make sure it has **Editor** permissions
8. **UNCHECK** "Notify people" (it's not a real person)
9. Click **Share** or **Send**

✅ **Google Sheets API is now set up!**

---

## Part 2: Gmail App Password Setup (5 minutes)

### Step 1: Enable 2-Step Verification (if not already enabled)

1. Go to: https://myaccount.google.com/security
2. Under "Signing in to Google", find **2-Step Verification**
3. If it says "Off", click on it and follow the steps to turn it on
4. If it's already on, proceed to Step 2

### Step 2: Create an App Password

1. Go to: https://myaccount.google.com/security
2. Under "Signing in to Google", click **App passwords**
   - If you don't see this option, make sure 2-Step Verification is enabled
3. In the "Select app" dropdown, choose **Mail**
4. In the "Select device" dropdown, choose **Other (custom name)**
5. Type: **Mitchs Treats Website**
6. Click **Generate**
7. You'll see a 16-character password (like: `abcd efgh ijkl mnop`)
8. **Copy this password** - you'll need it in the next step
   - Note: You won't be able to see this password again!

✅ **Gmail App Password is ready!**

---

## Part 3: Create the .env File

Now you'll create a `.env` file with all your credentials.

### Option A: Copy the template

```bash
cp .env.template .env
```

### Option B: Create manually

Create a new file named `.env` in the project root directory.

### Fill in the credentials

Open the `.env` file in a text editor and fill in:

```env
# Email Configuration
EMAIL_USER=mitchs.treats@gmail.com
EMAIL_PASS=your_16_character_app_password_here

# Google Sheets Configuration
GOOGLE_SHEET_ID=16EVW1DjDwzhcyX3XuHIVEWasgZHJTIgMdQFxXv08STc
GOOGLE_SERVICE_ACCOUNT_EMAIL=paste_client_email_from_json_here
GOOGLE_PRIVATE_KEY="paste_private_key_from_json_here"

# Server Configuration
PORT=3000
NODE_ENV=development
```

### How to fill in each field:

1. **EMAIL_USER**: Already filled in (`mitchs.treats@gmail.com`)

2. **EMAIL_PASS**: Paste the 16-character app password you just created
   - Remove any spaces (should be 16 characters with no spaces)

3. **GOOGLE_SHEET_ID**: Already filled in

4. **GOOGLE_SERVICE_ACCOUNT_EMAIL**:
   - Open the JSON file you downloaded
   - Find the line: `"client_email": "..."`
   - Copy the email address (in quotes)
   - Paste it here (without quotes)

5. **GOOGLE_PRIVATE_KEY**:
   - Open the JSON file you downloaded
   - Find the line: `"private_key": "..."`
   - Copy the ENTIRE value (keep the `\n` characters!)
   - Paste it here WITH the quotes
   - It should look like: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

### Example .env file (with fake credentials):

```env
EMAIL_USER=mitchs.treats@gmail.com
EMAIL_PASS=abcdefghijklmnop

GOOGLE_SHEET_ID=16EVW1DjDwzhcyX3XuHIVEWasgZHJTIgMdQFxXv08STc
GOOGLE_SERVICE_ACCOUNT_EMAIL=mitchs-treats-orders@mitchs-treats-12345.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...(very long)...END PRIVATE KEY-----\n"

PORT=3000
NODE_ENV=development
```

✅ **Configuration complete!**

---

## Part 4: Start the Server

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

If you see any errors, check the **Troubleshooting** section in README.md

---

## Part 5: Test It!

1. Open http://localhost:3000 in your browser
2. Click "Order Now"
3. Add some items to your cart
4. Fill in your information
5. Submit the order
6. Check:
   - ✅ Email received at mitchs.treats@gmail.com
   - ✅ New row appears in your Google Sheet

---

## Need Help?

If something isn't working:

1. Check the server console for error messages
2. Read the **Troubleshooting** section in README.md
3. Make sure you completed ALL steps above
4. Double-check that the `.env` file has no typos

Common issues:
- **Email not working**: Make sure you're using the App Password (not your regular Gmail password)
- **Sheets not working**: Make sure you shared the sheet with the service account email
- **Server won't start**: Make sure you ran `npm install` first

---

**You're all set!** The website is ready to take orders.
