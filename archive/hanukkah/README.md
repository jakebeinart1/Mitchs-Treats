# Hanukkah 2025 Archive

This folder contains the archived Hanukkah 2025 pages and products.

## Contents
- `index.html` - Hanukkah home page
- `order.html` - Hanukkah order page
- `products.js` - Hanukkah product catalog

## Accessing Archived Pages
The archived pages are accessible via:
- `/archive/hanukkah/` - Hanukkah home page
- `/archive/hanukkah/order.html` - Hanukkah order page

## Reactivation Instructions for Hanukkah 2026

1. **Update dates** in:
   - `index.html`: Change "2025" to "2026" in the Hanukkah notice section
   - `order.html`: Update the `min` attribute on the pickup-date input
   - `products.js`: Update any date-specific logic

2. **Update navigation** in both HTML files to point to the correct URLs

3. **Update server routes** in `server/server.js` to serve the Hanukkah pages

4. **Update Google Sheets** headers if needed in `server/sheetsService.js`

5. **Test thoroughly** before launch:
   - Verify all products display correctly
   - Test order submission
   - Check email notifications
   - Verify Google Sheets entries

## Key Hanukkah Dates Reference
- Hanukkah 2026 typically falls in late November/December
- Check the Jewish calendar for exact dates
- Production typically begins about a week before the first night
