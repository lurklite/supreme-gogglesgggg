// Main Application Controller
class App {
    constructor() {
        this.currentTab = 'builder';
        this.init();
    }

    async init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    async start() {
        const isAuthenticated = await authManager.init();

        if (isAuthenticated) {
            this.showAppScreen();
            authManager.startSessionKeepAlive();
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

        this.updateUserInfo();
        this.updateOnlineCount();
        this.startOnlineCountUpdater();
        this.checkAndShowDiscordPopup();
    }

    updateUserInfo() {
        const user = authManager.getUser();
        if (user) {
            document.getElementById('user-name').textContent = user.displayName;
            document.getElementById('user-avatar').src = authManager.getAvatarURL();
        }
    }

    updateOnlineCount() {
        const onlineUsers = authManager.getOnlineUsers();
        const count = Object.keys(onlineUsers).length;
        
        const onlineCountElement = document.getElementById('online-count');
        if (onlineCountElement) {
            onlineCountElement.textContent = `${count} ${count === 1 ? 'user' : 'users'} online`;
        }
    }

    startOnlineCountUpdater() {
        setInterval(() => {
            this.updateOnlineCount();
        }, 30000);
    }

    checkAndShowDiscordPopup() {
        const dontShow = localStorage.getItem('lurkout_dont_show_discord');
        const lastShown = localStorage.getItem('lurkout_last_discord_popup');
        const today = new Date().toDateString();

        if (dontShow === 'true') return;
        if (lastShown === today) return;

        this.showDiscordPopup();
        localStorage.setItem('lurkout_last_discord_popup', today);
    }

    showDiscordPopup() {
        let popup = document.getElementById('discord-welcome-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'discord-welcome-popup';
            popup.className = 'welcome-popup';
            popup.innerHTML = `
                <div class="welcome-popup-content" style="position: relative;">
                    <button class="welcome-popup-close">&times;</button>
                    <h2>🎮 Join Our Community!</h2>
                    <p>
                        Welcome to LURKOUT Script Builder! Join our Discord community to get updates, 
                        share scripts, request features, and connect with other developers. 
                        Get exclusive early access to new features and directly support the project!
                    </p>
                    <a href="https://discord.gg/lurkout" target="_blank" class="discord-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Join Discord Server
                    </a>
                    <div class="dont-show-checkbox">
                        <input type="checkbox" id="dont-show-again">
                        <label for="dont-show-again">Don't show this again</label>
                    </div>
                </div>
            `;
            document.body.appendChild(popup);

            popup.querySelector('.welcome-popup-close').addEventListener('click', () => {
                this.closeDiscordPopup();
            });

            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.closeDiscordPopup();
                }
            });

            document.getElementById('dont-show-again').addEventListener('change', (e) => {
                if (e.target.checked) {
                    localStorage.setItem('lurkout_dont_show_discord', 'true');
                }
            });
        }

        popup.classList.add('active');
    }

    closeDiscordPopup() {
        const popup = document.getElementById('discord-welcome-popup');
        if (popup) {
            popup.classList.remove('active');
        }
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('discord-login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                authManager.login();
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authManager.logout();
            });
        }

        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
    }
}

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

const app = new App();

window.app = app;
window.showNotification = showNotification;

window.updateOnlineCount = () => {
    if (typeof app !== 'undefined') {
        app.updateOnlineCount();
    }
};

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && authManager.isAuthenticated()) {
        console.log('Page visible again');
    }
});

window.addEventListener('beforeunload', (e) => {
    if (scriptBuilder && scriptBuilder.options.length > 0) {
        const options = scriptBuilder.options;
        const hasChanges = options.some(opt => opt.enabled);
        
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    }
});