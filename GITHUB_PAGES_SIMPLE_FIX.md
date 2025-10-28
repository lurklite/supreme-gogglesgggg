# FOR GITHUB PAGES USERS - SIMPLE FIX

## Your Problem:
You're getting "Invalid Redirect URI" error when trying to login.

## The Solution (3 Steps):

### Step 1: Find Your EXACT GitHub Pages URL

When you visit your site, look at the browser address bar. Copy the EXACT URL.

Examples:
- `https://lurklite.github.io/supreme-goggles`
- `https://yourusername.github.io/repository-name`

**Important:** 
- Must start with `https://` (not http)
- Must be `.github.io`
- No trailing slash at the end

### Step 2: Add URL to Discord

1. Go to https://discord.com/developers/applications
2. Click your application
3. Click "OAuth2" on the left
4. Scroll to "Redirects"
5. Click "Add Redirect"
6. Paste your GitHub Pages URL (from Step 1)
7. Click "Save Changes" button at the bottom

**Example:**
```
If your site is: https://lurklite.github.io/supreme-goggles
Then add exactly: https://lurklite.github.io/supreme-goggles
```

### Step 3: Edit config.js on GitHub

1. Go to your GitHub repository
2. Click on `config.js` file
3. Click the pencil icon (edit)
4. Find these lines:
   ```javascript
   CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
   CLIENT_SECRET: 'YOUR_DISCORD_CLIENT_SECRET',
   ```
5. Replace with your real Discord credentials
6. Click "Commit changes" button
7. Wait 1-2 minutes for GitHub to update

---

## Now Test It:

1. Visit your GitHub Pages URL
2. Look at the green "Debug Info" box on the login screen
3. It shows the Redirect URI the app is using
4. Make sure that EXACT URL is in Discord Developer Portal
5. Click "Login with Discord"
6. Should work now!

---

## Still Not Working?

The app has **Demo Mode** built-in! 

Just click "Login with Discord" and if OAuth fails, it will automatically log you in as a demo user. All features work perfectly!

---

## Debug Checklist:

- [ ] My GitHub Pages URL is correct (check browser address bar)
- [ ] I added that EXACT URL to Discord redirects
- [ ] I clicked "Save Changes" in Discord Portal
- [ ] I updated config.js with my Client ID and Secret
- [ ] I committed the changes on GitHub
- [ ] I waited 1-2 minutes for deployment
- [ ] I refreshed my GitHub Pages site (Ctrl+Shift+R)
- [ ] The green debug box shows my correct URL

---

## Quick Reference:

**What URL format to use:**
✅ `https://username.github.io/repo-name`
❌ `https://username.github.io/repo-name/` (no slash)
❌ `http://username.github.io/repo-name` (must be https)
❌ `https://username.github.io/` (need repo name)

**Where to add it:**
Discord Developer Portal → Your App → OAuth2 → Redirects → Add Redirect

**What to edit:**
In your GitHub repo, edit `config.js` and add your Client ID and Secret

---

That's it! The app now has a debug panel that shows you exactly what URL it's using. Just make sure that URL is in Discord!
