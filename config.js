// Discord OAuth Configuration
const DISCORD_CONFIG = {
    // ⚠️ IMPORTANT: Replace these with your actual Discord application credentials
    // Get these from: https://discord.com/developers/applications
    CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
    CLIENT_SECRET: 'YOUR_DISCORD_CLIENT_SECRET',
    
    // ⚠️ REDIRECT URI - This will automatically detect your URL
    // For GitHub Pages: https://yourusername.github.io/repository-name
    // For localhost: http://localhost:8080
    // 
    // ADD BOTH OF THESE TO DISCORD DEVELOPER PORTAL:
    // 1. Your GitHub Pages URL (https://yourusername.github.io/repo-name)
    // 2. http://localhost:8080 (for local testing)
    REDIRECT_URI: window.location.origin + window.location.pathname.replace(/\/$/, ''),
    
    // OAuth2 URLs (don't change these)
    AUTHORIZATION_URL: 'https://discord.com/api/oauth2/authorize',
    TOKEN_URL: 'https://discord.com/api/oauth2/token',
    API_ENDPOINT: 'https://discord.com/api/v10',
    
    // Scopes - what info we request from Discord
    SCOPES: ['identify']  // Only username and avatar
};

// Application Configuration
const APP_CONFIG = {
    APP_NAME: 'LURKOUT Script Builder',
    VERSION: '3.5',
    STORAGE_KEY: 'lurkout_auth',
    CONFIG_STORAGE_KEY: 'lurkout_config',
    
    // Default options for script builder
    DEFAULT_OPTIONS: [
        {
            id: 1,
            name: 'Walkspeed',
            enabled: true,
            mode: 'CFrame Speed',
            customCode: 'LocalPlayer.Character.Humanoid.WalkSpeed = 50'
        },
        {
            id: 2,
            name: 'JumpPower',
            enabled: false,
            mode: 'Normal Jump',
            customCode: 'LocalPlayer.Character.Humanoid.JumpPower = 100'
        },
        {
            id: 3,
            name: 'Flight',
            enabled: false,
            mode: 'Standard Flight',
            customCode: '-- Flight code here'
        },
        {
            id: 4,
            name: 'ESP',
            enabled: false,
            mode: 'Box ESP',
            customCode: '-- ESP code here'
        },
        {
            id: 5,
            name: 'Aimbot',
            enabled: false,
            mode: 'Head Target',
            customCode: '-- Aimbot code here'
        }
    ],
    
    // Dropdown options for each type
    DROPDOWN_OPTIONS: {
        'Walkspeed': ['CFrame Speed', 'Normal Speed', 'Tween Speed'],
        'JumpPower': ['Normal Jump', 'High Jump', 'Infinite Jump'],
        'Flight': ['Standard Flight', 'Velocity Flight', 'CFrame Flight'],
        'ESP': ['Box ESP', 'Name ESP', 'Distance ESP', 'Full ESP'],
        'Aimbot': ['Head Target', 'Torso Target', 'Closest Part'],
        'Default': ['Option 1', 'Option 2', 'Option 3']
    }
};

// Helper function to get OAuth URL
function getDiscordOAuthURL() {
    const params = new URLSearchParams({
        client_id: DISCORD_CONFIG.CLIENT_ID,
        redirect_uri: DISCORD_CONFIG.REDIRECT_URI,
        response_type: 'code',
        scope: DISCORD_CONFIG.SCOPES.join(' ')
    });
    
    return `${DISCORD_CONFIG.AUTHORIZATION_URL}?${params.toString()}`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DISCORD_CONFIG, APP_CONFIG, getDiscordOAuthURL };
}
