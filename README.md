# 🚀 Enhanced Tech Support Assistant

> **AI-Powered Technical Support Extension with Real-Time Documentation Crawling**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-v2.0.0-blue.svg)](https://chrome.google.com/webstore)
[![Website](https://img.shields.io/badge/Website-Live-green.svg)](https://techsup-pqk6xt.manus.space)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Bug Bounty](https://img.shields.io/badge/Bug%20Bounty-Active-red.svg)](BUG_BOUNTY.md)

## ✨ **Features**

### 🤖 **AI-Powered Support**
- **GPT-4 Integration** - Advanced AI assistance for technical issues
- **Smart Context** - Understands your current webpage and documentation
- **Real-time Responses** - Instant help for troubleshooting, errors, and setup

### 📚 **Documentation Crawling**
- **URL-based Access** - Connect any documentation site via URL
- **Real-time Analysis** - AI searches through connected docs for answers
- **Smart Detection** - Automatically identifies documentation content
- **Clickable Links** - Direct access to source documentation

### 🎯 **User Experience**
- **Draggable Chat Bubble** - Move anywhere on any webpage
- **Minimize/Expand** - Collapsible interface to save space
- **Message History** - Up/down arrow navigation like VS Code
- **Status Indicators** - Visual feedback for connections and status
- **Responsive Design** - Works on desktop and mobile

### 🔐 **Security & Privacy**
- **Local Storage** - API keys stored securely in your browser
- **No Data Collection** - Your conversations stay private
- **Secure API Calls** - Direct communication with OpenAI

---

## 🌐 **Live Website**

**Try the Enhanced Tech Support Assistant online:** [https://techsup-pqk6xt.manus.space](https://techsup-pqk6xt.manus.space)

Experience the full functionality of our AI-powered tech support system directly in your browser without installing the extension.

---

## 🚀 **Quick Start**

### **1. Install Extension**
1. Download or clone this repository
2. Open Chrome Extensions (`chrome://extensions/`)
3. Enable **Developer Mode**
4. Click **"Load unpacked"** and select the extension folder

### **2. Get Your API Key**
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key (starts with `sk-`)
3. Copy the key to your clipboard

### **3. Start Using**
1. Go to any website (e.g., [GitHub](https://github.com))
2. Click the extension icon to show the chat bubble
3. Paste your API key in the chat
4. Ask any technical question!

---

## 🎯 **Use Cases**

### **🖥️ Development & Programming**
- **Error Debugging** - Paste error messages for instant solutions
- **Code Review** - Get feedback on your code snippets
- **API Integration** - Help with API documentation and usage
- **Framework Questions** - React, Vue, Angular, Node.js help

### **🔧 System Administration**
- **Server Issues** - Troubleshoot Linux/Windows server problems
- **Network Problems** - Diagnose connectivity and configuration issues
- **Security Concerns** - Get advice on best practices and vulnerabilities
- **Performance Tuning** - Optimize system and application performance

### **📱 Web Development**
- **CSS Issues** - Fix styling and layout problems
- **JavaScript Errors** - Debug frontend code issues
- **Responsive Design** - Get help with mobile-first development
- **Browser Compatibility** - Solve cross-browser issues

### **☁️ Cloud & DevOps**
- **AWS/Azure/GCP** - Cloud platform troubleshooting
- **Docker & Kubernetes** - Container orchestration help
- **CI/CD Pipelines** - Build and deployment automation
- **Infrastructure as Code** - Terraform, CloudFormation assistance

---

## 🛠️ **Technical Architecture**

### **Frontend Components**
```
├── Content Script (content-script.js)
│   ├── DraggableChatBubble Class
│   ├── ChatHandler Class
│   └── UI Event Handlers
├── Background Service Worker
│   ├── Message Routing
│   ├── URL Crawling
│   └── State Management
└── CSS Styling
    ├── Modern Design System
    ├── Responsive Layout
    └── Dark Mode Support
```

### **Data Flow**
```
User Input → Content Script → Background Worker → OpenAI API
                ↓
        Response → Chat Display → User
```

### **Storage Structure**
```javascript
chrome.storage.local = {
  openai_api_key: "sk-...",           // Your OpenAI API key
  doc_url: "https://docs.example.com", // Connected documentation
  chatBubbleVisible: true,            // UI state
  enabled: true,                      // Extension status
  notifications: true                 // User preferences
}
```

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Optional: Set default API key (not recommended for production)
OPENAI_API_KEY=your_key_here
```

### **Extension Settings**
- **Auto-scan pages** - Automatically analyze webpage content
- **Notifications** - Enable/disable browser notifications
- **Chat history** - Store conversation history locally
- **Documentation caching** - Cache frequently accessed docs

### **API Configuration**
- **Model**: GPT-4 (configurable to GPT-3.5-turbo)
- **Max Tokens**: 2000 (adjustable)
- **Temperature**: 0.7 (creativity vs accuracy)
- **Streaming**: Disabled for better reliability

---

## 🐛 **Troubleshooting**

### **Chat Bubble Not Appearing**
1. **Check Console**: Look for error messages
2. **Verify Installation**: Ensure extension is loaded
3. **Page Compatibility**: Some pages may block content scripts
4. **Permissions**: Check if extension has necessary permissions

### **API Key Issues**
1. **Format**: Must start with `sk-` and be ~51 characters
2. **Validity**: Verify key is active on OpenAI platform
3. **Quotas**: Check if you've exceeded API limits
4. **Network**: Ensure internet connection is stable

### **Documentation Connection Fails**
1. **URL Format**: Must be valid HTTP/HTTPS URL
2. **Accessibility**: Ensure URL is publicly accessible
3. **CORS**: Some sites may block cross-origin requests
4. **Content Type**: Verify site serves HTML/text content

### **Performance Issues**
1. **Memory Usage**: Check browser memory consumption
2. **Network Calls**: Monitor API request frequency
3. **Page Load**: Ensure extension doesn't slow page loading
4. **Background Processes**: Check service worker activity

---

## 🔍 **Debugging**

### **Console Commands**
```javascript
// Check extension status
chrome.runtime.sendMessage({action: 'getStatus'}, console.log);

// Test documentation access
chrome.runtime.sendMessage({
  action: 'testDocumentationAccess', 
  url: 'https://docs.example.com'
}, console.log);

// Check storage
chrome.storage.local.get(null, console.log);
```

### **Developer Tools**
- **Content Script Console**: View content script logs
- **Background Page**: Monitor service worker activity
- **Network Tab**: Track API calls and responses
- **Storage Tab**: Inspect extension data

### **Common Error Messages**
```
"Content script not ready yet" → Extension loading timing issue
"Could not establish connection" → Background script communication failure
"API Error: Invalid API key" → OpenAI authentication problem
"Documentation access failed" → URL crawling or CORS issue
```

---

## 📚 **API Reference**

### **Message Actions**
```javascript
// Toggle chat bubble visibility
chrome.runtime.sendMessage({
  action: 'toggleChatBubble',
  visible: true
});

// Test documentation access
chrome.runtime.sendMessage({
  action: 'testDocumentationAccess',
  url: 'https://docs.example.com'
});

// Get extension status
chrome.runtime.sendMessage({
  action: 'getStatus'
});
```

### **Event Listeners**
```javascript
// Listen for status updates
document.addEventListener('statusUpdate', (e) => {
  console.log('Status changed:', e.detail);
});

// Listen for chat bubble messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle messages from background script
});
```

---

## 🚀 **Development**

### **Prerequisites**
- Node.js 16+ (for development tools)
- Chrome browser with developer mode
- Basic knowledge of Chrome extension APIs

### **Setup Development Environment**
```bash
# Clone repository
git clone https://github.com/peercodeai/techsupport.git
cd techsupport

# Install dependencies (if any)
npm install

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select the extension folder
```

### **File Structure**
```
techsupport/
├── manifest.json              # Extension configuration
├── background/                # Service worker files
│   └── service-worker.js     # Background script
├── content/                   # Content script files
│   └── content-script.js     # Main content script
├── popup/                     # Popup interface files
│   ├── popup.html           # Popup HTML
│   ├── popup.js             # Popup logic
│   └── chat-handler.js      # AI chat functionality
├── styles/                    # CSS styling files
│   ├── popup-modern.css     # Modern popup styles
│   └── content.css          # Content script styles
├── assets/                    # Icons and images
│   ├── icon16.png           # 16x16 icon
│   ├── icon32.png           # 32x32 icon
│   ├── icon48.png           # 48x48 icon
│   └── icon128.png          # 128x128 icon
├── utils/                     # Utility functions
│   └── drag-resize.js       # Drag and resize functionality
├── README.md                  # This file
├── BUG_BOUNTY.md             # Bug bounty program
├── DEVELOPMENT.md             # Development guidelines
└── LICENSE                    # License information
```

### **Building for Production**
```bash
# Create production build
npm run build

# Package extension
npm run package

# The extension will be ready for Chrome Web Store submission
```

---

## 🤝 **Contributing**

### **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation for API changes
- Ensure cross-browser compatibility
- Test on multiple websites and scenarios

### **Bug Reports**
- Use the [bug bounty program](BUG_BOUNTY.md) for critical issues
- Provide detailed reproduction steps
- Include console logs and screenshots
- Specify browser version and OS

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **OpenAI** - For providing the GPT-4 API
- **Chrome Extensions Team** - For the excellent documentation
- **Open Source Community** - For inspiration and feedback
- **Bug Hunters** - For finding and reporting issues

---

## 📞 **Support & Contact**

- **Documentation**: [GitHub Wiki](https://github.com/peercodeai/techsupport/wiki)
- **Issues**: [GitHub Issues](https://github.com/peercodeai/techsupport/issues)
- **Discussions**: [GitHub Discussions](https://github.com/peercodeai/techsupport/discussions)
- **Email**: [Contact via GitHub Issues](https://github.com/peercodeai/techsupport/issues)
- **Discord**: [Contact via GitHub Discussions](https://github.com/peercodeai/techsupport/discussions)

---

## 🎉 **Roadmap**

### **v2.1.0 (Q1 2024)**
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Screenshot analysis
- [ ] Code snippet execution

### **v2.2.0 (Q2 2024)**
- [ ] Team collaboration features
- [ ] Advanced documentation indexing
- [ ] Custom AI model support
- [ ] Integration with development tools

### **v3.0.0 (Q3 2024)**
- [ ] Cross-browser compatibility
- [ ] Mobile app version
- [ ] Enterprise features
- [ ] Advanced analytics dashboard

---

**Made with ❤️ by the Enhanced Tech Support Team**

*Empowering developers and IT professionals with AI-powered technical assistance.*

