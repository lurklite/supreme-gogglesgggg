// Main Application Controller
class App {
    constructor() {
        this.currentTab = 'builder';
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    async start() {
        // Initialize authentication
        const isAuthenticated = await authManager.init();

        if (isAuthenticated) {
            this.showAppScreen();
        } else {
            this.showLoginScreen();
        }

        this.setupEventListeners();
    }

    showLoginScreen() {
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('app-screen').classList.remove('active');
    }

    showAppScreen() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');

        // Update user info
        this.updateUserInfo();

        // Show welcome notification
        const user = authManager.getUser();
        showNotification('Welcome!', `Hello ${user.displayName}! Ready to build scripts?`, 'success');
    }

    updateUserInfo() {
        const user = authManager.getUser();
        if (user) {
            document.getElementById('user-name').textContent = user.displayName;
            document.getElementById('user-avatar').src = authManager.getAvatarURL();
        }
    }

    setupEventListeners() {
        // Discord login button
        const loginBtn = document.getElementById('discord-login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                authManager.login();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authManager.logout();
            });
        }

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update active button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
    }
}

// Notification System
function showNotification(title, message, type = 'success') {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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

// Initialize app
const app = new App();

// Export for debugging
window.app = app;
window.showNotification = showNotification;

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && authManager.isAuthenticated()) {
        // Refresh token if needed
        console.log('Page visible again');
    }
});

// Prevent accidental page close if user has unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (scriptBuilder && scriptBuilder.options.length > 0) {
        // Only show warning if there are options configured
        const options = scriptBuilder.options;
        const hasChanges = options.some(opt => opt.enabled);
        
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    }
});
