// Personal Blog Layout - Interactive JavaScript
// Modern blog functionality with theme switching, animations, and filtering

class PersonalBlog {
    constructor() {
        this.currentTheme = 'light';
        this.currentFilter = 'all';
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.setupBlogFiltering();
        this.setupContactForm();
        this.animateStats();
        this.setupBackToTop();
        this.setupLazyLoading();
        
        // Initialize animations after a short delay
        setTimeout(() => {
            this.triggerScrollAnimations();
        }, 500);
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Navigation toggle (mobile)
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.smoothScrollTo(targetId);
                this.updateActiveNavLink(link);
            });
        });
        
        // Hero action buttons
        const heroButtons = document.querySelectorAll('.hero-actions .btn');
        heroButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('href');
                this.smoothScrollTo(targetId);
            });
        });
        
        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    setupNavigation() {
        // Update active navigation link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupBlogFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const blogCards = document.querySelectorAll('.blog-card');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterBlogPosts(filter);
                
                // Update active filter button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Load more functionality
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }
    }
    
    filterBlogPosts(filter) {
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach((card, index) => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                // Animate in with delay
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        this.currentFilter = filter;
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });
            
            // Add real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }
    
    handleContactFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fix the errors before submitting.', 'error');
            return;
        }
        
        // Simulate form submission
        this.showNotification('Sending message...', 'info');
        
        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        }, 2000);
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        this.clearFieldError(field);
        
        // Required field validation
        if (!value) {
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
            isValid = false;
        } else {
            // Specific validations
            switch (fieldName) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errorMessage = 'Please enter a valid email address.';
                        isValid = false;
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long.';
                        isValid = false;
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters long.';
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .blog-card, .project-card, .skill-category');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }
    
    triggerScrollAnimations() {
        // Manually trigger animations for elements in viewport
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('animated');
            }
        });
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    this.animateNumber(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end;
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
    
    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                this.smoothScrollTo('#home');
            });
        }
    }
    
    setupLazyLoading() {
        // Lazy load images when they come into view
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    handleScroll() {
        if (!this.isScrolling) {
            this.isScrolling = true;
            requestAnimationFrame(() => {
                this.updateScrollElements();
                this.isScrolling = false;
            });
        }
        
        // Clear existing timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Set new timeout
        this.scrollTimeout = setTimeout(() => {
            this.onScrollEnd();
        }, 150);
    }
    
    updateScrollElements() {
        const scrollY = window.scrollY;
        const backToTopBtn = document.getElementById('backToTop');
        
        // Show/hide back to top button
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Parallax effect for hero shapes
        const heroShapes = document.querySelectorAll('.hero-shape');
        heroShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrollY * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    onScrollEnd() {
        // Actions to perform when scrolling ends
        this.triggerScrollAnimations();
    }
    
    handleResize() {
        // Handle window resize events
        this.triggerScrollAnimations();
    }
    
    handleKeyboardShortcuts(event) {
        // Keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'd':
                    event.preventDefault();
                    this.toggleTheme();
                    break;
                case 'k':
                    event.preventDefault();
                    document.getElementById('navToggle').click();
                    break;
            }
        }
        
        // Escape key actions
        if (event.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('blog-theme', this.currentTheme);
        
        // Show notification
        const themeText = this.currentTheme === 'dark' ? 'Dark' : 'Light';
        this.showNotification(`${themeText} theme activated`, 'info');
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('blog-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
        }
    }
    
    smoothScrollTo(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 80; // Account for fixed navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    loadMorePosts() {
        // Simulate loading more posts
        const blogGrid = document.getElementById('blogGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Show loading state
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // Create new blog posts (simulation)
            const newPosts = this.createNewBlogPosts(3);
            newPosts.forEach((post, index) => {
                setTimeout(() => {
                    blogGrid.appendChild(post);
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    
                    // Animate in
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 200);
            });
            
            // Reset button
            loadMoreBtn.textContent = 'Load More Posts';
            loadMoreBtn.disabled = false;
            
            this.showNotification('New posts loaded!', 'success');
        }, 1500);
    }
    
    createNewBlogPosts(count) {
        const posts = [];
        const categories = ['tutorial', 'design', 'development', 'thoughts'];
        const titles = [
            'Advanced CSS Techniques for Modern Layouts',
            'JavaScript Performance Optimization Tips',
            'The Evolution of Web Design Trends',
            'Building Scalable React Applications',
            'Understanding Web Accessibility Standards',
            'Modern DevOps Practices for Frontend'
        ];
        
        for (let i = 0; i < count; i++) {
            const article = document.createElement('article');
            const category = categories[Math.floor(Math.random() * categories.length)];
            const title = titles[Math.floor(Math.random() * titles.length)];
            
            article.className = 'blog-card';
            article.dataset.category = category;
            article.style.transition = 'all 0.3s ease-out';
            
            article.innerHTML = `
                <div class="card-image">
                    <div class="image-placeholder">
                        <svg width="100%" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="400" height="200" fill="url(#newCardGradient${i})"/>
                            <circle cx="${100 + i * 50}" cy="100" r="30" fill="white" opacity="0.2"/>
                            <defs>
                                <linearGradient id="newCardGradient${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#${Math.floor(Math.random()*16777215).toString(16)}"/>
                                    <stop offset="100%" style="stop-color:#${Math.floor(Math.random()*16777215).toString(16)}"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div class="card-category">${category}</div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${title}</h3>
                    <p class="card-excerpt">
                        A comprehensive guide exploring modern techniques and best practices 
                        for creating exceptional web experiences.
                    </p>
                    <div class="card-meta">
                        <span class="card-date">March ${Math.floor(Math.random() * 30) + 1}, 2024</span>
                        <span class="card-read-time">${Math.floor(Math.random() * 10) + 3} min read</span>
                    </div>
                    <a href="#" class="card-link">Read More</a>
                </div>
            `;
            
            posts.push(article);
        }
        
        return posts;
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
        `;
        
        // Set border color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
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
    
    // Utility method for debouncing
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
    
    // Method to get current scroll position
    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    }
    
    // Method to check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize the blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.personalBlog = new PersonalBlog();
    console.log('Personal Blog initialized successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible, refresh animations
        if (window.personalBlog) {
            window.personalBlog.triggerScrollAnimations();
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.personalBlog) {
        window.personalBlog.showNotification('Connection restored', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.personalBlog) {
        window.personalBlog.showNotification('You are offline', 'warning');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalBlog;
}

