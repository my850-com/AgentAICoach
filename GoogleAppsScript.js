/**
 * Google Apps Script for AgentAICoach Form Submissions
 * 
 * This script receives webhook data from the quiz and contact forms
 * and writes it to the "Sherlock Data" Google Sheet.
 * 
 * Setup Instructions:
 * 1. Open your "Sherlock Data" Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this entire code into the script editor
 * 4. Save and deploy as Web App (see below)
 * 5. The script will auto-create sheets on first use
 * 
 * MANUAL SHEET CREATION (optional):
 * If you want to create sheets manually before first submission:
 * 
 * Sheet 1: "QuizSubmissions"
 * Headers: Timestamp | Email | Total Score | Category | Q1 | Q2 | ... | Q20 | UTM Source | UTM Medium | UTM Campaign | Page URL
 * 
 * Sheet 2: "ContactSubmissions"  
 * Headers: Timestamp | First Name | Last Name | Email | Phone | Interest | Role | Message | Page URL
 * 
 * Deployment:
 * 1. Click Deploy → New deployment
 * 2. Type: Web app
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 * 5. Click Deploy
 * 6. Copy the Web App URL (looks like: https://script.google.com/macros/s/ABC123/exec)
 * 7. Update quiz.js and contact.js with this URL
 */

// ============================================
// DO NOT EDIT BELOW UNLESS YOU KNOW WHAT YOU'RE DOING
// ============================================

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Determine which form submitted (quiz vs contact)
    if (data.leadData && data.answers && typeof data.totalScore !== 'undefined') {
      // This is a quiz submission
      return handleQuizSubmission(data);
    } else if (data.source === 'contact-form') {
      // This is a contact form submission
      return handleContactSubmission(data);
    } else {
      // Unknown submission type
      return jsonResponse({
        success: false,
        error: 'Unknown submission type. Expected quiz or contact form data.'
      });
    }
  } catch (error) {
    console.error('Error processing submission:', error);
    return jsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

function doGet(e) {
  // For testing - returns a simple success message
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: 'AgentAICoach form endpoint is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// QUIZ SUBMISSION HANDLER
// ============================================

function handleQuizSubmission(data) {
  const leadData = data.leadData;
  const answers = data.answers || {};
  const totalScore = data.totalScore;
  const category = data.category || 'Unknown';
  
  // Get or create the QuizSubmissions sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('QuizSubmissions');
  
  if (!sheet) {
    // Create sheet with headers if it doesn't exist
    sheet = ss.insertSheet('QuizSubmissions');
    const headers = [
      'Timestamp',
      'Email',
      'Total Score',
      'Category',
      'Q1', 'Q2', 'Q3', 'Q4', 'Q5',
      'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
      'Q11', 'Q12', 'Q13', 'Q14', 'Q15',
      'Q16', 'Q17', 'Q18', 'Q19', 'Q20',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Page URL'
    ];
    sheet.appendRow(headers);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a365d');
    headerRange.setFontColor('#ffffff');
  }
  
  // Build the row data
  const row = [
    leadData.timestamp || new Date().toISOString(),
    leadData.email,
    totalScore,
    category
  ];
  
  // Add all 20 quiz answers (0 if not answered)
  for (let i = 1; i <= 20; i++) {
    row.push(answers[i] || 0);
  }
  
  // Add UTM params and page URL
  row.push(
    leadData.utm_source || '',
    leadData.utm_medium || '',
    leadData.utm_campaign || '',
    leadData.pageUrl || ''
  );
  
  // Append to sheet
  sheet.appendRow(row);
  
  return jsonResponse({
    success: true,
    message: 'Quiz submission recorded',
    score: totalScore,
    category: category
  });
}

// ============================================
// CONTACT FORM HANDLER
// ============================================

function handleContactSubmission(data) {
  // Get or create the ContactSubmissions sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('ContactSubmissions');
  
  if (!sheet) {
    // Create sheet with headers if it doesn't exist
    sheet = ss.insertSheet('ContactSubmissions');
    const headers = [
      'Timestamp',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Interest',
      'Role',
      'Message',
      'Page URL'
    ];
    sheet.appendRow(headers);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a365d');
    headerRange.setFontColor('#ffffff');
  }
  
  // Build the row data
  const row = [
    data.timestamp || new Date().toISOString(),
    data.firstName,
    data.lastName,
    data.email,
    data.phone || '',
    data.interest,
    data.role || '',
    data.message,
    data.pageUrl || ''
  ];
  
  // Append to sheet
  sheet.appendRow(row);
  
  return jsonResponse({
    success: true,
    message: 'Contact form submission recorded'
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function (run this manually in Apps Script editor to verify)
function testQuizSubmission() {
  const testData = {
    leadData: {
      email: 'test@example.com',
      timestamp: new Date().toISOString(),
      pageUrl: 'https://agentaicoach.com/',
      utm_source: 'test',
      utm_medium: 'test',
      utm_campaign: 'test'
    },
    answers: {
      1: 5, 2: 4, 3: 3, 4: 2, 5: 1,
      6: 5, 7: 4, 8: 3, 9: 2, 10: 1,
      11: 5, 12: 4, 13: 3, 14: 2, 15: 1,
      16: 5, 17: 4, 18: 3, 19: 2, 20: 1
    },
    totalScore: 50,
    category: 'AI Emerging'
  };
  
  const result = handleQuizSubmission(testData);
  console.log('Quiz test result:', result);
}

function testContactSubmission() {
  const testData = {
    timestamp: new Date().toISOString(),
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    interest: 'coaching',
    role: 'agent',
    message: 'This is a test message from the contact form.',
    pageUrl: 'https://agentaicoach.com/contact.html',
    source: 'contact-form'
  };
  
  const result = handleContactSubmission(testData);
  console.log('Contact test result:', result);
}
