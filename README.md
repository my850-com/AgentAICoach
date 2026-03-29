# AgentAICoach Website

A modern, responsive website for AgentAICoach featuring an AI Proficiency Quiz for real estate professionals.

## Table of Contents

- [Project Overview](#project-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Quick Start](#quick-start)
- [Customization](#customization)
  - [Editing Quiz Questions](#editing-quiz-questions)
  - [Editing Scoring Categories](#editing-scoring-categories)
  - [Colors and Branding](#colors-and-branding)
- [Google Sheets Integration](#google-sheets-integration)
  - [Setting Up Apps Script](#setting-up-apps-script)
  - [Deploying the Web App](#deploying-the-web-app)
  - [Testing the Integration](#testing-the-integration)
- [Deployment](#deployment)
  - [Static Hosting Options](#static-hosting-options)
  - [Custom Domain Setup](#custom-domain-setup)
- [Analytics & Tracking](#analytics--tracking)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

AgentAICoach is a lead generation website designed for real estate professionals (agents, brokers, mortgage lenders) to assess their AI proficiency and receive personalized recommendations.

**Key Components:**
- **Landing Page**: Professional design with service offerings
- **AI Proficiency Quiz**: 20-question assessment across 4 categories
- **Scoring System**: 5-tier rating from Beginner to AI-Ready Leader
- **Lead Capture**: Form that feeds to Google Sheets
- **Personalized Results**: Custom recommendations based on score

---

## File Structure

```
agentaicoach/
├── index.html          # Main HTML file - landing page + quiz
├── style.css           # Complete CSS styles (responsive, animations)
├── quiz.js             # Quiz logic, questions, scoring, form submission
├── main.js             # Smooth scroll, mobile nav, animations, utilities
├── README.md           # This file
└── .gitignore          # Git ignore file (optional)
```

### File Purposes

| File | Purpose | Lines |
|------|---------|-------|
| `index.html` | Structure and content | ~450 |
| `style.css` | All styling, responsive breakpoints | ~1100 |
| `quiz.js` | Quiz questions, scoring, Google Sheets submission | ~900 |
| `main.js` | Navigation, animations, form validation | ~700 |

---

## Features

### Website Features
- ✨ Modern, professional design optimized for conversions
- 📱 Fully responsive (desktop, tablet, mobile)
- 🎨 Custom color scheme (#1a365d primary, #06b6d4 accent)
- 🔄 Smooth scroll navigation
- 🍔 Mobile hamburger menu
- ♿ Accessible (ARIA labels, keyboard nav, skip links)
- 🎯 SEO-optimized meta tags

### Quiz Features
- 📊 20 questions across 4 categories
- 🎯 Progress indicator (4 steps)
- ⌨️ Keyboard navigation (arrow keys, Enter)
- 🏷️ UTM parameter tracking
- 📧 Lead capture before results
- 📈 Google Sheets integration
- 🔄 Retake quiz functionality
- 📤 Social sharing (Twitter, LinkedIn, Email)

### Scoring Categories
1. **AI Beginner** (0-35 points) - DIY Course
2. **AI Emerging** (36-55 points) - DIY Course + Community
3. **AI Active User** (56-70 points) - Private Coaching
4. **AI Advanced** (71-85 points) - Coaching + Custom Implementation
5. **AI-Ready Leader** (86-100 points) - Done-For-You AI System

---

## Quick Start

### Local Development

1. **Download/clone the project** to your local machine

2. **Open in browser** (no server required for basic testing):
   ```bash
   # On Mac
   open index.html
   
   # On Windows
   start index.html
   
   # Or use a simple HTTP server
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Test the quiz** by clicking "Start the Quiz"

4. **Verify styles** on different screen sizes using browser dev tools

---

## Customization

### Editing Quiz Questions

Quiz questions are located in `quiz.js` in the `quizData` object:

```javascript
const quizData = {
    awareness: [ /* questions 1-5 */ ],
    workflow: [ /* questions 6-10 */ ],
    readiness: [ /* questions 11-15 */ ],
    goals: [ /* questions 16-20 */ ]
};
```

**To edit a question:**

```javascript
{
    id: 1,
    question: "Your question text here?",
    category: "awareness",  // Must match: awareness, workflow, readiness, goals
    options: [
        { text: "Option A", score: 1 },
        { text: "Option B", score: 2 },
        { text: "Option C", score: 3 },
        { text: "Option D", score: 4 },
        { text: "Option E", score: 5 }
    ]
}
```

**Scoring guide:**
- Score 1 = Low AI proficiency (more basic)
- Score 5 = High AI proficiency (more advanced)

**Important:** Keep exactly 5 options per question for consistent scoring.

### Editing Scoring Categories

Categories are defined in `quiz.js` in the `scoreCategories` array:

```javascript
const scoreCategories = [
    {
        name: "AI Beginner",           // Category name shown to user
        minScore: 0,                   // Minimum score for this category
        maxScore: 35,                  // Maximum score (exclusive of next)
        icon: "🌱",                    // Emoji icon for visual
        color: "#86efac",              // CSS color for badge
        description: "Description...", // What user sees
        recommendation: "diy",          // diy | coaching | custom
        recommendationTitle: "DIY AI Course",
        recommendationText: "What to recommend..."
    },
    // ... more categories
];
```

**To add/modify a category:**
1. Ensure score ranges don't overlap
2. Choose from 3 recommendation types: `diy`, `coaching`, `custom`
3. Customize the title and text that appears to the user

### Colors and Branding

Edit CSS variables in `style.css` at the top of the file:

```css
:root {
    --primary: #1a365d;       /* Dark Navy - main brand color */
    --primary-dark: #0f2744;  /* Darker variant */
    --primary-light: #2c5282; /* Lighter variant */
    --accent: #06b6d4;        /* Cyan/Teal - accent color */
    --accent-dark: #0891b2;   /* Darker accent */
    --accent-light: #67e8f9;  /* Lighter accent */
    --bg: #f7fafc;            /* Background gray */
    --text: #1e293b;          /* Main text color */
}
```

**To change fonts:**
- Edit the Google Fonts URL in `index.html` `<head>`
- Update `font-family` in `style.css` body selector

---

## Google Sheets Integration

The quiz submits responses to Google Sheets via Google Apps Script.

### Setting Up Apps Script

1. **Create a new Google Sheet**
   - Go to https://sheets.new
   - Name it "AgentAICoach Quiz Responses"

2. **Create column headers** in Row 1:
   | A | B | C | D | E | F | G | H | I | J+ |
   |---|---|---|---|---|---|---|---|---|----|
   | Timestamp | FirstName | LastName | Email | Company | Role | Phone | Score | Category | Q1-Q20 |

3. **Open Apps Script**
   - In Sheets: Extensions → Apps Script
   - Delete the default `myFunction()`

4. **Paste this code:**

```javascript
/**
 * Google Apps Script for AgentAICoach Quiz
 * Handles form submissions and stores to Google Sheets
 */

// Sheet name where data is stored
const SHEET_NAME = 'Responses';

/**
 * Web app endpoint that receives POST requests from the quiz
 */
function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    }
    
    // Build row data
    const row = buildRowData(data);
    
    // Append to sheet
    sheet.appendRow(row);
    
    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Response recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    console.error('Error processing submission:', error);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Build the row data from submission
 */
function buildRowData(data) {
  const lead = data.leadData || {};
  const answers = data.answers || {};
  
  // Base fields
  const row = [
    lead.timestamp || new Date().toISOString(),
    lead.firstName || '',
    lead.lastName || '',
    lead.email || '',
    lead.company || '',
    lead.role || '',
    lead.phone || '',
    data.totalScore || 0,
    data.category || '',
    lead.pageUrl || ''
  ];
  
  // Add UTM parameters if present
  if (lead.utm_source) row.push(lead.utm_source);
  if (lead.utm_medium) row.push(lead.utm_medium);
  if (lead.utm_campaign) row.push(lead.utm_campaign);
  if (lead.utm_content) row.push(lead.utm_content);
  if (lead.utm_term) row.push(lead.utm_term);
  
  // Add individual question answers
  for (let i = 1; i <= 20; i++) {
    row.push(answers[i] || '');
  }
  
  return row;
}

/**
 * Setup headers on new sheet
 */
function setupHeaders(sheet) {
  const headers = [
    'Timestamp', 'FirstName', 'LastName', 'Email', 'Company', 'Role', 'Phone',
    'Score', 'Category', 'PageURL', 'UTM_Source', 'UTM_Medium', 'UTM_Campaign',
    'UTM_Content', 'UTM_Term', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 
    'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18', 'Q19', 'Q20'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  
  // Format timestamp column
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

/**
 * Preflight for CORS - required for cross-origin requests
 */
function doOptions(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. **Save the project** (Ctrl+S or Cmd+S)

### Deploying the Web App

1. **Click Deploy → New deployment**

2. **Click the gear icon** ⚙️ and select "Web app"

3. **Configure deployment:**
   - Description: "AgentAICoach Quiz Handler"
   - Execute as: Me (your email)
   - Who has access: Anyone
   
4. **Click Deploy**

5. **Copy the Web app URL** (looks like):
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXX/exec
   ```

6. **Update quiz.js** with your URL:
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXX/exec';
   ```

7. **Note:** The first time someone submits, you'll need to authorize the script

### Testing the Integration

1. **Test locally:** Fill out and submit the quiz
2. **Check your Google Sheet** - data should appear in a few seconds
3. **Check browser console** for any errors
4. **Verify UTM params** work by testing with URL parameters:
   ```
   ?utm_source=facebook&utm_medium=ad&utm_campaign=summer2024
   ```

---

## Deployment

### Static Hosting Options

This is a static website - any static host will work:

#### Option 1: Netlify (Easiest)
1. Create account at netlify.com
2. Drag `agentaicoach` folder to deploy
3. Custom domain: Settings → Domain management

#### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. In project folder: `vercel`
3. Follow prompts to deploy

#### Option 3: GitHub Pages
1. Push to GitHub repository
2. Settings → Pages → Deploy from branch
3. Select `main` branch, `/ (root)` folder

#### Option 4: Cloudflare Pages
1. Connect GitHub repository
2. Build command: (leave empty for static)
3. Deploy

#### Option 5: Traditional Hosting (HostGator, Bluehost, etc.)
1. Upload all files via FTP/SFTP
2. Ensure `index.html` is at root
3. Configure custom domain in hosting panel

### Custom Domain Setup

1. **Purchase domain** (Namecheap, GoDaddy, Cloudflare)

2. **Set DNS records**:
   ```
   Type: A
   Name: @
   Value: [Your hosting IP]
   
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app (or other host)
   ```

3. **Configure in hosting platform**:
   - Add custom domain in dashboard
   - SSL certificate usually auto-provisions

4. **Update quiz.js** with production domain:
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

---

## Analytics & Tracking

### Google Analytics 4 Setup

1. **Create GA4 property** at analytics.google.com
2. **Get measurement ID** (G-XXXXXXXXXX)
3. **Add to index.html** before closing `</head>`:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Tracked Events

The following are automatically tracked:

| Event | When | Data |
|-------|------|------|
| `quiz_complete` | Quiz finished | Score, Category |
| `cta_click` | Primary buttons clicked | Button text |
| `nav_click` | Navigation links clicked | Link href |
| `external_link` | External links clicked | URL |

**Access tracking data:**
- View in GA4 Events dashboard
- Connect to Google Data Studio for custom reports

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Chrome | Latest | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |
| IE 11 | - | ❌ Not supported |

**Features with fallbacks:**
- Intersection Observer → Falls back to opacity
- CSS Grid → Flexbox fallback not needed (good browser support)
- CSS Variables → Native support only

---

## Troubleshooting

### Quiz not submitting?

1. **Check browser console** for JavaScript errors
2. **Verify Google Apps Script URL** is correct
3. **Check CORS policy** - Apps Script must allow "Anyone" access
4. **Test Apps Script** directly with curl:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"test":"data"}' \
     YOUR_SCRIPT_URL
   ```

### Styles not loading?

1. **Verify file paths** - CSS/JS files should be in same folder
2. **Check browser cache** - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. **Console errors** - Look for 404 errors on resources

### Mobile menu not working?

1. **Check JavaScript** is enabled
2. **Verify `main.js` loads** - Check network tab in dev tools
3. **Test on actual mobile** - Simulator may differ

### Fonts not showing?

1. **Check Google Fonts link** in HTML head
2. **Font loading** - May need @font-face for production
3. **Cross-origin** - Ensure preconnect attributes are present

### Quiz progress not saving?

1. **LocalStorage permissions** - Some browsers block this
2. **Private/incognito mode** - Data won't persist between sessions
3. **Check for errors** in console related to localStorage

---

## Maintenance Checklist

- [ ] Update quiz questions seasonally
- [ ] Check Google Sheets for responses weekly
- [ ] Review analytics for quiz completion rate
- [ ] Test on different devices monthly
- [ ] Update pricing in services section
- [ ] Add new testimonials as received
- [ ] Monitor for broken links
- [ ] Update copyright year annually

---

## License

This project is proprietary. Unauthorized copying or distribution is prohibited.

---

## Support

For technical issues:
1. Check this README thoroughly
2. Review browser console for errors
3. Test Google Apps Script independently
4. Contact: [your-email@example.com]

---

**Last Updated:** March 2026

**Version:** 1.0.0
