# LURKOUT Script Builder - Setup Guide

A professional script builder web application with Discord OAuth authentication, featuring a glassmorphism design and real-time Lua code generation.

## Features

- ✨ **Discord OAuth 2.0 Authentication** - Secure login system
- 🎨 **Glassmorphism Design** - Modern glass-effect UI
- ⚡ **Real-time Script Generation** - Instant Lua output with syntax highlighting
- 💾 **Config Management** - Save and load configurations
- 📝 **Custom Code Editor** - Edit Lua code for each option
- 🎯 **Toggle System** - Enable/disable features easily
- 📊 **Dropdown Options** - Multiple modes for each feature
- 🔄 **Auto-updating Output** - Live preview of generated script

## Setup Instructions

### 1. Discord Application Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "LURKOUT Script Builder")
3. Navigate to "OAuth2" in the left sidebar
4. Click "Add Redirect" and add your redirect URI:
   - For local testing: `http://localhost:8080/callback`
   - For production: `https://yourdomain.com/callback`
5. Copy your **Client ID** and **Client Secret**

### 2. Configure the Application

Open `config.js` and replace the placeholder values:

```javascript
const DISCORD_CONFIG = {
    CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',        // Replace with your Client ID
    CLIENT_SECRET: 'YOUR_DISCORD_CLIENT_SECRET', // Replace with your Client Secret
    REDIRECT_URI: 'http://localhost:8080/callback', // Update with your URL
    // ... rest of config
};
```

### 3. Local Development

You can test the application locally using any static file server:

#### Option A: Using Python
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

#### Option B: Using Node.js (http-server)
```bash
npm install -g http-server
http-server -p 8080
```

#### Option C: Using VS Code Live Server
- Install "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

Then visit: `http://localhost:8080`

### 4. Demo Mode

The application includes a **demo mode** that works without setting up Discord OAuth. It will automatically activate if Discord authentication fails, allowing you to test all features immediately.

To use demo mode:
1. Simply open `index.html` in your browser
2. Click "Login with Discord"
3. The app will create a demo session automatically

**Note:** Demo mode should be removed in production. Look for the `createDemoSession()` function in `auth.js` and remove it.

### 5. Production Deployment

#### Important Security Note:
⚠️ **The current implementation exposes the Client Secret in the frontend code, which is NOT secure for production.**

For production, you need a backend server to handle OAuth:

1. **Create a backend API** (Node.js example):
   - Handle the OAuth code exchange on the server
   - Store the Client Secret securely (environment variables)
   - Return only the access token to the frontend

2. **Example backend route** (Express.js):
```javascript
app.post('/api/auth/discord', async (req, res) => {
    const { code } = req.body;
    
    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI
    });
    
    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: params
    });
    
    const data = await response.json();
    res.json({ access_token: data.access_token });
});
```

3. **Update `auth.js`** to call your backend instead of Discord directly

#### Deployment Options:

- **Netlify**: Drag and drop your files (add Netlify Functions for OAuth)
- **Vercel**: Connect your Git repository (add Serverless Functions for OAuth)
- **GitHub Pages**: Host static files (requires separate backend for OAuth)
- **Traditional Hosting**: Upload via FTP to any web host

### 6. File Structure

```
lurkout-script-builder/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── config.js           # Configuration and constants
├── auth.js             # Authentication handler
├── particles.js        # Particle animation system
├── builder.js          # Script builder logic
├── output.js           # Code generation and syntax highlighting
├── app.js              # Main application controller
└── README.md           # This file
```

## Usage

### Creating Script Options

1. Click "Add New Option" to create a custom option
2. Toggle options on/off using the switches
3. Select modes from the dropdown menus
4. Click "Edit Code" to customize the Lua code for each option
5. Click "Add to Project" to enable an option

### Managing Configurations

- **Save Config**: Stores current configuration to browser localStorage
- **Load Config**: Restores previously saved configuration
- **Clear All**: Removes all options (with confirmation)

### Generating Output

1. Switch to the "Output" tab to view generated script
2. Click "Copy to Clipboard" to copy the entire script
3. Click "Download Script" to save as a `.lua` file
4. The output updates automatically as you make changes

## Customization

### Adding New Option Types

Edit `config.js` and add to `DROPDOWN_OPTIONS`:

```javascript
DROPDOWN_OPTIONS: {
    'YourOptionName': ['Mode 1', 'Mode 2', 'Mode 3'],
    // ... existing options
}
```

### Customizing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --accent-color: #ff1e1e;      /* Primary accent color */
    --glass-bg: rgba(15, 15, 15, 0.7);  /* Glass effect background */
    /* ... more variables */
}
```

### Adding Custom Code Templates

Edit the `generate*Code()` methods in `output.js` to customize how each option type generates its code.

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Security Recommendations

1. ✅ Use HTTPS in production
2. ✅ Implement backend OAuth flow
3. ✅ Store secrets in environment variables
4. ✅ Implement rate limiting
5. ✅ Add CORS protection
6. ✅ Validate all user inputs
7. ✅ Remove demo mode in production

## Troubleshooting

### "Failed to authenticate with Discord"
- Check your Client ID and Client Secret
- Verify the Redirect URI matches exactly
- Ensure you've added the redirect URI in Discord Developer Portal

### Features not working
- Clear browser cache and localStorage
- Check browser console for errors
- Ensure all JavaScript files are loaded

### Particles not animating smoothly
- This may occur on lower-end devices
- Reduce particle count in `particles.js` (line 2)

## License

This project is for educational purposes. Ensure you comply with Roblox Terms of Service when using generated scripts.

## Support

For issues or questions:
- Check the browser console for errors
- Review the Discord Developer Portal settings
- Ensure all files are properly uploaded/served

---

**Created for LURKOUT** - Professional Script Building Platform
