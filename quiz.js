/**
 * AgentAICoach - Quiz Module
 * 
 * This module handles the AI Proficiency Quiz functionality including:
 * - 4-step quiz with 5 questions each (20 total)
 * - Progress tracking and navigation
 * - Scoring system with 5 categories
 * - Lead capture form
 * - Google Sheets submission via Apps Script
 * - Results display with recommendations
 */

(function() {
    'use strict';

    // ============================================
    // QUIZ DATA - 20 Questions across 4 categories
    // ============================================
    
    const quizData = {
        // Step 1: AI AWARENESS (Questions 1-5)
        awareness: [
            {
                id: 1,
                question: "How often do you currently use AI tools like ChatGPT, Claude, or Google Gemini?",
                category: "awareness",
                options: [
                    { text: "Never used them", score: 1 },
                    { text: "Tried once or twice out of curiosity", score: 2 },
                    { text: "Occasionally (1-2 times per month)", score: 3 },
                    { text: "Regularly (weekly)", score: 4 },
                    { text: "Daily - it's part of my workflow", score: 5 }
                ]
            },
            {
                id: 2,
                question: "Which of the following AI capabilities are you familiar with?",
                category: "awareness",
                options: [
                    { text: "I've heard of AI but don't know specific capabilities", score: 1 },
                    { text: "Basic text generation/chat only", score: 2 },
                    { text: "Text generation and image creation", score: 3 },
                    { text: "Multiple AI types including voice, image, and data analysis", score: 4 },
                    { text: "Advanced features like API integrations and automation", score: 5 }
                ]
            },
            {
                id: 3,
                question: "Which of these have you personally used AI for in your real estate business?",
                category: "awareness",
                options: [
                    { text: "None - I've only heard of AI but never used it", score: 1 },
                    { text: "Writing property descriptions only", score: 2 },
                    { text: "Listings + emails/communications", score: 3 },
                    { text: "Marketing content + analysis/reports", score: 4 },
                    { text: "Multiple workflows + automation systems", score: 5 }
                ]
            },
            {
                id: 4,
                question: "Have you explored automation tools like Zapier, Make, or similar platforms?",
                category: "awareness",
                options: [
                    { text: "Never heard of them", score: 1 },
                    { text: "Heard of them but never used", score: 2 },
                    { text: "Looked into them briefly", score: 3 },
                    { text: "Used them for simple tasks", score: 4 },
                    { text: "Have active automations running", score: 5 }
                ]
            },
            {
                id: 5,
                question: "If you could eliminate ONE task from your business using AI immediately, what would it be?",
                category: "awareness",
                options: [
                    { text: "I'm not sure - need to learn what's possible first", score: 1 },
                    { text: "Writing listings and property descriptions", score: 2 },
                    { text: "Following up with leads and clients", score: 3 },
                    { text: "Creating marketing content and social media", score: 4 },
                    { text: "Managing my systems and business operations", score: 5 }
                ]
            }
        ],

        // Step 2: WORKFLOW ADOPTION (Questions 6-10)
        workflow: [
            {
                id: 6,
                question: "Do you use AI for writing property descriptions?",
                category: "workflow",
                options: [
                    { text: "Never - I write everything manually", score: 1 },
                    { text: "I've tried it once or twice", score: 2 },
                    { text: "Occasionally for certain listings", score: 3 },
                    { text: "Most of my listings use AI assistance", score: 4 },
                    { text: "Always - AI is my standard process", score: 5 }
                ]
            },
            {
                id: 7,
                question: "How do you handle client communication and follow-ups?",
                category: "workflow",
                options: [
                    { text: "All manual - I write every email/message", score: 1 },
                    { text: "Templates I've created myself over time", score: 2 },
                    { text: "Occasionally use AI to refine messages", score: 3 },
                    { text: "AI-assisted for most communications", score: 4 },
                    { text: "Automated systems with AI personalization", score: 5 }
                ]
            },
            {
                id: 8,
                question: "Have you integrated AI with your CRM or email system?",
                category: "workflow",
                options: [
                    { text: "I don't use a CRM", score: 1 },
                    { text: "CRM but no AI integration", score: 2 },
                    { text: "Exported data to AI for analysis once", score: 3 },
                    { text: "Some manual AI-CRM workflows", score: 4 },
                    { text: "Fully integrated AI with my CRM/email", score: 5 }
                ]
            },
            {
                id: 9,
                question: "How do you create and manage marketing content?",
                category: "workflow",
                options: [
                    { text: "I don't create marketing content", score: 1 },
                    { text: "Create everything manually, no AI", score: 2 },
                    { text: "AI helps with ideas, I create and post", score: 3 },
                    { text: "AI generates most content, I post manually", score: 4 },
                    { text: "AI generates AND tools schedule/post automatically", score: 5 }
                ]
            },
            {
                id: 10,
                question: "Do you use AI for market analysis or client reports?",
                category: "workflow",
                options: [
                    { text: "What do you mean by AI market analysis?", score: 1 },
                    { text: "I pull data manually from MLS/reports", score: 2 },
                    { text: "I've used AI to summarize data I've gathered", score: 3 },
                    { text: "Regularly use AI to analyze and present data", score: 4 },
                    { text: "Automated reports generated by AI systems", score: 5 }
                ]
            }
        ],

        // Step 3: IMPLEMENTATION READINESS (Questions 11-15)
        readiness: [
            {
                id: 11,
                question: "How much time can you dedicate to learning and implementing AI?",
                category: "readiness",
                options: [
                    { text: "Very limited - maybe 30 min/week", score: 1 },
                    { text: "1-2 hours per week", score: 2 },
                    { text: "3-4 hours per week", score: 3 },
                    { text: "5-10 hours per week", score: 4 },
                    { text: "Dedicated time to master this", score: 5 }
                ]
            },
            {
                id: 12,
                question: "What's your budget for AI tools and training?",
                category: "readiness",
                options: [
                    { text: "Minimal - looking for free options", score: 1 },
                    { text: "Under $500 total", score: 2 },
                    { text: "$500-$1,000 for the right solution", score: 3 },
                    { text: "$1,000-$3,000 if ROI is clear", score: 4 },
                    { text: "Flexible for systems that deliver results", score: 5 }
                ]
            },
            {
                id: 13,
                question: "Which best describes your ability to set up new tools or systems?",
                category: "readiness",
                options: [
                    { text: "I need step-by-step help with everything", score: 1 },
                    { text: "I can follow tutorials and documentation", score: 2 },
                    { text: "I can figure things out myself", score: 3 },
                    { text: "I can connect tools together", score: 4 },
                    { text: "I build and customize systems", score: 5 }
                ]
            },
            {
                id: 14,
                question: "Do you have team members or an assistant who could help implement AI?",
                category: "readiness",
                options: [
                    { text: "Solo operator - it's just me", score: 1 },
                    { text: "I have a part-time assistant occasionally", score: 2 },
                    { text: "I have an assistant 10-20 hrs/week", score: 3 },
                    { text: "I have a team or full-time assistant", score: 4 },
                    { text: "Multiple team members to implement", score: 5 }
                ]
            },
            {
                id: 15,
                question: "How quickly do you need to see ROI from AI?",
                category: "readiness",
                options: [
                    { text: "I need immediate time savings", score: 1 },
                    { text: "Within 2-4 weeks would be ideal", score: 2 },
                    { text: "30-60 days is reasonable", score: 3 },
                    { text: "I'm willing to invest 90 days for significant results", score: 4 },
                    { text: "Long-term transformation is my focus", score: 5 }
                ]
            }
        ],

        // Step 4: BUSINESS GOALS (Questions 16-20)
        goals: [
            {
                id: 16,
                question: "What's your PRIMARY goal with AI?",
                category: "goals",
                options: [
                    { text: "Save time on administrative tasks", score: 1 },
                    { text: "Improve quality of marketing/content", score: 2 },
                    { text: "Both time savings AND quality improvements", score: 3 },
                    { text: "Scale without adding headcount", score: 4 },
                    { text: "Transform my entire business model", score: 5 }
                ]
            },
            {
                id: 17,
                question: "How many transactions do you close per year?",
                category: "goals",
                options: [
                    { text: "0-5 (getting started or part-time)", score: 1 },
                    { text: "6-15 (growing business)", score: 2 },
                    { text: "16-30 (established producer)", score: 3 },
                    { text: "31-50 (high volume)", score: 4 },
                    { text: "50+ (top producer/team leader)", score: 5 }
                ]
            },
            {
                id: 18,
                question: "What's your biggest time drain currently?",
                category: "goals",
                options: [
                    { text: "Administrative paperwork and data entry", score: 1 },
                    { text: "Writing listings and descriptions", score: 2 },
                    { text: "Client follow-up and communication", score: 3 },
                    { text: "Marketing content creation", score: 4 },
                    { text: "Managing my team and systems", score: 5 }
                ]
            },
            {
                id: 19,
                question: "Where do you see AI fitting in your business in 12 months?",
                category: "goals",
                options: [
                    { text: "Helpful for occasional tasks", score: 1 },
                    { text: "Regular assistance with specific workflows", score: 2 },
                    { text: "Integrated into most daily activities", score: 3 },
                    { text: "Central to how I operate", score: 4 },
                    { text: "Fully automated, AI-first business model", score: 5 }
                ]
            },
            {
                id: 20,
                question: "Are you willing to invest in building custom AI systems?",
                category: "goals",
                options: [
                    { text: "No custom systems - keep it simple", score: 1 },
                    { text: "Maybe in the future, not now", score: 2 },
                    { text: "Open to it if DIY options don't work", score: 3 },
                    { text: "Interested in hybrid approach", score: 4 },
                    { text: "Ready for custom AI solutions now", score: 5 }
                ]
            }
        ]
    };

    // Flatten questions array for easier iteration
    const allQuestions = [
        ...quizData.awareness,
        ...quizData.workflow,
        ...quizData.readiness,
        ...quizData.goals
    ];

    // ============================================
    // SCORING CATEGORIES
    // ============================================
    
    const scoreCategories = [
        {
            name: "AI Beginner",
            minScore: 0,
            maxScore: 40,
            icon: "🌱",
            color: "#86efac",
            description: "You're at the beginning of your AI journey. There's tremendous opportunity ahead to transform your business.",
            recommendation: "diy",
            recommendationTitle: "AI Quick Start",
            recommendationText: "A 35-45 minute on-demand video with actionable AI strategies you can implement immediately.",
            price: "$47"
        },
        {
            name: "AI Emerging",
            minScore: 41,
            maxScore: 60,
            icon: "🌿",
            color: "#67e8f9",
            description: "You've dipped your toes in AI waters. You understand the basics and are ready to apply them systematically.",
            recommendation: "diy",
            recommendationTitle: "AI Quick Start",
            recommendationText: "Get actionable AI strategies fast. 50+ prompt templates and step-by-step implementation guide.",
            price: "$47"
        },
        {
            name: "AI Active User",
            minScore: 61,
            maxScore: 75,
            icon: "🚀",
            color: "#60a5fa",
            description: "You're actively using AI and seeing benefits. You need guided implementation to scale your workflows.",
            recommendation: "guided",
            recommendationTitle: "Guided Implementation",
            recommendationText: "4-week structured program with live sessions, custom prompt development, and accountability to implement AI in your specific business.",
            price: "$1,299"
        },
        {
            name: "AI Advanced",
            minScore: 76,
            maxScore: 90,
            icon: "⚡",
            color: "#a78bfa",
            description: "You're ahead of most agents. You need systems-level automation and advanced custom implementations.",
            recommendation: "elite",
            recommendationTitle: "Elite AI Systems",
            recommendationText: "Custom automation builds for your business. Starts with a $500 audit, then module-based pricing from $750-$2,000 per system.",
            price: "Modular"
        },
        {
            name: "AI-Ready Leader",
            minScore: 91,
            maxScore: 100,
            icon: "👑",
            color: "#fbbf24",
            description: "You're an AI power user ready for full business transformation. You want maximum leverage through custom systems.",
            recommendation: "elite",
            recommendationTitle: "Elite AI Systems",
            recommendationText: "Comprehensive business audit + custom AI systems built to your specifications. Designed for top producers and teams.",
            price: "Modular"
        }
    ];

    // ============================================
    // GOOGLE SHEETS CONFIGURATION
    // Update this URL with your deployed Apps Script web app URL
    // ============================================
    
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxHYhH891nT-dtEOzH3yTWFcB4cZxeOJ_NshkTw-_UFb6ED1NPMXo7aRjBLTkw_guGW/exec';

    // ============================================
    // QUIZ STATE
    // ============================================
    
    const quizState = {
        currentQuestion: 0,
        currentStep: 1,
        answers: {}, // { questionId: score }
        totalScore: 0,
        utmParams: {},
        isSubmitting: false
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const elements = {};

    function cacheElements() {
        elements.quizContainer = document.getElementById('quiz-app');
        elements.quizProgress = document.getElementById('quiz-progress');
        elements.progressFill = document.getElementById('progress-fill');
        elements.progressText = document.getElementById('progress-text');
        elements.quizIntro = document.getElementById('quiz-intro');
        elements.quizContent = document.getElementById('quiz-content');
        elements.questionContainer = document.getElementById('question-container');
        elements.stepIndicator = document.getElementById('step-indicator');
        elements.prevBtn = document.getElementById('prev-btn');
        elements.nextBtn = document.getElementById('next-btn');
        elements.startQuizBtn = document.getElementById('start-quiz');
        elements.leadForm = document.getElementById('lead-form');
        elements.captureForm = document.getElementById('capture-form');
        elements.quizResults = document.getElementById('quiz-results');
        elements.resultBadge = document.getElementById('result-badge');
        elements.resultScore = document.getElementById('result-score');
        elements.resultTitle = document.getElementById('result-title');
        elements.resultDescription = document.getElementById('result-description');
        elements.recommendationContent = document.getElementById('recommendation-content');
        elements.retakeBtn = document.getElementById('retake-quiz');
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        cacheElements();
        captureUTMParams();
        bindEvents();
    }

    function captureUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
            if (urlParams.has(param)) {
                quizState.utmParams[param] = urlParams.get(param);
            }
        });
    }

    function bindEvents() {
        if (elements.startQuizBtn) {
            elements.startQuizBtn.addEventListener('click', startQuiz);
        }
        
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', handleNext);
        }
        
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', handlePrev);
        }
        
        if (elements.captureForm) {
            elements.captureForm.addEventListener('submit', handleFormSubmit);
        }
        
        if (elements.retakeBtn) {
            elements.retakeBtn.addEventListener('click', resetQuiz);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (elements.quizContent.style.display === 'none') return;
            
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        });

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', handleShare);
        });
    }

    // ============================================
    // QUIZ NAVIGATION
    // ============================================
    
    function startQuiz() {
        elements.quizIntro.style.display = 'none';
        elements.quizProgress.classList.add('active');
        elements.quizContent.style.display = 'block';
        
        // Reset state
        quizState.currentQuestion = 0;
        quizState.currentStep = 1;
        quizState.answers = {};
        quizState.totalScore = 0;
        
        updateProgress();
        renderQuestion();
        updateStepIndicator();
        updateNavButtons();

        // Scroll to quiz
        elements.quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderQuestion() {
        const question = allQuestions[quizState.currentQuestion];
        
        const html = `
            <div class="question" data-question-id="${question.id}">
                <span class="question-number">Question ${quizState.currentQuestion + 1} of ${allQuestions.length}</span>
                <h4>${question.question}</h4>
                <div class="answers">
                    ${question.options.map((option, index) => `
                        <label class="answer-option ${quizState.answers[question.id] === option.score ? 'selected' : ''}" data-score="${option.score}">
                            <input type="radio" name="q${question.id}" value="${option.score}" 
                                ${quizState.answers[question.id] === option.score ? 'checked' : ''}>
                            <span>${option.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        elements.questionContainer.innerHTML = html;
        
        // Bind answer click events
        elements.questionContainer.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', () => selectAnswer(option));
        });
    }

    function selectAnswer(optionElement) {
        const question = allQuestions[quizState.currentQuestion];
        const score = parseInt(optionElement.dataset.score);
        const answerText = optionElement.querySelector('span').textContent;
        
        // Update visual selection
        elements.questionContainer.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        optionElement.classList.add('selected');
        
        // Store answer (score + text)
        quizState.answers[question.id] = {
            score: score,
            text: answerText
        };
        
        // Auto-advance after short delay for better UX
        setTimeout(() => {
            if (quizState.currentQuestion < allQuestions.length - 1) {
                handleNext();
            } else {
                // On last question, show lead form instead of auto-advancing
                transitionToLeadForm();
            }
        }, 400);
    }

    function handleNext() {
        const question = allQuestions[quizState.currentQuestion];
        
        // Validate answer is selected
        const currentAnswer = quizState.answers[question.id];
        if (!currentAnswer || currentAnswer.score === undefined) {
            // Shake animation to indicate error
            const answersDiv = elements.questionContainer.querySelector('.answers');
            if (answersDiv) {
                answersDiv.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    answersDiv.style.animation = '';
                }, 500);
            }
            return;
        }
        
        if (quizState.currentQuestion < allQuestions.length - 1) {
            quizState.currentQuestion++;
            updateStepFromQuestion();
            updateProgress();
            renderQuestion();
            updateStepIndicator();
            updateNavButtons();
        } else {
            // Last question answered, show lead form
            transitionToLeadForm();
        }
    }

    function handlePrev() {
        if (quizState.currentQuestion > 0) {
            quizState.currentQuestion--;
            updateStepFromQuestion();
            updateProgress();
            renderQuestion();
            updateStepIndicator();
            updateNavButtons();
        }
    }

    function updateStepFromQuestion() {
        // Determine step based on question index
        if (quizState.currentQuestion < 5) {
            quizState.currentStep = 1;
        } else if (quizState.currentQuestion < 10) {
            quizState.currentStep = 2;
        } else if (quizState.currentQuestion < 15) {
            quizState.currentStep = 3;
        } else {
            quizState.currentStep = 4;
        }
    }

    function updateStepIndicator() {
        const labels = elements.stepIndicator.querySelectorAll('.step-label');
        labels.forEach((label, index) => {
            label.classList.remove('active', 'completed');
            if (index + 1 === quizState.currentStep) {
                label.classList.add('active');
            } else if (index + 1 < quizState.currentStep) {
                label.classList.add('completed');
            }
        });
    }

    function updateProgress() {
        const progress = ((quizState.currentQuestion + 1) / allQuestions.length) * 100;
        elements.progressFill.style.width = `${progress}%`;
        
        const stepNames = ['Awareness', 'Workflow', 'Readiness', 'Goals'];
        elements.progressText.textContent = `Step ${quizState.currentStep} of 4: ${stepNames[quizState.currentStep - 1]}`;
    }

    function updateNavButtons() {
        elements.prevBtn.style.display = quizState.currentQuestion > 0 ? 'flex' : 'none';
        elements.nextBtn.textContent = quizState.currentQuestion === allQuestions.length - 1 ? 'Finish' : 'Next';
    }

    function transitionToLeadForm() {
        elements.quizContent.style.display = 'none';
        elements.quizProgress.classList.remove('active');
        elements.leadForm.style.display = 'block';
        elements.leadForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ============================================
    // LEAD FORM & RESULTS
    // ============================================
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (quizState.isSubmitting) return;
        quizState.isSubmitting = true;
        
        // Get form data
        const formData = new FormData(elements.captureForm);
        const leadData = {
            email: formData.get('email'),
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href,
            ...quizState.utmParams
        };
        
        // Calculate score from answer objects
        quizState.totalScore = Object.values(quizState.answers).reduce((sum, answer) => sum + answer.score, 0);
        
        // Show loading state
        const submitBtn = elements.captureForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
        submitBtn.disabled = true;
        
        // Submit to Google Sheets
        submitToGoogleSheets(leadData, quizState.answers, quizState.totalScore)
            .then(() => {
                showResults();
            })
            .catch(error => {
                console.error('Submission error:', error);
                // Still show results even if submission fails
                showResults();
            })
            .finally(() => {
                quizState.isSubmitting = false;
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    }

    function submitToGoogleSheets(leadData, answers, totalScore) {
        // If using the default placeholder URL, simulate success
        if (GOOGLE_SHEETS_URL.includes('YOUR_SCRIPT_ID')) {
            console.warn('Google Sheets URL not configured. Please update GOOGLE_SHEETS_URL in quiz.js');
            return Promise.resolve();
        }
        
        // Build answer texts for readable display
        const answerTexts = {};
        for (let i = 1; i <= 20; i++) {
            if (answers[i] && answers[i].text) {
                answerTexts[i] = answers[i].text;
            }
        }
        
        const payload = {
            leadData: leadData,
            answers: answers,
            answerTexts: answerTexts,
            totalScore: totalScore,
            category: getScoreCategory(totalScore).name
        };
        
        return fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    }

    function getScoreCategory(score) {
        return scoreCategories.find(cat => score >= cat.minScore && score <= cat.maxScore) || scoreCategories[0];
    }

    function showResults() {
        elements.leadForm.style.display = 'none';
        elements.quizResults.style.display = 'block';
        elements.quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        const category = getScoreCategory(quizState.totalScore);
        
        // Render results
        elements.resultBadge.textContent = category.icon;
        elements.resultBadge.style.background = category.color;
        elements.resultScore.textContent = `${quizState.totalScore}/100`;
        elements.resultTitle.textContent = category.name;
        elements.resultDescription.textContent = category.description;
        
        // Render recommendation
        let recommendationHtml = '';
        
        if (category.recommendation === 'diy') {
            recommendationHtml = `
                <strong>${category.recommendationTitle} — ${category.price}</strong>
                <p>${category.recommendationText}</p>
                <ul style="text-align: left; margin-top: 16px;">
                    <li>35-45 minute on-demand video</li>
                    <li>50+ real estate prompt templates</li>
                    <li>Step-by-step implementation guide</li>
                    <li>Instant access after purchase</li>
                    <li>Works on any device, anytime</li>
                </ul>
                <p style="margin-top: 16px;">
                    <a href="consultation.html?service=diy" class="btn btn-primary">Get Access — $47</a>
                </p>
                <p style="font-size: 0.9rem; color: #64748b; margin-top: 8px;">Not sure? Book a free 15-minute call to discuss if this is right for you.</p>
            `;
        } else if (category.recommendation === 'guided') {
            recommendationHtml = `
                <strong>${category.recommendationTitle} — ${category.price}</strong>
                <p>${category.recommendationText}</p>
                <ul style="text-align: left; margin-top: 16px;">
                    <li>4 weekly live sessions (Zoom)</li>
                    <li>Custom prompts for YOUR business</li>
                    <li>1-on-1 workflow optimization</li>
                    <li>DIY course included as reference</li>
                </ul>
                <p style="margin-top: 16px;">
                    <a href="consultation.html?service=guided" class="btn btn-primary">Book Free Consultation — $1,299</a>
                </p>
                <p style="font-size: 0.9rem; color: #64748b; margin-top: 8px;">Book a free 15-minute call to discuss your goals and see if this program fits.</p>
            `;
        } else {
            recommendationHtml = `
                <strong>${category.recommendationTitle} — ${category.price} Pricing</strong>
                <p>${category.recommendationText}</p>
                <ul style="text-align: left; margin-top: 16px;">
                    <li>Business AI audit — $500</li>
                    <li>Lead intake automation — $1,500</li>
                    <li>Listing marketing system — $1,000</li>
                    <li>Content automation — $750</li>
                    <li>Custom data systems (Lis Pendens-style) — $2,000+</li>
                </ul>
                <p style="margin-top: 16px;">
                    <a href="consultation.html?service=elite" class="btn btn-primary">Book Free Build Consultation</a>
                </p>
                <p style="font-size: 0.9rem; color: #64748b; margin-top: 8px;">Free 15-minute consultation to discuss your business needs and custom build options.</p>
            `;
        }
        
        elements.recommendationContent.innerHTML = recommendationHtml;
        
        // Track completion (if analytics is available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_complete', {
                event_category: 'Quiz',
                event_label: category.name,
                value: quizState.totalScore
            });
        }
    }

    function resetQuiz() {
        elements.quizResults.style.display = 'none';
        quizState.currentQuestion = 0;
        quizState.currentStep = 1;
        quizState.answers = {};
        quizState.totalScore = 0;
        quizState.isSubmitting = false;
        
        // Reset form
        elements.captureForm.reset();
        
        // Show intro
        elements.quizIntro.style.display = 'block';
        elements.quizProgress.classList.remove('active');
        
        elements.quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ============================================
    // SOCIAL SHARING
    // ============================================
    
    function handleShare(e) {
        const platform = e.target.dataset.platform;
        const category = getScoreCategory(quizState.totalScore);
        const text = `I scored ${quizState.totalScore}/100 on the AgentAICoach AI Proficiency Quiz! I'm a "${category.name}". Take the quiz to discover your AI readiness level.`;
        const url = window.location.href.split('?')[0];
        
        let shareUrl = '';
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent('My AI Proficiency Score')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // ============================================
    // EXPOSE API FOR EXTERNAL USE
    // ============================================
    
    window.AgentAIQuiz = {
        start: startQuiz,
        reset: resetQuiz,
        getState: () => ({ ...quizState }),
        getCategories: () => [...scoreCategories],
        getQuestions: () => [...allQuestions]
    };

    // ============================================
    // INITIALIZE WHEN DOM IS READY
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// Add shake animation for error feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
