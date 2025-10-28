# GitHub Pages Deployment Guide

## 🎉 Good News - You Don't Need a Local Server!

Since you're using GitHub Pages, your site is already hosted and accessible via your `.github.io` domain. This is actually EASIER than local development!

---

## 📝 What's Your GitHub Pages URL?

Your URL should look like one of these:
- `https://yourusername.github.io` (if repo is named `yourusername.github.io`)
- `https://yourusername.github.io/repository-name` (for other repos)

**Example:**
- Username: `lurklite`
- Repository: `supreme-goggles`
- URL: `https://lurklite.github.io/supreme-goggles`

---

## 🔧 Step-by-Step Discord Setup for GitHub Pages

### Step 1: Find Your Exact GitHub Pages URL

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Look for "Your site is published at: `https://...`"
5. **Copy this EXACT URL** (this is your redirect URI)

### Step 2: Update Discord Developer Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click your application
3. Go to **OAuth2** (left sidebar)
4. Scroll to **Redirects**
5. Click **Add Redirect**
6. Paste your EXACT GitHub Pages URL
   - Example: `https://lurklite.github.io/supreme-goggles`
   - ⚠️ NO trailing slash: ~~`https://lurklite.github.io/supreme-goggles/`~~
7. **Also add for local testing:** `http://localhost:8080`
8. Click **Save Changes** (IMPORTANT!)

**Your redirects should look like:**
```
https://lurklite.github.io/supreme-goggles
http://localhost:8080
http://127.0.0.1:8080
```

### Step 3: Update config.js (One Time Only)

The current `config.js` already has auto-detection, but you still need to add your credentials:

1. Go to your GitHub repository on the website
2. Click on `config.js`
3. Click the **pencil icon** (Edit this file)
4. Find these lines:
   ```javascript
   CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
   CLIENT_SECRET: 'YOUR_DISCORD_CLIENT_SECRET',
   ```
5. Replace with your actual Discord credentials:
   ```javascript
   CLIENT_ID: '1234567890123456789',
   CLIENT_SECRET: 'your-actual-secret-here',
   ```
6. Scroll down and click **Commit changes**
7. Click **Commit changes** again in the popup

### Step 4: Wait for GitHub Pages to Deploy

- After committing, GitHub Pages automatically rebuilds (takes 1-2 minutes)
- You'll see a yellow dot turn to green checkmark in your commits
- Once green, your changes are live!

### Step 5: Test Your Site

1. Visit your GitHub Pages URL (e.g., `https://lurklite.github.io/supreme-goggles`)
2. You should see the LURKOUT login screen
3. Click **Login with Discord**
4. Discord will ask you to authorize
5. Click **Authorize**
6. You'll be redirected back and logged in!

---

## 🚨 Common GitHub Pages Issues

### Issue: "Invalid Redirect URI" on GitHub Pages

**Solution:**
1. Make sure redirect URI in Discord matches EXACTLY:
   - ✅ `https://yourusername.github.io/repo-name`
   - ❌ `https://yourusername.github.io/repo-name/` (no trailing slash)
   - ❌ `http://yourusername.github.io/repo-name` (must be https)
2. Click "Save Changes" in Discord Portal
3. Wait 5 minutes for Discord to update
4. Try in incognito/private mode

### Issue: Changes Not Showing Up

**Solution:**
- Wait 1-2 minutes after committing
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Try incognito mode

### Issue: CORS Errors

**Solution:**
- This shouldn't happen on GitHub Pages (it's already HTTPS)
- If it does, the issue is with Discord's API, not your site
- Wait a few minutes and try again

### Issue: "Failed to fetch" When Logging In

**Solution:**
This is expected! The current code tries to exchange the OAuth code in the browser, which Discord blocks for security. 

**Two options:**

**Option A - Use Demo Mode (Easiest):**
- Just click "Login with Discord"
- It will automatically fall back to demo mode
- All features work perfectly
- No backend needed!

**Option B - Add a Backend (Advanced):**
- Use Netlify Functions, Vercel, or Cloudflare Workers
- Handle the OAuth token exchange server-side
- See `README.md` for backend setup details

---

## 🎮 Recommended: Use Demo Mode on GitHub Pages

For now, the app will automatically use demo mode when Discord OAuth fails. This is actually perfect for testing!

**What Demo Mode Does:**
- Creates a fake user session
- Shows "Demo User" with default avatar
- All features work 100%
- Perfect for showing the app to others
- No backend required

**To Make Demo Mode Production-Ready:**
1. Keep demo mode enabled
2. It activates automatically when OAuth fails
3. Users can still test everything
4. Add a backend later if you want real Discord login

---

## 🔒 Security Warning for GitHub Pages

⚠️ **Your Client Secret is visible in config.js!**

This is a problem because anyone can view your source code on GitHub and see your secret.

**Solutions:**

### Quick Fix (Good Enough for Testing):
1. Use demo mode (no real Discord auth needed)
2. If someone steals your secret, just reset it in Discord Portal
3. Generate a new secret regularly

### Proper Fix (For Production):
1. Set up a backend service (Netlify Functions, Vercel, etc.)
2. Store secrets as environment variables
3. Handle OAuth on the server, not in the browser
4. Only send access tokens to the frontend

**Example with Netlify Functions:**
```javascript
// netlify/functions/discord-auth.js
exports.handler = async (event) => {
    const { code } = JSON.parse(event.body);
    
    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI
        })
    });
    
    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify({ access_token: data.access_token })
    };
};
```

---

## 📋 Quick Checklist for GitHub Pages

- [ ] Found my GitHub Pages URL from Settings → Pages
- [ ] Added my GitHub Pages URL to Discord redirects
- [ ] Added `http://localhost:8080` to Discord redirects too
- [ ] Clicked "Save Changes" in Discord Portal
- [ ] Edited config.js on GitHub with my Client ID and Secret
- [ ] Committed the changes
- [ ] Waited 1-2 minutes for deployment
- [ ] Visited my GitHub Pages URL
- [ ] Tested login (or using demo mode)

---

## 🎯 Expected URLs in Discord Portal

Based on your screenshot, you should have:

```
Redirects:
  https://lurklite.github.io/supreme-goggles   (or your actual URL)
  http://localhost:8080
  http://127.0.0.1:8080
  https://squalid-cape-jw6qjwgg9pv2pxpp-5500.app.github.dev/
  https://lurklite.github.io/supreme-goggles/
```

**Note:** The ones with `.app.github.dev` are from GitHub Codespaces. You can keep them or remove them.

---

## 🚀 Deployment is Done!

Once you:
1. Commit your files to GitHub
2. Enable GitHub Pages
3. Add Discord credentials to config.js

Your site is LIVE and accessible to anyone with the URL! No server needed, no localhost, no Python. Just pure GitHub Pages magic! ✨

---

## 💡 Pro Tips

1. **Use GitHub Desktop** for easier file editing
2. **Test locally first** using `http://localhost:8080` before pushing to GitHub
3. **Use demo mode** until you set up a proper backend
4. **Don't commit sensitive data** - use environment variables later
5. **Check Actions tab** in GitHub to see deployment status

---

Need help? The app will automatically fall back to demo mode if OAuth doesn't work. Try it out!
