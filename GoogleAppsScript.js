/**
 * Google Apps Script for AgentAICoach Form Submissions
 * 
 * This script receives webhook data from both quiz and contact forms
 * and writes them to the "AI Coach Form Submissions" sheet.
 * 
 * FPL Form Submissions remains untouched for existing forms.
 * 
 * Setup Instructions:
 * 1. Open your "Sherlock Data" Google Sheet  
 * 2. Extensions → Apps Script
 * 3. Delete existing code and paste this entire script
 * 4. Save and deploy as Web App (see below)
 * 5. The script will auto-create headers on first submission
 * 6. Update quiz.js and contact.js with the deployed URL
 * 
 * Deployment:
 * 1. Click Deploy → New deployment
 * 2. Type: Web app
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 * 5. Click Deploy
 * 6. Copy the Web App URL
 * 7. Update quiz.js and contact.js with this URL
 */

// ============================================
// MAIN HANDLER
// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Determine submission type
    if (data.leadData && data.answers && typeof data.totalScore !== 'undefined') {
      return handleQuizSubmission(data);
    } else if (data.source === 'contact-form') {
      return handleContactSubmission(data);
    } else {
      return jsonResponse({
        success: false,
        error: 'Unknown submission type'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return jsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

function doGet(e) {
  return jsonResponse({
    status: 'OK',
    message: 'AgentAICoach form endpoint is running'
  });
}

// ============================================
// QUIZ SUBMISSION HANDLER
// ============================================

function handleQuizSubmission(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const SHEET_NAME = 'AI Coach Form Submissions';
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create sheet if doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupHeaders(sheet);
  }
  
  // Check if we need quiz headers
  const existingHeaders = sheet.getRange(1, 1, 1, 32).getValues()[0];
  if (!existingHeaders[0]) {
    setupHeaders(sheet);
  }
  
  const leadData = data.leadData;
  const answers = data.answers || {};
  const row = [
    leadData.timestamp || new Date().toISOString(),
    'Quiz',
    '', // First Name
    '', // Last Name
    leadData.email,
    data.totalScore,
    data.category || '',
    // Q1-Q20 (0-5 each)
    answers[1] || 0, answers[2] || 0, answers[3] || 0, answers[4] || 0, answers[5] || 0,
    answers[6] || 0, answers[7] || 0, answers[8] || 0, answers[9] || 0, answers[10] || 0,
    answers[11] || 0, answers[12] || 0, answers[13] || 0, answers[14] || 0, answers[15] || 0,
    answers[16] || 0, answers[17] || 0, answers[18] || 0, answers[19] || 0, answers[20] || 0,
    leadData.utm_source || '',
    leadData.utm_medium || '',
    leadData.utm_campaign || '',
    '', // Interest
    '', // Message
    leadData.pageUrl || ''
  ];
  
  sheet.appendRow(row);
  
  return jsonResponse({
    success: true,
    message: 'Quiz recorded',
    score: data.totalScore,
    category: data.category
  });
}

// ============================================
// CONTACT FORM HANDLER
// ============================================

function handleContactSubmission(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const SHEET_NAME = 'AI Coach Form Submissions';
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupHeaders(sheet);
  }
  
  // Check if we need headers
  const existingHeaders = sheet.getRange(1, 1, 1, 32).getValues()[0];
  if (!existingHeaders[0]) {
    setupHeaders(sheet);
  }
  
  const row = [
    data.timestamp || new Date().toISOString(),
    'Contact',
    data.firstName || '',
    data.lastName || '',
    data.email,
    '', // Score
    '', // Category
    // Q1-Q20 (blank for contact forms)
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', // UTM Source
    '', // UTM Medium  
    '', // UTM Campaign
    data.interest || '',
    data.message || '',
    data.pageUrl || ''
  ];
  
  sheet.appendRow(row);
  
  return jsonResponse({
    success: true,
    message: 'Contact recorded'
  });
}

// ============================================
// SHEET SETUP
// ============================================

function setupHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Source',
    'FirstName',
    'LastName', 
    'Email',
    'Score',
    'Category',
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5',
    'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
    'Q11', 'Q12', 'Q13', 'Q14', 'Q15',
    'Q16', 'Q17', 'Q18', 'Q19', 'Q20',
    'UTM_Source',
    'UTM_Medium',
    'UTM_Campaign',
    'Interest',
    'Message',
    'Page_URL'
  ];
  
  sheet.appendRow(headers);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a365d');
  headerRange.setFontColor('#ffffff');
}

// ============================================
// UTILITIES
// ============================================

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test functions (run manually in Apps Script editor)
function testQuiz() {
  const testData = {
    leadData: {
      email: 'test@example.com',
      timestamp: new Date().toISOString(),
      pageUrl: 'https://agentaicoach.com/',
      utm_source: 'google',
      utm_medium: 'organic'
    },
    answers: { 1: 5, 2: 4, 3: 3, 4: 4, 5: 5 },
    totalScore: 65,
    category: 'AI Active User'
  };
  
  const result = handleQuizSubmission(testData);
  console.log('Quiz result:', result.getContent());
}

function testContact() {
  const testData = {
    timestamp: new Date().toISOString(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    interest: 'coaching',
    role: 'agent',
    message: 'Interested in private coaching for my team.',
    pageUrl: 'https://agentaicoach.com/contact.html',
    source: 'contact-form'
  };
  
  const result = handleContactSubmission(testData);
  console.log('Contact result:', result.getContent());
}
