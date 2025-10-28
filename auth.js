// Authentication Manager
class AuthManager {
    constructor() {
        this.user = null;
        this.token = null;
    }

    // Initialize authentication
    async init() {
        // Check for OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            console.error('OAuth error:', error);
            showNotification('Login Failed', 'Discord authorization was denied or failed', 'error');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return false;
        }

        if (code) {
            // Handle OAuth callback
            const success = await this.handleCallback(code);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return success;
        } else {
            // Check for existing session
            return this.loadSession();
        }
    }

    // Handle OAuth callback
    async handleCallback(code) {
        try {
            // Exchange code for token
            const tokenData = await this.exchangeCode(code);
            
            if (tokenData.access_token) {
                this.token = tokenData.access_token;
                
                // Fetch user info
                const userData = await this.fetchUserInfo(this.token);
                
                if (userData) {
                    this.user = {
                        id: userData.id,
                        username: userData.username,
                        discriminator: userData.discriminator,
                        avatar: userData.avatar,
                        displayName: userData.global_name || userData.username
                    };
                    
                    // Save session
                    this.saveSession();
                    
                    showNotification('Success', 'Logged in successfully! Refreshing...', 'success');
                    
                    // Refresh page after a short delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    
                    return true;
                }
            }
        } catch (error) {
            console.error('OAuth callback error:', error);
            showNotification('Error', 'Failed to authenticate with Discord', 'error');
        }
        
        return false;
    }

    // Exchange authorization code for access token
    async exchangeCode(code) {
        // In a production environment, this should be done on the backend
        // This is a simplified version for demonstration
        
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
        } catch (error) {
            console.error('Token exchange error:', error);
            // Fallback to demo mode if Discord API fails
            return this.createDemoSession();
        }
        
        // Fallback to demo mode
        return this.createDemoSession();
    }

    // Fetch user info from Discord API
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
        } catch (error) {
            console.error('User info fetch error:', error);
        }
        
        return null;
    }

    // Create demo session (for testing without real Discord OAuth)
    createDemoSession() {
        // This creates a fake session for demonstration purposes
        // Remove this in production when you have real Discord OAuth set up
        this.token = 'demo_token_' + Math.random().toString(36).substring(7);
        this.user = {
            id: 'demo_' + Date.now(),
            username: 'DemoUser',
            discriminator: '0000',
            avatar: null,
            displayName: 'Demo User'
        };
        
        this.saveSession();
        showNotification('Demo Mode', 'Using demo session. Configure Discord OAuth for real authentication.', 'success');
        
        return { access_token: this.token };
    }

    // Save session to localStorage
    saveSession() {
        const session = {
            user: this.user,
            token: this.token,
            timestamp: Date.now()
        };
        
        localStorage.setItem(DISCORD_CONFIG.STORAGE_KEY, JSON.stringify(session));
    }

    // Load session from localStorage
    loadSession() {
        const sessionData = localStorage.getItem(DISCORD_CONFIG.STORAGE_KEY);
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                
                // Check if session is less than 7 days old
                const daysSinceLogin = (Date.now() - session.timestamp) / (1000 * 60 * 60 * 24);
                
                if (daysSinceLogin < 7) {
                    this.user = session.user;
                    this.token = session.token;
                    return true;
                } else {
                    // Session expired
                    this.clearSession();
                }
            } catch (error) {
                console.error('Session load error:', error);
                this.clearSession();
            }
        }
        
        return false;
    }

    // Clear session
    clearSession() {
        this.user = null;
        this.token = null;
        localStorage.removeItem(DISCORD_CONFIG.STORAGE_KEY);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.user !== null && this.token !== null;
    }

    // Get user info
    getUser() {
        return this.user;
    }

    // Get avatar URL
    getAvatarURL() {
        if (this.user && this.user.avatar) {
            return `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=128`;
        }
        
        // Default Discord avatar
        const defaultAvatarNumber = this.user ? parseInt(this.user.discriminator) % 5 : 0;
        return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    }

    // Logout
    logout() {
        this.clearSession();
        showNotification('Logged Out', 'Successfully logged out', 'success');
        
        // Reload page to show login screen
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Initiate Discord OAuth flow
    login() {
        // Debug: Show what URL we're using
        console.log('=== DISCORD OAUTH DEBUG ===');
        console.log('Current URL:', window.location.href);
        console.log('Redirect URI:', DISCORD_CONFIG.REDIRECT_URI);
        console.log('OAuth URL:', getDiscordOAuthURL());
        console.log('==========================');
        
        window.location.href = getDiscordOAuthURL();
    }
}

// Create global auth manager instance
const authManager = new AuthManager();