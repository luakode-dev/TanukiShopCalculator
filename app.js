// Tanuki Shop Admin - Application Logic

class TanukiShopAdmin {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.updateActiveSection();
    }

    setupEventListeners() {
        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);

                // Close mobile menu after navigation
                if (window.innerWidth < 1024) {
                    this.closeMobileMenu();
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Sidebar toggle (close button)
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Overlay click to close
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.navigateToSection(e.state.section, false);
            }
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && hash !== this.currentSection) {
                this.navigateToSection(hash, false);
            }
        });

        // Responsive handling
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                this.closeMobileMenu();
            }
        });
    }

    navigateToSection(section, updateHistory = true) {
        // Update current section
        this.currentSection = section;

        // Update active states
        this.updateActiveSection();

        // Update URL
        if (updateHistory) {
            const url = `#${section}`;
            window.history.pushState({ section }, '', url);
        }

        // Save to localStorage
        this.saveToLocalStorage();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateActiveSection() {
        // Update navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const section = item.getAttribute('data-section');
            if (section === this.currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update content sections
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            const sectionId = section.id.replace('section-', '');
            if (sectionId === this.currentSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('tanukiShop_currentSection', this.currentSection);
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedSection = localStorage.getItem('tanukiShop_currentSection');

            // Check if there's a hash in the URL
            const hash = window.location.hash.substring(1);

            if (hash) {
                this.currentSection = hash;
            } else if (savedSection) {
                this.currentSection = savedSection;
                window.location.hash = savedSection;
            } else {
                // Default to dashboard
                this.currentSection = 'dashboard';
                window.location.hash = 'dashboard';
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
            this.currentSection = 'dashboard';
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tanukiApp = new TanukiShopAdmin();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Log initialization
    console.log('🦝 Tanuki Shop Admin initialized successfully!');
});

// Utility Functions
const utils = {
    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    },

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    },

    // Generate unique ID
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Show notification (placeholder for future implementation)
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // TODO: Implement toast notifications
    },

    // Validate number input
    validateNumber(value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

// Export utils for use in other modules
window.tanukiUtils = utils;
