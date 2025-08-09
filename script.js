// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navigation functionality
    initNavigation();
    
    // Theme toggle functionality
    initThemeToggle();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Back to top button
    initBackToTop();
    
    // Contact form validation
    initContactForm();
    
    // Skill bar animations
    initSkillBars();
    
    // Mobile navigation
    initMobileNav();
    
    // Navbar scroll effect
    initNavbarScroll();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Update active navigation link based on scroll position
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateThemeIcon(currentTheme, icon);

    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, icon);
    });
}

function updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact form validation
function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    subjectInput.addEventListener('blur', () => validateSubject());
    messageInput.addEventListener('blur', () => validateMessage());

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isValid = validateForm();
        
        if (isValid) {
            // Simulate form submission
            showSuccessMessage();
            form.reset();
        }
    });

    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('name-error');
        
        if (name.length < 2) {
            showError(errorElement, 'Name must be at least 2 characters long');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            showError(errorElement, 'Please enter a valid email address');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }

    function validateSubject() {
        const subject = subjectInput.value.trim();
        const errorElement = document.getElementById('subject-error');
        
        if (subject.length < 3) {
            showError(errorElement, 'Subject must be at least 3 characters long');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        const errorElement = document.getElementById('message-error');
        
        if (message.length < 10) {
            showError(errorElement, 'Message must be at least 10 characters long');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }

    function validateForm() {
        const nameValid = validateName();
        const emailValid = validateEmail();
        const subjectValid = validateSubject();
        const messageValid = validateMessage();
        
        return nameValid && emailValid && subjectValid && messageValid;
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function hideError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    function showSuccessMessage() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="background: #4CAF50; color: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.
            </div>
        `;
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Skill bar animations
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const width = bar.getAttribute('data-width');
                bar.style.setProperty('--target-width', width);
                bar.style.width = width;
                bar.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Initial call
}

// Mobile navigation
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Typing animation for hero section
function initTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    const highlightText = 'Web Reality';
    
    // Create typing effect
    let index = 0;
    subtitle.textContent = '';
    
    function typeText() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        } else {
            // Add highlight to "Web Reality"
            const finalText = subtitle.textContent;
            const highlightedText = finalText.replace(highlightText, `<span class="highlight">${highlightText}</span>`);
            subtitle.innerHTML = highlightedText;
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1000);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-image');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .project-card, .skill-item');
    animateElements.forEach(el => observer.observe(el));
}

// Performance optimization: Debounce scroll events
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

// Initialize performance optimizations
function initPerformanceOptimizations() {
    // Debounce scroll events
    const debouncedScroll = debounce(() => {
        // Scroll-dependent functions
    }, 10);

    window.addEventListener('scroll', debouncedScroll);
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        initLazyLoading();
        initIntersectionObserver();
        initPerformanceOptimizations();
        
        // Optional animations (can be disabled for performance)
        if (window.innerWidth > 768) {
            initParallaxEffect();
        }
    } catch (error) {
        console.error('Error initializing features:', error);
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

