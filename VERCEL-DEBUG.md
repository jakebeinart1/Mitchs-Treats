# Vercel Environment Variables Setup

## Issue: Orders not saving to Google Sheets on Vercel

This means environment variables aren't set up correctly in Vercel.

## Steps to Fix:

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

### 2. Select Your Project
Click on **Mitchs-Treats** project

### 3. Go to Settings → Environment Variables
Click "Settings" → "Environment Variables"

### 4. Add These Variables (One by One):

#### Variable 1: GOOGLE_SHEET_ID
- **Key:** `GOOGLE_SHEET_ID`
- **Value:** `16EVW1DjDwzhcyX3XuHIVEWasgZHJTIgMdQFxXv08STc`
- **Environment:** Production, Preview, Development (check all 3)
- Click "Save"

#### Variable 2: GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Key:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value:** (Copy from your .env file)
- Should look like: `something@wired-plateau-478703-n0.iam.gserviceaccount.com`
- **Environment:** Production, Preview, Development (check all 3)
- Click "Save"

#### Variable 3: GOOGLE_PRIVATE_KEY
- **Key:** `GOOGLE_PRIVATE_KEY`
- **Value:** (Copy from your .env file - the ENTIRE value including quotes and \n)
- Should start with: `"-----BEGIN PRIVATE KEY-----\n`
- Should end with: `\n-----END PRIVATE KEY-----\n"`
- **Environment:** Production, Preview, Development (check all 3)
- Click "Save"

**⚠️ IMPORTANT:** The private key MUST include:
- The opening quote `"`
- `-----BEGIN PRIVATE KEY-----\n`
- All the key content
- `\n-----END PRIVATE KEY-----\n`
- The closing quote `"`

Example:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...(rest of key)...\n-----END PRIVATE KEY-----\n"
```

#### Variable 4: PORT
- **Key:** `PORT`
- **Value:** `3000`
- **Environment:** Production, Preview, Development (check all 3)
- Click "Save"

### 5. Redeploy
After adding all environment variables:
1. Go to "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete (1-2 minutes)

### 6. Test Again
- Go to your Vercel URL
- Submit a test order
- Check your Google Sheet

## How to Check if It Worked:

### View Vercel Logs:
1. Go to your deployment in Vercel
2. Click on the deployment
3. Click "Runtime Logs"
4. Look for messages like:
   - ✅ "Google Sheets service initialized successfully"
   - ✅ "Order ORDER-123 added to Google Sheets"

### Common Errors in Logs:
- ❌ "Error initializing Google Sheets" → Environment variables not set
- ❌ "Invalid private key" → GOOGLE_PRIVATE_KEY not formatted correctly
- ❌ "Permission denied" → Service account doesn't have Editor access to sheet

## Quick Verification:

Your local .env file should have these values:
```env
GOOGLE_SHEET_ID=16EVW1DjDwzhcyX3XuHIVEWasgZHJTIgMdQFxXv08STc
GOOGLE_SERVICE_ACCOUNT_EMAIL=(your service account email)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n(your key)\n-----END PRIVATE KEY-----\n"
PORT=3000
```

Copy these EXACT values into Vercel (each variable separately).

## Still Not Working?

Check these:
1. Service account has **Editor** access to the Google Sheet
2. Private key copied with quotes and \n characters
3. All 3 environments (Production, Preview, Development) selected
4. Redeployed after adding variables

---

Need help? Check the Runtime Logs in Vercel for specific error messages.
