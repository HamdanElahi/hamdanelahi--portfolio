// Responsive Resume - Interactive JavaScript
// Modern resume functionality with animations, print support, and responsive features

class ResponsiveResume {
    constructor() {
        this.isAnimating = false;
        this.observedElements = new Set();
        this.skillBarsAnimated = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupPrintFunctionality();
        this.setupDownloadFunctionality();
        this.setupResponsiveFeatures();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        
        // Initialize animations after a short delay
        setTimeout(() => {
            this.triggerInitialAnimations();
        }, 500);
        
        console.log('Responsive Resume initialized successfully!');
    }
    
    setupEventListeners() {
        // Print button
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.handlePrint());
        }
        
        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownload());
        }
        
        // Scroll events
        window.addEventListener('scroll', this.debounce(() => this.handleScroll(), 16));
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Contact item interactions
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleContactClick(e, item));
        });
        
        // Project link interactions
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleProjectLinkClick(e, link));
        });
        
        // Skill category hover effects
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            category.addEventListener('mouseenter', () => this.handleSkillCategoryHover(category));
        });
    }
    
    setupScrollAnimations() {
        // Create intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.observedElements.add(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(`
            .section,
            .timeline-item,
            .skill-category,
            .education-item,
            .project-card,
            .achievement-item
        `);
        
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.scrollObserver.observe(el);
        });
    }
    
    setupSkillBars() {
        // Create observer for skill bars animation
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.skillBarsAnimated) {
                    this.animateSkillBars();
                    this.skillBarsAnimated = true;
                    skillObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            skillObserver.observe(skillsSection);
        }
    }
    
    setupPrintFunctionality() {
        // Setup print event listeners
        window.addEventListener('beforeprint', () => this.handleBeforePrint());
        window.addEventListener('afterprint', () => this.handleAfterPrint());
    }
    
    setupDownloadFunctionality() {
        // Check if browser supports PDF generation
        this.canGeneratePDF = typeof window.jsPDF !== 'undefined' || 
                             typeof window.html2canvas !== 'undefined';
    }
    
    setupResponsiveFeatures() {
        // Setup responsive breakpoint detection
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.handleResponsiveLayout();
    }
    
    setupAccessibility() {
        // Add ARIA labels and roles
        this.enhanceAccessibility();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Setup screen reader announcements
        this.setupScreenReaderSupport();
    }
    
    setupPerformanceOptimizations() {
        // Lazy load non-critical animations
        this.setupLazyAnimations();
        
        // Optimize scroll performance
        this.setupScrollOptimization();
        
        // Setup resource preloading
        this.setupResourcePreloading();
    }
    
    // Animation Methods
    animateElement(element) {
        if (this.isAnimating) return;
        
        const animationType = this.getAnimationType(element);
        
        switch (animationType) {
            case 'slideUp':
                this.slideUpAnimation(element);
                break;
            case 'slideLeft':
                this.slideLeftAnimation(element);
                break;
            case 'slideRight':
                this.slideRightAnimation(element);
                break;
            case 'fadeIn':
                this.fadeInAnimation(element);
                break;
            case 'scale':
                this.scaleAnimation(element);
                break;
            default:
                this.defaultAnimation(element);
        }
    }
    
    getAnimationType(element) {
        if (element.classList.contains('timeline-item')) return 'slideLeft';
        if (element.classList.contains('skill-category')) return 'slideUp';
        if (element.classList.contains('project-card')) return 'scale';
        if (element.classList.contains('achievement-item')) return 'slideRight';
        return 'fadeIn';
    }
    
    slideUpAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    slideLeftAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    slideRightAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    fadeInAnimation(element) {
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease-out';
            element.style.opacity = '1';
        });
    }
    
    scaleAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    defaultAnimation(element) {
        element.classList.add('animated');
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const width = bar.dataset.width;
            
            setTimeout(() => {
                bar.style.width = `${width}%`;
            }, index * 200);
        });
    }
    
    triggerInitialAnimations() {
        // Animate header elements
        const headerElements = document.querySelectorAll('.profile-section, .contact-section');
        headerElements.forEach((el, index) => {
            setTimeout(() => {
                this.fadeInAnimation(el);
            }, index * 300);
        });
        
        // Animate stats
        this.animateStats();
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
            
            if (!isNaN(numericValue)) {
                this.animateNumber(stat, 0, numericValue, 2000, finalValue);
            }
        });
    }
    
    animateNumber(element, start, end, duration, finalText) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = current + (finalText.includes('+') ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = finalText;
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
    
    // Event Handlers
    handlePrint() {
        this.showNotification('Preparing resume for printing...', 'info');
        
        // Small delay to show notification
        setTimeout(() => {
            window.print();
        }, 500);
    }
    
    handleDownload() {
        if (this.canGeneratePDF) {
            this.generatePDF();
        } else {
            this.fallbackDownload();
        }
    }
    
    generatePDF() {
        this.showNotification('Generating PDF... This may take a moment.', 'info');
        
        // Simulate PDF generation (would require actual PDF library)
        setTimeout(() => {
            this.showNotification('PDF generation requires additional libraries. Using print instead.', 'warning');
            this.handlePrint();
        }, 1500);
    }
    
    fallbackDownload() {
        this.showNotification('PDF download not available. Please use the print function.', 'warning');
        setTimeout(() => {
            this.handlePrint();
        }, 1000);
    }
    
    handleBeforePrint() {
        // Optimize layout for printing
        document.body.classList.add('printing');
        
        // Ensure all animations are complete
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            el.classList.add('animated');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        
        // Ensure skill bars are fully displayed
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.dataset.width;
            bar.style.width = `${width}%`;
        });
    }
    
    handleAfterPrint() {
        document.body.classList.remove('printing');
        this.showNotification('Print dialog closed.', 'info');
    }
    
    handleScroll() {
        // Update scroll-based animations
        this.updateScrollAnimations();
        
        // Update navigation if present
        this.updateNavigation();
    }
    
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.handleResponsiveLayout();
        }
        
        // Recalculate animations
        this.recalculateAnimations();
    }
    
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'p':
                    event.preventDefault();
                    this.handlePrint();
                    break;
                case 'd':
                    event.preventDefault();
                    this.handleDownload();
                    break;
                case 'k':
                    event.preventDefault();
                    this.scrollToTop();
                    break;
            }
        }
        
        // Accessibility shortcuts
        if (event.key === 'Tab') {
            this.handleTabNavigation(event);
        }
    }
    
    handleContactClick(event, contactItem) {
        const contactValue = contactItem.querySelector('.contact-value').textContent;
        const contactLabel = contactItem.querySelector('.contact-label').textContent.toLowerCase();
        
        // Handle different contact types
        switch (contactLabel) {
            case 'email':
                window.location.href = `mailto:${contactValue}`;
                break;
            case 'phone':
                window.location.href = `tel:${contactValue.replace(/[^0-9+]/g, '')}`;
                break;
            case 'website':
                window.open(`https://${contactValue}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://${contactValue}`, '_blank');
                break;
            case 'github':
                window.open(`https://${contactValue}`, '_blank');
                break;
            default:
                this.copyToClipboard(contactValue);
        }
        
        // Visual feedback
        this.addClickFeedback(contactItem);
    }
    
    handleProjectLinkClick(event, link) {
        event.preventDefault();
        
        const title = link.getAttribute('title');
        this.showNotification(`${title} - Demo link (would open project)`, 'info');
        
        // Add visual feedback
        this.addClickFeedback(link);
    }
    
    handleSkillCategoryHover(category) {
        // Add subtle animation on hover
        const skillItems = category.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(5px)';
                setTimeout(() => {
                    item.style.transform = 'translateX(0)';
                }, 150);
            }, index * 50);
        });
    }
    
    // Utility Methods
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.mobile) return 'mobile';
        if (width <= this.breakpoints.tablet) return 'tablet';
        if (width <= this.breakpoints.desktop) return 'desktop';
        return 'large';
    }
    
    handleResponsiveLayout() {
        const body = document.body;
        
        // Remove existing breakpoint classes
        body.classList.remove('mobile', 'tablet', 'desktop', 'large');
        
        // Add current breakpoint class
        body.classList.add(this.currentBreakpoint);
        
        // Adjust layout based on breakpoint
        this.adjustLayoutForBreakpoint();
    }
    
    adjustLayoutForBreakpoint() {
        const contactGrid = document.querySelector('.contact-grid');
        const skillsGrid = document.querySelector('.skills-grid');
        
        if (this.currentBreakpoint === 'mobile') {
            // Mobile-specific adjustments
            if (contactGrid) {
                contactGrid.style.gridTemplateColumns = '1fr';
            }
        } else if (this.currentBreakpoint === 'tablet') {
            // Tablet-specific adjustments
            if (contactGrid) {
                contactGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }
        }
    }
    
    updateScrollAnimations() {
        // Check if elements are in viewport and animate them
        const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
        
        elements.forEach(element => {
            if (this.isInViewport(element)) {
                this.animateElement(element);
            }
        });
    }
    
    updateNavigation() {
        // Update any navigation indicators based on scroll position
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Section is in view
                section.classList.add('in-view');
            } else {
                section.classList.remove('in-view');
            }
        });
    }
    
    recalculateAnimations() {
        // Recalculate animation timings and positions after resize
        this.observedElements.clear();
        
        // Re-observe elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            if (this.isInViewport(el)) {
                el.classList.add('animated');
            }
        });
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification(`Copied "${text}" to clipboard`, 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification(`Copied "${text}" to clipboard`, 'success');
        } catch (err) {
            this.showNotification('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    addClickFeedback(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease-out';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--bg-primary);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-xl);
            border-left: 4px solid var(--primary-color);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
            font-size: 0.875rem;
        `;
        
        // Set border color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        };
        
        notification.style.borderLeftColor = colors[type] || colors.info;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Accessibility Methods
    enhanceAccessibility() {
        // Add ARIA labels
        const printBtn = document.getElementById('printBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (printBtn) {
            printBtn.setAttribute('aria-label', 'Print resume');
        }
        
        if (downloadBtn) {
            downloadBtn.setAttribute('aria-label', 'Download resume as PDF');
        }
        
        // Add role attributes
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.setAttribute('role', 'region');
        });
        
        // Add landmark roles
        const header = document.querySelector('.resume-header');
        const main = document.querySelector('.resume-main');
        const footer = document.querySelector('.resume-footer');
        
        if (header) header.setAttribute('role', 'banner');
        if (main) main.setAttribute('role', 'main');
        if (footer) footer.setAttribute('role', 'contentinfo');
    }
    
    setupFocusManagement() {
        // Ensure proper focus management for interactive elements
        const focusableElements = document.querySelectorAll(`
            button,
            a[href],
            input,
            select,
            textarea,
            [tabindex]:not([tabindex="-1"])
        `);
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', (e) => {
                e.target.style.outline = '3px solid var(--primary-color)';
                e.target.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', (e) => {
                e.target.style.outline = '';
                e.target.style.outlineOffset = '';
            });
        });
    }
    
    setupScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }
    
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }
    
    handleTabNavigation(event) {
        // Enhance tab navigation experience
        const focusableElements = Array.from(document.querySelectorAll(`
            button:not([disabled]),
            a[href],
            input:not([disabled]),
            select:not([disabled]),
            textarea:not([disabled]),
            [tabindex]:not([tabindex="-1"]):not([disabled])
        `));
        
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (event.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex === 0) {
                event.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex === focusableElements.length - 1) {
                event.preventDefault();
                focusableElements[0].focus();
            }
        }
    }
    
    // Performance Methods
    setupLazyAnimations() {
        // Only animate elements when they're about to come into view
        this.lazyAnimationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ready-to-animate');
                }
            });
        }, { rootMargin: '100px' });
        
        const lazyElements = document.querySelectorAll('.animate-on-scroll');
        lazyElements.forEach(el => {
            this.lazyAnimationObserver.observe(el);
        });
    }
    
    setupScrollOptimization() {
        // Use passive event listeners for better scroll performance
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    
    setupResourcePreloading() {
        // Preload critical resources
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];
        
        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }
    
    // Utility Functions
    debounce(func, wait) {
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
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    }
    
    // Cleanup method
    destroy() {
        // Clean up observers and event listeners
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        
        if (this.lazyAnimationObserver) {
            this.lazyAnimationObserver.disconnect();
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('beforeprint', this.handleBeforePrint);
        window.removeEventListener('afterprint', this.handleAfterPrint);
        
        console.log('Responsive Resume destroyed');
    }
}

// Initialize the resume when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveResume = new ResponsiveResume();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible, refresh animations
        if (window.responsiveResume) {
            window.responsiveResume.triggerInitialAnimations();
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.responsiveResume) {
        window.responsiveResume.showNotification('Connection restored', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.responsiveResume) {
        window.responsiveResume.showNotification('You are offline', 'warning');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveResume;
}

