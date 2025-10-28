// Authentication Manager with Persistent Sessions
class AuthManager {
    constructor() {
        this.user = null;
        this.token = null;
        this.sessionId = null;
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            showNotification('Login Failed', 'Discord authorization was denied', 'error');
            window.history.replaceState({}, document.title, window.location.pathname);
            return false;
        }

        if (code) {
            const success = await this.handleCallback(code);
            window.history.replaceState({}, document.title, window.location.pathname);
            return success;
        } else {
            return this.loadSession();
        }
    }

    async handleCallback(code) {
        try {
            const tokenData = await this.exchangeCodeForToken(code);
            
            if (!tokenData || !tokenData.access_token) {
                showNotification('Error', 'Failed to authenticate with Discord', 'error');
                return false;
            }
            
            this.token = tokenData.access_token;
            const userData = await this.fetchUserInfo(this.token);
            
            if (!userData) {
                showNotification('Error', 'Failed to get user information', 'error');
                return false;
            }
            
            this.user = {
                id: userData.id,
                username: userData.username,
                discriminator: userData.discriminator || '0',
                avatar: userData.avatar,
                displayName: userData.global_name || userData.username
            };
            
            this.saveSession();
            this.updateOnlineStatus(true);
            
            // Log login to webhook
            if (typeof WebhookLogger !== 'undefined') {
                await WebhookLogger.logLogin(this.user);
            }
            
            showNotification('Success', `Welcome ${this.user.displayName}!`, 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
            return true;
            
        } catch (error) {
            showNotification('Error', 'Authentication failed', 'error');
            return false;
        }
    }

    async exchangeCodeForToken(code) {
        const params = new URLSearchParams({
            client_id: DISCORD_CONFIG.CLIENT_ID,
            client_secret: DISCORD_CONFIG.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: DISCORD_CONFIG.REDIRECT_URI
        });

        try {
            const response = await fetch(DISCORD_CONFIG.TOKEN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async fetchUserInfo(token) {
        try {
            const response = await fetch(`${DISCORD_CONFIG.API_ENDPOINT}/users/@me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    saveSession() {
        const sessionId = this.generateSessionId();
        this.sessionId = sessionId;
        
        const session = {
            u: this.user,
            t: this.token,
            ts: Date.now(),
            sid: sessionId
        };
        
        const encoded = btoa(JSON.stringify(session));
        const expiryDays = APP_CONFIG.SESSION_DURATION_DAYS;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        
        document.cookie = `${APP_CONFIG.STORAGE_KEY}=${encoded}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
        
        this.saveUserConfig();
    }

    loadSession() {
        const cookies = document.cookie.split(';');
        let sessionCookie = null;
        
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === APP_CONFIG.STORAGE_KEY) {
                sessionCookie = value;
                break;
            }
        }
        
        if (!sessionCookie) {
            return false;
        }
        
        try {
            const decoded = atob(sessionCookie);
            const session = JSON.parse(decoded);
            
            const daysSinceLogin = (Date.now() - session.ts) / (1000 * 60 * 60 * 24);
            
            if (daysSinceLogin < APP_CONFIG.SESSION_DURATION_DAYS) {
                this.user = session.u;
                this.token = session.t;
                this.sessionId = session.sid;
                this.updateOnlineStatus(true);
                return true;
            } else {
                this.clearSession();
            }
        } catch (error) {
            this.clearSession();
        }
        
        return false;
    }

    generateSessionId() {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    saveUserConfig() {
        if (!this.user) return;
        
        const userConfigKey = `${APP_CONFIG.CONFIG_STORAGE_KEY}_${this.user.id}`;
        
        if (typeof scriptBuilder !== 'undefined' && scriptBuilder.options) {
            const config = {
                options: scriptBuilder.options,
                lastUpdated: Date.now()
            };
            
            const encoded = btoa(JSON.stringify(config));
            document.cookie = `${userConfigKey}=${encoded}; expires=${new Date(Date.now() + 365*24*60*60*1000).toUTCString()}; path=/; SameSite=Strict; Secure`;
        }
    }

    loadUserConfig() {
        if (!this.user) return null;
        
        const userConfigKey = `${APP_CONFIG.CONFIG_STORAGE_KEY}_${this.user.id}`;
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === userConfigKey) {
                try {
                    const decoded = atob(value);
                    return JSON.parse(decoded);
                } catch (error) {
                    return null;
                }
            }
        }
        
        return null;
    }

    updateOnlineStatus(isOnline) {
        if (!this.user) return;
        
        const onlineUsers = this.getOnlineUsers();
        const userEntry = {
            id: this.user.id,
            username: this.user.displayName,
            avatar: this.getAvatarURL(),
            lastSeen: Date.now()
        };
        
        if (isOnline) {
            onlineUsers[this.user.id] = userEntry;
        } else {
            delete onlineUsers[this.user.id];
        }
        
        sessionStorage.setItem('online_users', JSON.stringify(onlineUsers));
        
        if (typeof window.updateOnlineCount === 'function') {
            window.updateOnlineCount();
        }
    }

    getOnlineUsers() {
        try {
            const stored = sessionStorage.getItem('online_users');
            if (!stored) return {};
            
            const users = JSON.parse(stored);
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;
            
            const activeUsers = {};
            for (const [id, user] of Object.entries(users)) {
                if (now - user.lastSeen < fiveMinutes) {
                    activeUsers[id] = user;
                }
            }
            
            return activeUsers;
        } catch (error) {
            return {};
        }
    }

    clearSession() {
        if (this.user) {
            this.updateOnlineStatus(false);
        }
        
        this.user = null;
        this.token = null;
        this.sessionId = null;
        
        document.cookie = `${APP_CONFIG.STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    isAuthenticated() {
        return this.user !== null && this.token !== null;
    }

    getUser() {
        return this.user;
    }

    getAvatarURL() {
        if (this.user && this.user.avatar) {
            return `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=128`;
        }
        
        const defaultAvatarNumber = this.user ? parseInt(this.user.discriminator) % 5 : 0;
        return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    }

    logout() {
        const userName = this.user?.displayName || 'User';
        this.clearSession();
        showNotification('Logged Out', `${userName} logged out successfully`, 'success');
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    login() {
        const discordOAuthURL = 'https://discord.com/oauth2/authorize?client_id=1432798922757115985&response_type=code&redirect_uri=https%3A%2F%2Flurklite.github.io%2Fsupreme-gogglesgggg%2F&scope=identify';
        window.location.href = discordOAuthURL;
    }

    startSessionKeepAlive() {
        setInterval(() => {
            if (this.isAuthenticated()) {
                this.updateOnlineStatus(true);
            }
        }, 120000);
    }
}

const authManager = new AuthManager();