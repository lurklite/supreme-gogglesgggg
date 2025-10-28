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
            console.log('OAuth code received, processing...');
            // Handle OAuth callback
            const success = await this.handleCallback(code);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return success;
        } else {
            // Check for existing session
            const hasSession = this.loadSession();
            if (!hasSession) {
                console.log('No session found, authentication required');
            }
            return hasSession;
        }
    }

    // Handle OAuth callback
    async handleCallback(code) {
        console.log('=== OAUTH CALLBACK START ===');
        console.log('Code received:', code);
        
        try {
            // Step 1: Exchange code for access token
            console.log('Step 1: Exchanging code for token...');
            const tokenData = await this.exchangeCodeForToken(code);
            
            if (!tokenData || !tokenData.access_token) {
                console.error('No access token received');
                showNotification('Error', 'Failed to get access token from Discord', 'error');
                return false;
            }
            
            console.log('✓ Access token received');
            this.token = tokenData.access_token;
            
            // Step 2: Fetch user info with the access token
            console.log('Step 2: Fetching user info...');
            const userData = await this.fetchUserInfo(this.token);
            
            if (!userData) {
                console.error('No user data received');
                showNotification('Error', 'Failed to get user information from Discord', 'error');
                return false;
            }
            
            console.log('✓ User data received:', userData.username);
            
            // Step 3: Store user data
            this.user = {
                id: userData.id,
                username: userData.username,
                discriminator: userData.discriminator || '0',
                avatar: userData.avatar,
                displayName: userData.global_name || userData.username
            };
            
            // Step 4: Save session
            console.log('Step 3: Saving session...');
            this.saveSession();
            console.log('✓ Session saved');
            
            showNotification('Success', `Welcome ${this.user.displayName}!`, 'success');
            
            console.log('=== OAUTH CALLBACK SUCCESS ===');
            
            // Refresh page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
            return true;
            
        } catch (error) {
            console.error('=== OAUTH CALLBACK ERROR ===');
            console.error('Error details:', error);
            showNotification('Error', 'Authentication failed. Check console for details.', 'error');
            return false;
        }
    }

    // Fetch user info using the authorization code
    async fetchUserInfoWithCode(code) {
        console.log('Attempting to fetch user info...');
        
        try {
            // First, try to exchange code for token if CLIENT_SECRET exists
            if (typeof DISCORD_CONFIG !== 'undefined' && DISCORD_CONFIG.CLIENT_SECRET) {
                console.log('Exchanging code for token...');
                const tokenData = await this.exchangeCodeForToken(code);
                
                if (tokenData && tokenData.access_token) {
                    console.log('Token received, fetching user...');
                    return await this.fetchUserInfo(tokenData.access_token);
                }
            }
            
            // Fallback: Try direct API call (this won't work in production but helps with debugging)
            console.log('Attempting direct user fetch...');
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': `Bearer ${code}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('User fetched successfully via direct call');
                return userData;
            } else {
                const errorText = await response.text();
                console.error('Direct fetch failed:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
        
        return null;
    }

    // Exchange authorization code for access token
    async exchangeCodeForToken(code) {
        console.log('Exchanging code for token...');
        console.log('Client ID: 1432798922757115985');
        console.log('Redirect URI: https://lurklite.github.io/supreme-gogglesgggg/');
        
        const params = new URLSearchParams({
            client_id: '1432798922757115985',
            client_secret: DISCORD_CONFIG.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://lurklite.github.io/supreme-gogglesgggg/'
        });

        console.log('Request body:', params.toString());

        try {
            const response = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            console.log('Token response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✓ Token exchange successful');
                return data;
            } else {
                const errorData = await response.text();
                console.error('Token exchange failed:');
                console.error('Status:', response.status);
                console.error('Error:', errorData);
                
                // Try to parse error for more details
                try {
                    const errorJson = JSON.parse(errorData);
                    console.error('Error details:', errorJson);
                } catch (e) {
                    // Not JSON, already logged as text
                }
                
                return null;
            }
        } catch (error) {
            console.error('Token exchange network error:', error);
            return null;
        }
    }

    // Fetch user info from Discord API
    async fetchUserInfo(token) {
        console.log('Fetching user info from Discord...');
        
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('User info response status:', response.status);

            if (response.ok) {
                const userData = await response.json();
                console.log('✓ User info fetched successfully');
                console.log('Username:', userData.username);
                console.log('ID:', userData.id);
                return userData;
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch user info:');
                console.error('Status:', response.status);
                console.error('Error:', errorText);
                return null;
            }
        } catch (error) {
            console.error('User info fetch network error:', error);
            return null;
        }
    }

    // Save session
    saveSession() {
        const session = {
            user: this.user,
            token: this.token,
            timestamp: Date.now()
        };
        
        // Create a simple in-memory storage
        if (!window._discordSessions) {
            window._discordSessions = {};
        }
        
        const storageKey = `user_${this.user.id}`;
        window._discordSessions[storageKey] = session;
        window._discordSessions['current_user'] = this.user.id;
        
        console.log(`✓ Session saved for: ${this.user.displayName} (${this.user.id})`);
    }

    // Load session
    loadSession() {
        if (!window._discordSessions || !window._discordSessions['current_user']) {
            return false;
        }
        
        const userId = window._discordSessions['current_user'];
        const storageKey = `user_${userId}`;
        const session = window._discordSessions[storageKey];
        
        if (session) {
            try {
                // Check if session is less than 7 days old
                const daysSinceLogin = (Date.now() - session.timestamp) / (1000 * 60 * 60 * 24);
                
                if (daysSinceLogin < 7) {
                    this.user = session.user;
                    this.token = session.token;
                    console.log(`✓ Session restored for: ${this.user.displayName}`);
                    return true;
                } else {
                    console.log('Session expired (>7 days)');
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
        if (this.user && window._discordSessions) {
            const storageKey = `user_${this.user.id}`;
            delete window._discordSessions[storageKey];
            delete window._discordSessions['current_user'];
        }
        
        this.user = null;
        this.token = null;
        console.log('Session cleared');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const authenticated = this.user !== null && this.token !== null;
        console.log('Auth check:', authenticated ? `✓ ${this.user.displayName}` : '✗ Not authenticated');
        return authenticated;
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
        }, 500);
    }

    // Initiate Discord OAuth flow
    login() {
        console.log('=== INITIATING DISCORD LOGIN ===');
        console.log('Redirecting to Discord OAuth...');
        
        // Use the Discord-generated OAuth URL
        const discordOAuthURL = 'https://discord.com/oauth2/authorize?client_id=1432798922757115985&response_type=code&redirect_uri=https%3A%2F%2Flurklite.github.io%2Fsupreme-gogglesgggg%2F&scope=identify';
        
        window.location.href = discordOAuthURL;
    }

    // Force authentication - blocks access until logged in
    requireAuth() {
        if (!this.isAuthenticated()) {
            console.log('⚠ Authentication required - redirecting to login');
            
            // Hide main content
            const mainContent = document.querySelector('.container, main, #app, body > div');
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            
            // Show login requirement message
            const loginRequired = document.createElement('div');
            loginRequired.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;font-family:sans-serif;';
            loginRequired.innerHTML = `
                <h2>Discord Login Required</h2>
                <p>You must log in with Discord to access this site.</p>
                <button onclick="authManager.login()" style="padding:10px 20px;font-size:16px;cursor:pointer;background:#5865F2;color:white;border:none;border-radius:5px;">
                    Login with Discord
                </button>
            `;
            document.body.appendChild(loginRequired);
            
            return false;
        }
        return true;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();