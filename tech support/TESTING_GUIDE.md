# Tech Support Extension Testing Guide

## 🚀 Quick Start

### Step 1: Load the Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right corner)
3. Click "Load unpacked" and select your extension folder
4. The extension should appear in your extensions list with an icon

### Step 2: Start the Test Server
```bash
# Install dependencies (if needed)
npm install

# Start the test server
npm start
```

### Step 3: Test the Extension
1. Open `http://localhost:3000` in Chrome
2. The test website will automatically detect if the extension is active
3. Use the test buttons to trigger various network issues
4. Monitor the extension's response in real-time

## 🔧 Testing the Extension

### Basic Functionality Tests

#### 1. Extension Detection
- ✅ Extension icon appears in Chrome toolbar
- ✅ Clicking icon opens popup with status
- ✅ Test website shows "Extension detected and active"

#### 2. Network Monitoring
- ✅ Extension logs network requests in browser console
- ✅ Failed requests (4xx, 5xx) are detected and stored
- ✅ Content script receives issue notifications

#### 3. Popup Interface
- ✅ Popup displays extension status
- ✅ "Open Chat Assistant" button is functional
- ✅ Recent issues list updates with detected problems

### Network Issue Testing

The test website provides buttons to trigger specific network issues:

#### Test 404 Error
- Triggers a 404 response from the local server
- Extension should detect and log this error
- Check browser console for extension logs

#### Test 500 Error
- Makes request to `httpstat.us/500` (external service)
- Extension should detect server error
- Verify error appears in extension's issue list

#### Test Timeout
- Attempts request with 5-second delay, aborts after 1 second
- Extension should detect timeout/abort
- Good test for network monitoring edge cases

#### Test CORS Error
- Makes request to GitHub API (may trigger CORS issues)
- Extension should detect network-level errors
- Useful for testing cross-origin request handling

#### Test Network Error
- Attempts request to non-existent domain
- Extension should detect DNS/network failures
- Tests error handling for completely failed requests

## 📊 Monitoring and Debugging

### Browser Console
- Open DevTools (F12) and check Console tab
- Extension logs will appear with prefix "Tech Support Extension"
- Look for network monitoring logs and error detection

### Extension Popup
- Click extension icon to open popup
- Check "Recent Issues" section for detected problems
- Verify status shows "Monitoring network activity..."

### Background Script
- Go to `chrome://extensions/`
- Find your extension and click "service worker" link
- Monitor background script console for detailed logs

### Storage Inspection
- In DevTools, go to Application tab → Storage → Local Storage
- Check for stored issues and solutions
- Extension stores data under `chrome-extension://[ID]/`

## 🐛 Troubleshooting

### Extension Not Loading
- Verify manifest.json is valid JSON
- Check for syntax errors in JavaScript files
- Ensure all referenced files exist in the extension folder

### Network Monitoring Not Working
- Check if `webRequest` permission is granted
- Verify content script is injected (check DevTools Sources)
- Look for errors in background script console

### Test Website Issues
- Ensure Node.js server is running on port 3000
- Check browser console for JavaScript errors
- Verify extension permissions include `<all_urls>`

### Content Script Communication
- Check if messages are being sent between background and content scripts
- Verify `chrome.runtime.onMessage` listeners are properly set up
- Look for "Receiving end does not exist" errors

## 🔍 Advanced Testing

### Manual Network Issues
- Navigate to any website and trigger network errors
- Use browser DevTools to simulate offline mode
- Test with slow network conditions (Chrome DevTools → Network → Throttling)

### Extension Updates
- Make changes to extension files
- Go to `chrome://extensions/` and click refresh button
- Test if changes take effect immediately

### Cross-Tab Testing
- Open multiple tabs with different websites
- Trigger network issues in different tabs
- Verify extension handles multiple tabs correctly

### Storage Persistence
- Close and reopen browser
- Check if stored issues persist
- Verify extension state is maintained

## 📝 Expected Behavior

### When Network Issues Occur:
1. ✅ Extension detects failed requests (4xx, 5xx status codes)
2. ✅ Issues are stored in local storage
3. ✅ Content script receives notification
4. ✅ Popup updates with recent issues
5. ✅ Background script attempts solution matching

### Extension Response:
- Network monitoring logs in console
- Issue storage and retrieval
- Real-time notifications to active tabs
- Popup interface updates
- Background processing for solutions

## 🎯 Success Criteria

The extension is working correctly when:
- ✅ Network issues are automatically detected
- ✅ Issues are properly stored and retrieved
- ✅ Content scripts receive real-time updates
- ✅ Popup interface displays current status
- ✅ Background script processes issues without errors
- ✅ Extension handles multiple tabs and websites
- ✅ Error logging provides useful debugging information

## 🚀 Next Steps

After successful testing:
1. Configure Supabase credentials in `background.js`
2. Test AI-powered solution matching
3. Deploy extension to Chrome Web Store
4. Monitor real-world usage and performance
5. Iterate based on user feedback

---

**Happy Testing! 🎉**

If you encounter issues, check the browser console, extension logs, and this guide for troubleshooting steps.
