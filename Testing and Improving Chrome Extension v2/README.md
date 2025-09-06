# Enhanced Tech Support Assistant v2.1

A powerful Chrome extension that provides AI-powered tech support directly in your browser. Get instant help with debugging, documentation analysis, and technical issues while browsing any website.

## 🎉 **NOW LIVE ON CHROME WEB STORE!**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-LIVE-green?logo=google-chrome&logoColor=white&style=for-the-badge)](https://chromewebstore.google.com/detail/mlphakpkofdcigfpcpmgomhgalodhlkm)

**🔗 [Install Now - FREE](https://chromewebstore.google.com/detail/mlphakpkofdcigfpcpmgomhgalodhlkm)** | **🌐 [Try Demo](https://enhanced-7hxm5o.manus.space/)**

---

## ✨ Features

### 🤖 AI-Powered Support
- **OpenAI Integration** - Uses GPT-3.5-turbo for intelligent responses
- **Context-Aware** - Sees and analyzes the current page you're browsing
- **Real-time Help** - Get instant assistance without leaving your current page

### 🔍 Smart Page Analysis
- **Page Content Reading** - Automatically reads and analyzes the current webpage
- **Form Detection** - Identifies forms, inputs, and interactive elements
- **Link Analysis** - Scans and categorizes page links
- **Error Monitoring** - Detects and explains JavaScript errors

### 📚 Documentation Crawling
- **URL Detection** - Automatically detects URLs in your messages
- **Content Extraction** - Crawls and analyzes documentation pages
- **Multi-format Support** - Handles HTML, JSON, and plain text content
- **Smart Processing** - Cleans and formats content for better AI analysis

### 💬 Interactive Chat Interface
- **Draggable Bubble** - Move the chat interface anywhere on the page
- **Persistent Conversations** - Chat history maintained during session
- **API Key Management** - Easy setup directly in the chat interface
- **Real-time Responses** - Instant AI-powered assistance

## 🚀 Installation

### Method 1: Install from Chrome Web Store (Recommended)
🎉 **The extension is now LIVE and FREE on the Chrome Web Store!**

[![Install from Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/mlphakpkofdcigfpcpmgomhgalodhlkm)

**Direct Link**: [Enhanced Tech Support Assistant](https://chromewebstore.google.com/detail/mlphakpkofdcigfpcpmgomhgalodhlkm)

**Demo Site**: [Try the extension online](https://enhanced-7hxm5o.manus.space/)

### Method 2: Load Unpacked Extension (Development)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your browser toolbar

## 🔧 Setup

### 1. Get Your OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Configure the Extension
1. Click the extension icon in your browser toolbar
2. Paste your API key in the chat input
3. Press Enter or click Send
4. You'll see "🔑 API key saved! You can now ask me questions."

## 💡 Usage Examples

### Basic Questions
- "What page am I on?"
- "What forms do you see on this page?"
- "Help me debug this error"
- "Explain what this code does"

### Documentation Analysis
- "How do I use this API? https://api.example.com/docs"
- "Explain this error from the docs: https://docs.example.com/troubleshooting"
- "What's the difference between these methods? https://docs.example.com/method1 https://docs.example.com/method2"

### Page-Specific Help
- "What errors do you see on this page?"
- "Help me fill out this form"
- "What links are available on this page?"
- "Explain what this page is about"

## 🛠️ Technical Details

### Architecture
- **Manifest V3** - Uses the latest Chrome extension standards
- **ActiveTab Permission** - Content script injected only on user click
- **Service Worker** - Handles extension lifecycle and communication
- **No Storage Dependencies** - API key stored in memory for security
- **Secure Injection** - Scripts only run when explicitly activated by user

### Security
- **Local API Key Storage** - Keys never leave your browser
- **No Data Collection** - No personal data is collected or transmitted
- **CORS Compliant** - Respects web security policies
- **URL Validation** - Prevents access to restricted browser URLs
- **ActiveTab Permission** - Only accesses current tab when user clicks extension
- **Chrome Store Compliant** - Follows security best practices for faster review

### Performance
- **Lightweight** - Minimal impact on page load times
- **Efficient Processing** - Smart content truncation to avoid token limits
- **Error Handling** - Graceful fallbacks for network issues
- **Memory Optimized** - No persistent storage to prevent context invalidation

## 🔄 Recent Updates (v2.1.1)

### ✅ Fixed Issues
- **JavaScript Errors** - Resolved "Assignment to constant variable" error
- **Extension Context** - Fixed "Extension context invalidated" errors
- **Text Visibility** - Fixed input text only visible when highlighted
- **API Key Recognition** - Improved API key saving and loading
- **Chrome URL Access** - Prevented chrome:// URL access errors
- **Documentation Crawling** - Enhanced error handling for CORS and network issues

### ✨ New Features
- **Page Context Reading** - Extension can now see and analyze current page
- **Documentation Crawling** - Automatic URL detection and content extraction
- **Enhanced Error Handling** - Better error messages and fallbacks
- **Improved UI** - Better styling and user experience
- **Smart CORS Handling** - Multiple fetch attempts with detailed error guidance
- **Comprehensive Error Messages** - User-friendly explanations when crawling fails

### 🔒 Security Improvements (v2.1.1)
- **Chrome Store Compliance** - Removed broad host permissions for better security
- **ActiveTab Permission** - Extension only accesses current tab on user click
- **No Automatic Injection** - Content script only loads when user activates extension
- **Faster Review Process** - Follows Chrome Store security best practices
- **Enhanced Privacy** - No access to all websites without explicit user action

### 🏗️ Architecture Improvements
- **Simplified Codebase** - Removed complex storage dependencies
- **Better Error Handling** - Comprehensive try-catch blocks
- **Memory Management** - Optimized for better performance
- **Code Organization** - Cleaner, more maintainable code structure
- **Robust URL Validation** - Prevents access to restricted browser URLs
- **Enhanced Fetch Strategies** - Multiple approaches for better success rates
- **Secure Permission Model** - Uses minimal required permissions

## 🐛 Troubleshooting

### Common Issues

**Extension won't load:**
- Make sure you're using Chrome (not other browsers)
- Check that Developer mode is enabled
- Try reloading the extension

**API key not working:**
- Ensure your API key starts with `sk-`
- Check that you have OpenAI credits
- Try pasting the key again in the chat

**Page context not working:**
- Refresh the page after installing the extension
- Make sure you're not on a chrome:// page
- Check the browser console for errors

**Documentation crawling fails:**
- Some URLs may be blocked by CORS policies (AWS, GitHub, etc.)
- The extension will show helpful error messages with alternatives
- Try copying and pasting content manually when crawling fails
- Check that the URLs are publicly accessible
- Use the "What page am I on?" feature if you're already on the documentation page

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Development Setup
1. Clone the repository
2. Make your changes
3. Test in Chrome with Developer mode
4. Submit a pull request with a description of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Chrome Extension API for the browser integration
- The open-source community for inspiration and feedback

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Check the browser console for error messages
4. Make sure you're using the latest version

---

**Made with ❤️ for developers who need instant tech support while browsing the web.**

