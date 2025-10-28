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
                    
                    showNotification('Success', `Logged in as ${this.user.displayName}! Refreshing...`, 'success');
                    
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
        const params = new URLSearchParams({
            client_id: '1432798922757115985',
            client_secret: DISCORD_CONFIG.CLIENT_SECRET, // You'll need to set this
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://lurklite.github.io/supreme-gogglesgggg/'
        });

        try {
            const response = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.text();
                console.error('Token exchange failed:', response.status, errorData);
                throw new Error('Token exchange failed');
            }
        } catch (error) {
            console.error('Token exchange error:', error);
            throw error;
        }
    }

    // Fetch user info from Discord API
    async fetchUserInfo(token) {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('Discord user fetched:', userData.username);
                return userData;
            } else {
                console.error('Failed to fetch user info:', response.status);
                return null;
            }
        } catch (error) {
            console.error('User info fetch error:', error);
            return null;
        }
    }

    // Save session to memory (user-specific)
    saveSession() {
        const session = {
            user: this.user,
            token: this.token,
            timestamp: Date.now()
        };
        
        // Store session data in memory with user ID as key
        const storageKey = `discord_session_${this.user.id}`;
        const sessionData = JSON.stringify(session);
        
        // Store in memory for this session
        window.sessionStorage = window.sessionStorage || {};
        window.sessionStorage[storageKey] = sessionData;
        
        // Also keep track of current user
        window.sessionStorage['current_user_id'] = this.user.id;
        
        console.log(`Session saved for user: ${this.user.displayName} (${this.user.id})`);
    }

    // Load session from memory
    loadSession() {
        const currentUserId = window.sessionStorage?.['current_user_id'];
        
        if (!currentUserId) {
            return false;
        }
        
        const storageKey = `discord_session_${currentUserId}`;
        const sessionData = window.sessionStorage?.[storageKey];
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                
                // Check if session is less than 7 days old
                const daysSinceLogin = (Date.now() - session.timestamp) / (1000 * 60 * 60 * 24);
                
                if (daysSinceLogin < 7) {
                    this.user = session.user;
                    this.token = session.token;
                    console.log(`Session loaded for user: ${this.user.displayName} (${this.user.id})`);
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
        if (this.user) {
            const storageKey = `discord_session_${this.user.id}`;
            delete window.sessionStorage?.[storageKey];
        }
        
        delete window.sessionStorage?.['current_user_id'];
        this.user = null;
        this.token = null;
        console.log('Session cleared');
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
        const userName = this.user?.displayName || 'User';
        this.clearSession();
        showNotification('Logged Out', `${userName} logged out successfully`, 'success');
        
        // Reload page to show login screen
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Initiate Discord OAuth flow
    login() {
        // Use the Discord-generated OAuth URL
        const discordOAuthURL = 'https://discord.com/oauth2/authorize?client_id=1432798922757115985&response_type=code&redirect_uri=https%3A%2F%2Flurklite.github.io%2Fsupreme-gogglesgggg%2F&scope=identify';
        
        console.log('=== DISCORD OAUTH ===');
        console.log('Redirecting to Discord for authentication...');
        console.log('====================');
        
        window.location.href = discordOAuthURL;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();