// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcons();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcons() {
        const icons = document.querySelectorAll('.theme-icon');
        icons.forEach(icon => {
            // Update to toggle Font Awesome classes instead of emoji text
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(this.theme === 'light' ? 'fa-moon' : 'fa-sun');
        });
    }

    bindEvents() {
        const toggleButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleTheme());
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });

        // Handle scroll for active navigation
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.mobileMenuToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.mobileMenuToggle.classList.remove('active');
    }

    scrollToSection(targetId) {
        const element = document.querySelector(targetId);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Update active navigation link
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Project Filtering
class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                this.filterProjects(category);
                this.updateActiveFilter(button);
            });
        });
    }

    filterProjects(category) {
        this.projectCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Send email using EmailJS
        emailjs.sendForm("service_twxfu79", "template_2emzff9", this.form)
            .then(() => {
                this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.form.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                this.showMessage(`Error: ${error.text || "Something went wrong"}`, 'error');
            });
    }

    validateForm(data) {
        const { name, email, message } = data;

        if (!name.trim()) {
            this.showMessage('Please enter your name.', 'error');
            return false;
        }

        if (!email.trim() || !this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        if (!message.trim()) {
            this.showMessage('Please enter a message.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(text, type) {
        // Create toast-like notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = text;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 0.5rem;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Resume Download Handler
class ResumeDownloader {
    constructor() {
        this.downloadButton = document.getElementById('download-resume');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (this.downloadButton) {
            this.downloadButton.addEventListener('click', () => this.downloadResume());
        }
    }

    downloadResume() {
        const link = document.createElement('a');
        link.href = 'assets/resume/resume.pdf'; 
        link.download = 'Ali_Alsayed_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Smooth Scrolling Utility
function scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, this.observerOptions);

        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll('.project-card, .focus-item, .build-item, .skill-category');
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            this.observer.observe(element);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new ProjectFilter();
    new ContactForm();
    new ResumeDownloader();
    new AnimationObserver();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .nav-link.active {
            color: var(--text-accent) !important;
        }

        .skill-progress {
            animation: fillProgress 2s ease-in-out;
        }

        @keyframes fillProgress {
            from {
                width: 0%;
            }
        }
    `;
    document.head.appendChild(style);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
});