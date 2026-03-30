# Shipping Quote Dashboard

A web-based dashboard for displaying FedEx shipping quotes from Smartsheet data.

## Setup Instructions

### 1. Add Your Smartsheet API Token

1. Open `script.js` in a text editor
2. Find this line at the top of the file:
   ```javascript
   const SMARTSHEET_API_TOKEN = 'YOUR_API_TOKEN_HERE';
   ```
3. Replace `YOUR_API_TOKEN_HERE` with your actual Smartsheet API token
4. Save the file

### How to Get Your Smartsheet API Token

1. Log into Smartsheet
2. Go to **User Profile** (click your name in top right)
3. Click **API Access** tab
4. Click **Generate new access token**
5. Copy the token

### 2. Sheet Configuration

The dashboard is configured to read from Smartsheet Sheet ID: `5638471382159236`

If you need to change the sheet, update this line in `script.js`:
```javascript
const SHEET_ID = 'YOUR_SHEET_ID_HERE';
```

### 3. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Upload all files (index.html, styles.css, script.js)
3. Go to repository **Settings** → **Pages**
4. Under "Source", select **main** branch
5. Click **Save**
6. Your dashboard will be available at: `https://yourusername.github.io/repository-name`

## Required Smartsheet Columns

The dashboard expects these column names:
- EVENT ID
- KIT NUMBER
- QUOTE DATE
- DESTINATION NAME
- DESTINATION ADDRESS
- DESTINATION CITY
- DESTINATION STATE
- DESTINATION ZIP
- RETURN TO NAME
- RETURN TO ADDRESS
- RETURN TO CITY
- RETURN TO STATE
- RETURN TO ZIP
- WEIGHT
- DIMENSIONS
- OUT FEDEX GROUND
- OUT FEDEX EXPRESS SAVER
- OUT FEDEX 2DAY
- OUT FEDEX 2DAY AM
- OUT FEDEX STANDARD O/N
- OUT FEDEX PRIORITY O/N
- OUT FEDEX FIRST O/N
- RET FEDEX GROUND
- RET FEDEX EXPRESS SAVER
- RET FEDEX 2DAY
- RET FEDEX 2DAY AM
- RET FEDEX STANDARD O/N
- RET FEDEX PRIORITY O/N
- RET FEDEX FIRST O/N

## Support

For issues or questions, contact Leading Edge Training Solutions.