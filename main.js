/**
 * AgentAICoach - Main JavaScript Module
 * 
 * This module provides supporting functionality for the website including:
 * - Smooth scrolling for anchor links
 * - Mobile navigation toggle
 * - Scroll-based animation triggers
 * - UTM parameter capture
 * - Form validation utilities
 * - Navbar scroll effects
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const config = {
        // Animation settings
        animation: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },
        // Smooth scroll offset (accounts for fixed navbar)
        scrollOffset: 80,
        // Mobile breakpoint
        mobileBreakpoint: 768
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Debounce function to limit how often a function can fire
     * @param {Function} func - Function to debounce
     * @param {number} wait - Milliseconds to wait
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit execution rate
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     * @param {Element} element - DOM element to check
     * @returns {boolean}
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    
    function initSmoothScroll() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#" or empty
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    // Calculate scroll position with offset
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - config.scrollOffset;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping
                    history.pushState(null, null, href);
                    
                    // Close mobile nav if open
                    closeMobileNav();
                }
            });
        });
        
        // Handle initial hash on page load
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(() => {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - config.scrollOffset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    
    let navToggle = null;
    let navLinks = null;
    let isNavOpen = false;

    function initMobileNav() {
        navToggle = document.querySelector('.nav-toggle');
        navLinks = document.querySelector('.nav-links');
        
        if (!navToggle || !navLinks) return;
        
        navToggle.addEventListener('click', toggleMobileNav);
        
        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (isNavOpen && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });
        
        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isNavOpen) {
                closeMobileNav();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > config.mobileBreakpoint && isNavOpen) {
                closeMobileNav();
            }
        }, 250));
    }

    function toggleMobileNav() {
        isNavOpen = !isNavOpen;
        navToggle.classList.toggle('active', isNavOpen);
        navLinks.classList.toggle('active', isNavOpen);
        
        // Prevent body scroll when nav is open
        document.body.style.overflow = isNavOpen ? 'hidden' : '';
        
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', isNavOpen.toString());
        navLinks.setAttribute('aria-hidden', (!isNavOpen).toString());
    }

    function closeMobileNav() {
        if (!isNavOpen) return;
        isNavOpen = false;
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
    }

    // ============================================
    // NAVBAR SCROLL EFFECTS
    // ============================================
    
    let navbar = null;
    let lastScrollY = 0;
    let scrollDirection = 'up';

    function initNavbarEffects() {
        navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        // Add scrolled class on scroll
        window.addEventListener('scroll', throttle(() => {
            const currentScrollY = window.pageYOffset;
            
            // Determine scroll direction
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional - uncomment to enable)
            // if (currentScrollY > 200) {
            //     navbar.style.transform = scrollDirection === 'down' ? 'translateY(-100%)' : 'translateY(0)';
            // } else {
            //     navbar.style.transform = 'translateY(0)';
            // }
        }, 100));
    }

    // ============================================
    // ANIMATION TRIGGERS
    // ============================================
    
    function initAnimations() {
        // Add animate-in class to elements that should animate
        const animatedElements = document.querySelectorAll(
            '.problem-card, .step, .audience-card, .service-card, ' +
            '.testimonial-card, .faq-item, .section-header'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('animate-in');
        });
        
        // Use Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optionally unobserve after animation
                        // observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: config.animation.threshold,
                rootMargin: config.animation.rootMargin
            });
            
            document.querySelectorAll('.animate-in').forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('.animate-in').forEach(el => {
                el.classList.add('visible');
            });
        }
        
        // Counter animation for stats
        initCounterAnimation();
    }

    /**
     * Animate counter numbers in hero stats
     */
    function initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element) => {
            const text = element.textContent;
            const number = parseFloat(text.replace(/[^0-9.]/g, ''));
            const suffix = text.replace(/[0-9.]/g, '');
            const isDecimal = text.includes('.');
            
            if (!number || element.dataset.animated) return;
            
            element.dataset.animated = 'true';
            
            const duration = 2000; // 2 seconds
            const steps = 60;
            const stepTime = duration / steps;
            const increment = number / steps;
            let current = 0;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(counter);
                }
                element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            }, stepTime);
        };
        
        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statNumbers.forEach(el => counterObserver.observe(el));
        } else {
            statNumbers.forEach(el => animateCounter(el));
        }
    }

    // ============================================
    // UTM PARAMETER CAPTURE
    // ============================================
    
    /**
     * Captures UTM parameters from URL and stores in localStorage
     * Also populates hidden form fields if they exist
     */
    function initUTMCapture() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {};
        
        // Standard UTM parameters
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        
        utmParams.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                utmData[param] = value;
            }
        });
        
        // Additional tracking parameters
        const extraParams = ['ref', 'source', 'fbclid', 'gclid'];
        extraParams.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                utmData[param] = value;
            }
        });
        
        // Store in localStorage if any UTM data exists
        if (Object.keys(utmData).length > 0) {
            try {
                const existingData = JSON.parse(localStorage.getItem('agentai_utm') || '{}');
                localStorage.setItem('agentai_utm', JSON.stringify({ ...existingData, ...utmData, timestamp: new Date().toISOString() }));
            } catch (e) {
                console.warn('Unable to store UTM data:', e);
            }
        }
        
        // Populate hidden form fields
        populateUTMFields(utmData);
    }

    /**
     * Populate hidden form fields with UTM data
     * @param {Object} utmData - UTM parameter data
     */
    function populateUTMFields(utmData) {
        Object.keys(utmData).forEach(key => {
            // Look for existing hidden fields
            const field = document.querySelector(`input[name="${key}"]`);
            if (field) {
                field.value = utmData[key];
            }
        });
    }

    /**
     * Get stored UTM data
     * @returns {Object} UTM data from localStorage or empty object
     */
    window.getUTMData = function() {
        try {
            return JSON.parse(localStorage.getItem('agentai_utm') || '{}');
        } catch (e) {
            return {};
        }
    };

    /**
     * Clear stored UTM data
     */
    window.clearUTMData = function() {
        localStorage.removeItem('agentai_utm');
    };

    // ============================================
    // FORM VALIDATION
    // ============================================
    
    function initFormValidation() {
        // Generic form validation for all forms
        document.querySelectorAll('form').forEach(form => {
            // Skip forms with novalidate attribute
            if (form.hasAttribute('novalidate')) return;
            
            form.addEventListener('submit', function(e) {
                let hasError = false;
                
                // Validate required fields
                form.querySelectorAll('[required]').forEach(field => {
                    if (!validateField(field)) {
                        hasError = true;
                        showFieldError(field);
                    } else {
                        clearFieldError(field);
                    }
                });
                
                if (hasError) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Focus first error field
                    const firstError = form.querySelector('.field-error');
                    if (firstError) {
                        firstError.focus();
                    }
                }
            });
            
            // Real-time validation on blur
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('blur', () => {
                    if (field.hasAttribute('required') || field.value) {
                        if (validateField(field)) {
                            clearFieldError(field);
                        }
                    }
                });
                
                // Clear error on input
                field.addEventListener('input', () => {
                    clearFieldError(field);
                });
            });
        });
        
        // Phone number formatting
        initPhoneFormatting();
        
        // Email validation helper
        initEmailValidation();
    }

    /**
     * Validate a single field
     * @param {HTMLInputElement} field - Field to validate
     * @returns {boolean} Is valid
     */
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        
        // Required check
        if (field.hasAttribute('required') && !value) {
            return false;
        }
        
        // Type-specific validation
        if (value) {
            switch(type) {
                case 'email':
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                case 'tel':
                    return value.replace(/\D/g, '').length >= 10;
                case 'url':
                    try {
                        new URL(value);
                        return true;
                    } catch {
                        return false;
                    }
            }
        }
        
        // Pattern validation
        if (field.pattern && value) {
            const regex = new RegExp(field.pattern);
            return regex.test(value);
        }
        
        // Min/max length
        if (field.minLength && value.length < field.minLength) return false;
        if (field.maxLength && value.length > field.maxLength) return false;
        
        return true;
    }

    /**
     * Show error state on field
     * @param {HTMLInputElement} field - Field to show error on
     */
    function showFieldError(field) {
        field.classList.add('field-error');
        
        // Find or create error message
        let errorEl = field.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            field.parentElement.appendChild(errorEl);
        }
        
        errorEl.textContent = getErrorMessage(field);
        field.setAttribute('aria-invalid', 'true');
    }

    /**
     * Clear error state from field
     * @param {HTMLInputElement} field - Field to clear error from
     */
    function clearFieldError(field) {
        field.classList.remove('field-error');
        field.removeAttribute('aria-invalid');
        
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }

    /**
     * Get appropriate error message for field
     * @param {HTMLInputElement} field - Field to get message for
     * @returns {string} Error message
     */
    function getErrorMessage(field) {
        if (field.dataset.errorMessage) {
            return field.dataset.errorMessage;
        }
        
        if (!field.value.trim()) {
            return 'This field is required';
        }
        
        switch(field.type) {
            case 'email':
                return 'Please enter a valid email address';
            case 'tel':
                return 'Please enter a valid phone number';
            case 'url':
                return 'Please enter a valid URL';
            default:
                return 'Please check your input';
        }
    }

    /**
     * Format phone numbers as user types
     */
    function initPhoneFormatting() {
        document.querySelectorAll('input[type="tel"]').forEach(phoneInput => {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 10) {
                    // Format as (XXX) XXX-XXXX
                    value = value.substring(0, 10);
                    const areaCode = value.substring(0, 3);
                    const prefix = value.substring(3, 6);
                    const line = value.substring(6, 10);
                    value = `(${areaCode}) ${prefix}-${line}`;
                }
                
                e.target.value = value;
            });
        });
    }

    /**
     * Email validation debounced
     */
    function initEmailValidation() {
        document.querySelectorAll('input[type="email"]').forEach(emailInput => {
            emailInput.addEventListener('blur', debounce((e) => {
                const email = e.target.value.trim();
                if (email && !validateField(e.target)) {
                    showFieldError(e.target);
                }
            }, 300));
        });
    }

    // ============================================
    // LAZY LOADING
    // ============================================
    
    function initLazyLoading() {
        // Lazy load images with data-src attribute
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ============================================
    // PERFORMANCE UTILITIES
    // ============================================
    
    /**
     * Add passive event listeners where supported
     */
    function initPassiveEvents() {
        // Check for passive support
        let passiveSupported = false;
        try {
            const options = {
                get passive() {
                    passiveSupported = true;
                    return true;
                }
            };
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (err) {
            passiveSupported = false;
        }
        
        // Use passive listeners for scroll events
        if (passiveSupported) {
            window.addEventListener('scroll', () => {}, { passive: true });
            window.addEventListener('touchstart', () => {}, { passive: true });
        }
    }

    /**
     * Preload critical resources
     */
    function preloadResources() {
        // Preload fonts
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }

    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    
    function initAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main-content id to first section if not present
        const firstSection = document.querySelector('section');
        if (firstSection && !document.getElementById('main-content')) {
            firstSection.id = 'main-content';
        }
        
        // Add styles for skip link
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: #1a365d;
                color: white;
                padding: 8px 16px;
                z-index: 9999;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                border-radius: 0 0 4px 0;
                transition: top 0.3s;
            }
            .skip-link:focus {
                top: 0;
                outline: none;
            }
            .field-error {
                border-color: #ef4444 !important;
            }
            .error-message {
                display: block;
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 4px;
            }
        `;
        document.head.appendChild(style);
        
        // Focus management for modals (if any are added)
        initFocusManagement();
    }

    /**
     * Manage focus for accessibility
     */
    function initFocusManagement() {
        // Track last focused element before modal
        let lastFocusedElement = null;
        
        window.saveFocus = function() {
            lastFocusedElement = document.activeElement;
        };
        
        window.restoreFocus = function() {
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };
        
        // Trap focus within modal
        window.trapFocus = function(element) {
            const focusableElements = element.querySelectorAll(
                'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
            
            firstElement.focus();
        };
    }

    // ============================================
    // ANALYTICS & TRACKING
    // ============================================
    
    function initTracking() {
        // Track CTA button clicks
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.textContent.trim();
                trackEvent('cta_click', 'Button', text);
            });
        });
        
        // Track navigation clicks
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                const href = this.getAttribute('href');
                trackEvent('nav_click', 'Navigation', href);
            });
        });
        
        // Track external links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.addEventListener('click', function() {
                    trackEvent('external_link', 'Outbound', this.href);
                });
            }
        });
    }

    /**
     * Track event with gtag if available
     * @param {string} action - Event action
     * @param {string} category - Event category
     * @param {string} label - Event label
     */
    function trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Console log for debugging (remove in production)
        if (window.location.hostname === 'localhost') {
            console.log('Track:', action, category, label);
        }
    }

    /**
     * Expose tracking function globally
     */
    window.trackEvent = trackEvent;

    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    
    function init() {
        initSmoothScroll();
        initMobileNav();
        initNavbarEffects();
        initAnimations();
        initUTMCapture();
        initFormValidation();
        initLazyLoading();
        initPassiveEvents();
        initAccessibility();
        initTracking();
        
        // Add loaded class to body for CSS transitions
        document.body.classList.add('js-loaded');
        
        // Log initialization
        console.log('🤖 AgentAICoach website initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle page visibility changes (pause animations when tab is hidden)
    document.addEventListener('visibilitychange', () => {
        document.body.classList.toggle('page-hidden', document.hidden);
    });

})();
