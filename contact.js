/**
 * AgentAICoach - Contact Form Module
 * 
 * Handles contact form submission and validation
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    // Google Apps Script Web App URL (shared across all forms)
    const CONTACT_FORM_URL = 'https://script.google.com/macros/s/AKfycbxHYhH891nT-dtEOzH3yTWFcB4cZxeOJ_NshkTw-_UFb6ED1NPMXo7aRjBLTkw_guGW/exec';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const elements = {
        form: document.getElementById('contact-form'),
        successMessage: document.getElementById('form-success'),
        phoneInput: document.getElementById('phone')
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        if (!elements.form) return;
        
        // Phone formatting
        if (elements.phoneInput) {
            elements.phoneInput.addEventListener('input', formatPhoneNumber);
        }
        
        // Form submission
        elements.form.addEventListener('submit', handleSubmit);
    }

    // ============================================
    // PHONE FORMATTING
    // ============================================
    
    function formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 10) {
            value = value.substring(0, 10);
            value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
        }
        
        e.target.value = value;
    }

    // ============================================
    // FORM HANDLING
    // ============================================
    
    function handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(elements.form);
        const data = {
            formType: 'contact',
            timestamp: new Date().toISOString(),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            interest: formData.get('interest'),
            role: formData.get('role') || '',
            message: formData.get('message'),
            pageUrl: window.location.href
        };
        
        // Show loading state
        const submitBtn = elements.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        submitBtn.disabled = true;
        
        // Submit to Google Sheets
        submitToSheets(data)
            .then(() => {
                showSuccess();
                trackSubmission('success');
            })
            .catch(error => {
                console.error('Submission error:', error);
                // Still show success - don't lose the lead
                showSuccess();
                trackSubmission('success-despite-error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    }

    // ============================================
    // GOOGLE SHEETS SUBMISSION
    // ============================================
    
    function submitToSheets(data) {
        // Placeholder check - replace YOUR_CONTACT_SCRIPT_ID with actual ID
        if (CONTACT_FORM_URL.includes('YOUR_CONTACT_SCRIPT_ID')) {
            console.warn('Contact form Google Sheets URL not configured. Data:', data);
            return Promise.resolve();
        }
        
        return fetch(CONTACT_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    // ============================================
    // UI FEEDBACK
    // ============================================
    
    function showSuccess() {
        elements.form.style.display = 'none';
        elements.successMessage.style.display = 'block';
        elements.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ============================================
    // ANALYTICS
    // ============================================
    
    function trackSubmission(result) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                event_category: 'Contact',
                event_label: result,
                value: 1
            });
        }
    }

    // ============================================
    // INITIALIZE
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
