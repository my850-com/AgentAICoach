/**
 * AgentAICoach Google Apps Script - Web App
 * Handles: Quiz submissions, Contact forms, Consultation bookings
 * Emails: lars@my850.com, luis@my850.com on every submission
 * Stores: Google Sheets for all data
 */

const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with your Google Sheet ID
const EMAIL_RECIPIENTS = ['lars@my850.com', 'luis@my850.com'];
const FROM_EMAIL = 'my850@agentmail.to';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Route based on form type
    if (data.formType === 'quiz') {
      return handleQuizSubmission(sheet, data);
    } else if (data.formType === 'contact') {
      return handleContactSubmission(sheet, data);
    } else if (data.formType === 'consultation') {
      return handleConsultationSubmission(sheet, data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Unknown form type'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleQuizSubmission(sheet, data) {
  // Quiz results sheet
  const quizSheet = sheet.getSheetByName('Quiz Results') || sheet.insertSheet('Quiz Results');
  
  // Headers if first row
  if (quizSheet.getLastRow() === 0) {
    quizSheet.appendRow([
      'Timestamp', 'Email', 'Total Score', 'Category', 'DIY Course Interest', 'Coaching Interest', 'Custom Interest',
      'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
      'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18', 'Q19', 'Q20',
      'UTM Source', 'UTM Medium', 'UTM Campaign', 'Page URL'
    ]);
  }
  
  // Add row
  quizSheet.appendRow([
    new Date(),
    data.email,
    data.totalScore,
    data.category,
    data.recommendations?.diy ? 'Yes' : 'No',
    data.recommendations?.coaching ? 'Yes' : 'No',
    data.recommendations?.custom ? 'Yes' : 'No',
    ...data.answers,
    data.utmParams?.utm_source || '',
    data.utmParams?.utm_medium || '',
    data.utmParams?.utm_campaign || '',
    data.pageUrl || ''
  ]);
  
  // Send notification email
  const emailBody = `
NEW QUIZ SUBMISSION
=================

Email: ${data.email}
Score: ${data.totalScore}/100
Category: ${data.category}
Timestamp: ${new Date().toLocaleString()}

RECOMMENDED PATHS:
- DIY Course: ${data.recommendations?.diy ? 'YES' : 'No'}
- Guided Implementation: ${data.recommendations?.coaching ? 'YES' : 'No'}
- Elite Systems: ${data.recommendations?.custom ? 'YES' : 'No'}

ANSWERS:
${Object.entries(data.answers).map(([q, a]) => `Q${q}: ${a}`).join('\n')}

View in Google Sheets: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit
  `;
  
  EMAIL_RECIPIENTS.forEach(recipient => {
    MailApp.sendEmail({
      to: recipient,
      from: FROM_EMAIL,
      subject: `🎯 New Quiz: ${data.category} (${data.totalScore}/100)`,
      body: emailBody
    });
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Quiz submitted successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleContactSubmission(sheet, data) {
  // Contact submissions sheet
  const contactSheet = sheet.getSheetByName('Contact Submissions') || sheet.insertSheet('Contact Submissions');
  
  if (contactSheet.getLastRow() === 0) {
    contactSheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Interest', 'Role', 'Message']);
  }
  
  contactSheet.appendRow([
    new Date(),
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.interest,
    data.role,
    data.message
  ]);
  
  // Send email notification
  const emailBody = `
NEW CONTACT FORM SUBMISSION
===========================

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Interest: ${data.interest}
Role: ${data.role}
Message:
${data.message}

View in Google Sheets: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit
  `;
  
  EMAIL_RECIPIENTS.forEach(recipient => {
    MailApp.sendEmail({
      to: recipient,
      from: FROM_EMAIL,
      subject: `📧 New Contact: ${data.firstName} ${data.lastName} - ${data.interest}`,
      body: emailBody
    });
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Contact form submitted successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleConsultationSubmission(sheet, data) {
  // Consultation bookings sheet
  const consultSheet = sheet.getSheetByName('Consultation Bookings') || sheet.insertSheet('Consultation Bookings');
  
  if (consultSheet.getLastRow() === 0) {
    consultSheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Preferred Date', 'Preferred Time', 'Service Interest', 'Notes', 'Status']);
  }
  
  consultSheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone,
    data.preferredDate,
    data.preferredTime,
    data.serviceInterest,
    data.notes,
    'PENDING'
  ]);
  
  // Send email notification
  const emailBody = `
NEW CONSULTATION REQUEST
========================

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

PREFERRED SCHEDULE:
Date: ${data.preferredDate}
Time: ${data.preferredTime}

SERVICE INTEREST: ${data.serviceInterest}

NOTES:
${data.notes}

ACTION REQUIRED:
Confirm booking and send calendar invite to ${data.email}

View in Google Sheets: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit
  `;
  
  EMAIL_RECIPIENTS.forEach(recipient => {
    MailApp.sendEmail({
      to: recipient,
      from: FROM_EMAIL,
      subject: `📅 BOOK CONSULTATION: ${data.name} - ${data.preferredDate} @ ${data.preferredTime}`,
      body: emailBody
    });
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Consultation request submitted successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

// For testing
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'AgentAICoach Web App is running'
  })).setMimeType(ContentService.MimeType.JSON);
}
