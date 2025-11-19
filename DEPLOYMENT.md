# Vercel Deployment Guide

This project is configured for automatic deployment to Vercel.

## Quick Setup (One-Time Only)

### Step 1: Connect GitHub to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New..." → "Project"
4. Import your `jakebeinart1/Mitchs-Treats` repository
5. Vercel will detect the configuration automatically

### Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
PORT=3000
```

**Important:** Get these values from your `.env` file locally.

### Step 3: Deploy

Click "Deploy" in Vercel - that's it!

## Automatic Deployments

Once set up, **every push to GitHub will automatically deploy to Vercel**:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

## How It Works

The `vercel.json` file configures:
- Build settings for Node.js
- Routing for API endpoints and static files
- Environment variables

## Monitoring

- View deployments: https://vercel.com/dashboard
- Check logs: Click on any deployment → "Runtime Logs"
- View production site: Your Vercel URL (e.g., `mitchs-treats.vercel.app`)

## Custom Domain (Optional)

To use a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

**Note:** Make sure your Google Sheets API credentials are added to Vercel environment variables for orders to work properly.
