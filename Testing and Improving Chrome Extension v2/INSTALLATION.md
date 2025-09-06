# Installation Guide

This guide will walk you through installing the Enhanced Tech Support Assistant Chrome extension.

## Prerequisites

- **Google Chrome** (version 88 or later)
- **OpenAI API Key** (get one from [OpenAI Platform](https://platform.openai.com/api-keys))
- **Internet connection** (for AI responses)

## Installation Methods

### Method 1: Load Unpacked Extension (Recommended)

#### Step 1: Download the Extension
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/enhanced-tech-support-assistant.git
   cd enhanced-tech-support-assistant
   ```

2. **Or download as ZIP:**
   - Click the "Code" button on GitHub
   - Select "Download ZIP"
   - Extract the ZIP file to a folder

#### Step 2: Enable Developer Mode
1. Open Chrome and go to `chrome://extensions/`
2. Toggle "Developer mode" ON (top right corner)
3. You should see three new buttons appear: "Load unpacked", "Pack extension", and "Update"

#### Step 3: Load the Extension
1. Click "Load unpacked"
2. Navigate to the extension folder
3. Select the folder containing `manifest.json`
4. Click "Select Folder"

#### Step 4: Verify Installation
1. You should see the extension appear in the extensions list
2. The extension icon should appear in your browser toolbar
3. If you don't see the icon, click the puzzle piece icon and pin the extension

### Method 2: Install from Chrome Web Store (Coming Soon)

*This method will be available once the extension is published to the Chrome Web Store.*

## Initial Setup

### Step 1: Get Your OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Give it a name (e.g., "Chrome Extension")
5. Copy the API key (starts with `sk-`)
6. **Important:** Save it securely - you won't be able to see it again

### Step 2: Configure the Extension
1. **Click the extension icon** in your browser toolbar
2. **Paste your API key** in the chat input field
3. **Press Enter** or click "Send"
4. You should see: "🔑 API key saved! You can now ask me questions."

### Step 3: Test the Extension
1. **Ask a question** like "What page am I on?"
2. **The AI should respond** with information about the current page
3. **Try asking about the page** - "What forms do you see?" or "What links are available?"

## Troubleshooting

### Extension Won't Load

**Problem:** Extension doesn't appear in the extensions list
**Solutions:**
- Make sure you're using Chrome (not other browsers)
- Check that Developer mode is enabled
- Verify the folder contains `manifest.json`
- Try refreshing the extensions page

**Problem:** "This extension may be corrupted" error
**Solutions:**
- Re-download the extension files
- Make sure all files are present
- Check that `manifest.json` is valid

### API Key Issues

**Problem:** "I need your OpenAI API key" message
**Solutions:**
- Make sure your API key starts with `sk-`
- Check that you have OpenAI credits
- Try pasting the key again
- Verify the key is complete (no missing characters)

**Problem:** API requests failing
**Solutions:**
- Check your OpenAI account has credits
- Verify the API key is correct
- Check your internet connection
- Try generating a new API key

### Page Context Not Working

**Problem:** AI doesn't see the current page
**Solutions:**
- Refresh the page after installing the extension
- Make sure you're not on a chrome:// page
- Check the browser console for errors
- Try asking "What page am I on?" again

**Problem:** "Extension context invalidated" errors
**Solutions:**
- Reload the extension in `chrome://extensions/`
- Refresh the current page
- This should be fixed in v2.1

### Documentation Crawling Issues

**Problem:** URLs not being crawled
**Solutions:**
- Some URLs may be blocked by CORS policies
- Try using different documentation URLs
- Check that URLs are publicly accessible
- Make sure URLs start with `http://` or `https://`

**Problem:** "Cannot access browser internal URL" error
**Solutions:**
- This is normal for chrome:// URLs
- Use public URLs instead
- The extension will skip these automatically

## Advanced Configuration

### Customizing the Extension

#### Changing the API Model
To use a different OpenAI model, edit `content-script.js`:
```javascript
// In the callOpenAI method, change:
model: 'gpt-3.5-turbo'
// To:
model: 'gpt-4' // or other available models
```

#### Adjusting Content Limits
To change how much page content is analyzed:
```javascript
// In the getPageContext method, change:
let visibleText = bodyText.substring(0, 2000);
// To:
let visibleText = bodyText.substring(0, 5000); // for more content
```

#### Modifying UI Styling
Edit the CSS in the `addStyles()` method in `content-script.js` to customize the appearance.

### Updating the Extension

#### Manual Update
1. Download the latest version
2. Replace the old files with new ones
3. Go to `chrome://extensions/`
4. Click the refresh button on the extension
5. Refresh any open pages

#### Automatic Update (Future)
When published to Chrome Web Store, updates will be automatic.

## Security Considerations

### API Key Security
- **Never share your API key** with others
- **Don't commit API keys** to version control
- **Use environment variables** for development
- **Rotate keys regularly** for security

### Data Privacy
- **No data collection** - The extension doesn't collect personal data
- **Local processing** - All processing happens in your browser
- **Secure communication** - All API calls use HTTPS
- **No tracking** - No user tracking or analytics

### Permissions
The extension requires these permissions:
- **activeTab** - To read the current page content
- **storage** - To save your API key (in memory only)
- **tabs** - To communicate between components
- **scripting** - To inject the content script

## Support

### Getting Help
1. **Check this guide** for common issues
2. **Open an issue** on GitHub
3. **Check the browser console** for error messages
4. **Make sure you're using the latest version**

### Reporting Bugs
When reporting bugs, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Console error messages
- Screenshots if helpful

### Feature Requests
We welcome feature requests! Please:
1. Check if the feature already exists
2. Open an issue with a clear description
3. Explain the use case
4. Provide examples if possible

## Uninstallation

### Remove the Extension
1. Go to `chrome://extensions/`
2. Find "Enhanced Tech Support Assistant"
3. Click "Remove"
4. Confirm the removal

### Clean Up
- The extension doesn't leave any persistent data
- No cleanup is required
- Your API key is only stored in memory

---

**Need more help?** Check the [README.md](README.md) for more information or open an issue on GitHub.



