# 🚀 Tech Support Chrome Extension

> **Practical, step-by-step network troubleshooting with console navigation guidance**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Extension-v1.0-blue.svg)](https://github.com/peercodeai/techsupport)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-purple.svg)](https://openai.com/)

A powerful Chrome extension that provides **real-time network monitoring**, **AI-powered troubleshooting**, and **practical console navigation guidance** to help developers and IT professionals troubleshoot network issues with actionable, step-by-step instructions.

## ✨ **What Makes This Different?**

### 🚫 **No More Generic "..." Responses**
- **Eliminates frustrating generic messages** that don't help
- **Always provides specific, actionable steps** you can follow immediately
- **Guides you through console navigation** step-by-step
- **Gives concrete troubleshooting commands** instead of vague advice

### 🔍 **Practical Console Navigation**
- **Step-by-step DevTools guidance** (F12, Console, Network tabs)
- **Exact keyboard shortcuts** and menu navigation paths
- **Visual cues and descriptions** to find what you're looking for
- **Console command examples** you can copy and paste

## ✨ Features

### 🔍 **Smart Network Monitoring**
- **Real-time detection** of HTTP errors (4xx, 5xx)
- **Network failure identification** (timeouts, DNS issues, CORS)
- **Automatic categorization** by severity and type
- **Performance baselining** and trend analysis

### 🤖 **AI-Powered Practical Guidance**
- **OpenAI GPT-3.5-turbo integration** for intelligent assistance
- **Context-aware solutions** based on detected issues
- **Step-by-step troubleshooting** workflows with specific actions
- **Console navigation guidance** for browser DevTools

### 🚨 **Proactive Issue Detection**
- **Pattern recognition** for repeated failures
- **Critical alert system** for infrastructure issues
- **Predictive monitoring** to prevent problems
- **Automated notifications** for urgent issues

### 🛠️ **Developer-Friendly Practical Approach**
- **Localhost development** without Google review requirements
- **Comprehensive testing suite** with 20+ test scenarios
- **Browser DevTools integration** for advanced testing
- **Clean, modern UI** with responsive design

## 🚀 Quick Start

### **Installation (Development)**

1. **Clone the repository**
   ```bash
   git clone https://github.com/peercodeai/techsupport.git
   cd techsupport
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `techsupport` folder

4. **Start test server**
   ```bash
   npm start
   ```

5. **Test the extension**
   - Navigate to `http://localhost:3000`
   - Use the comprehensive testing dashboard
   - Trigger network issues and get practical guidance

### **Configuration**

1. **Set OpenAI API Key**
   - Edit `popup.js`
   - Replace `YOUR_OPENAI_API_KEY` with your actual key
   - Get your key at [OpenAI Platform](https://platform.openai.com/)

2. **Customize Permissions** (Optional)
   - Modify `manifest.json` for production use
   - Adjust `host_permissions` as needed

## 🧪 Testing

### **Built-in Test Scenarios**
- ✅ **404/500 Error Testing**
- ✅ **Network Failure Simulation**
- ✅ **Timeout and CORS Testing**
- ✅ **Performance Stress Testing**
- ✅ **Concurrent Request Testing**

### **Browser DevTools Integration**
- **Network Throttling** simulation
- **Offline Mode** testing
- **Request Blocking** scenarios
- **Performance profiling**

### **Test Dashboard**
Visit `http://localhost:3000` for a comprehensive testing interface with:
- Real-time extension status
- Network issue simulation
- Performance monitoring
- AI chat testing with practical guidance

## 🏗️ Architecture

### **Core Components**
```
├── popup.js          # AI chat interface & practical guidance
├── background.js     # Service worker & issue processing
├── content.js        # Network monitoring & request interception
├── manifest.json     # Extension configuration
└── server.js         # Local testing server
```

### **Data Flow**
1. **Content Script** intercepts network requests
2. **Background Script** processes and categorizes issues
3. **Storage API** maintains issue history
4. **AI Integration** provides practical, actionable solutions
5. **Popup Interface** displays results and step-by-step guidance

### **Security Features**
- **Localhost-only permissions** for development
- **No broad network access** without explicit permission
- **Secure API key handling** (client-side only)
- **Limited scope** to prevent abuse

## 🔧 **Practical Guidance Examples**

### **Console Navigation Requests**
Instead of generic responses, the AI provides:

```
**Step 1: Open DevTools**
- Press F12 (or right-click → "Inspect")
- Click the "Console" tab at the top

**Step 2: Find Network Errors**
- Look for red error messages
- Click on error details to expand them
- Note the exact error text and line numbers

**Step 3: Check Network Tab**
- Click the "Network" tab
- Refresh the page to see all requests
- Look for failed requests (red status codes)
```

### **Troubleshooting Workflows**
The AI guides you through complete workflows:

```
**HTTP 500 Error Resolution:**
1. Open DevTools (F12) → Network tab
2. Refresh the page and look for failed requests
3. Click on the failed request to see details
4. Check the Response tab for error details
5. Look at the server logs for more information
6. Try the request in a tool like Postman
7. Check if the server is running and accessible
```

## 🔧 Customization

### **Adding New Issue Types**
```javascript
// In content.js
if (response.status >= 400) {
  chrome.runtime.sendMessage({
    type: "networkIssue",
    url: url,
    method: method,
    statusCode: response.status,
    customField: "value"
  });
}
```

### **Extending AI Capabilities**
```javascript
// In popup.js
const enhancedContext = context + `
Additional expertise:
- Your custom domain knowledge
- Specific troubleshooting steps
- Company-specific procedures
`;
```

### **Custom Alert Rules**
```javascript
// In popup.js
function customAlertRule(issues) {
  // Your custom logic here
  if (customCondition) {
    showCustomAlert();
  }
}
```

## 📊 Performance

### **Monitoring Capabilities**
- **Request/response timing** analysis
- **Error rate tracking** by domain
- **Performance trend** identification
- **Resource usage** optimization

### **Optimization Features**
- **Smart caching** of common solutions
- **Efficient storage** management
- **Background processing** for heavy tasks
- **Memory leak** prevention

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Guidelines**
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

### **Areas for Contribution**
- 🧪 Additional test scenarios
- 🎨 UI/UX improvements
- 🔧 Performance optimizations
- 📚 Documentation enhancements
- 🌐 Internationalization support
- 🚀 Enhanced practical guidance features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-3.5-turbo integration
- **Chrome Extensions API** for the platform
- **Open source community** for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/peercodeai/techsupport/issues)
- **Discussions**: [GitHub Discussions](https://github.com/peercodeai/techsupport/discussions)
- **Wiki**: [Documentation](https://github.com/peercodeai/techsupport/wiki)

## 🚀 Roadmap

### **v1.1 - Enhanced Practical Guidance**
- [ ] Video tutorials integration
- [ ] Screenshot-based guidance
- [ ] Interactive troubleshooting wizards
- [ ] Multi-language support

### **v1.2 - Team Features**
- [ ] Shared troubleshooting sessions
- [ ] Collaborative console navigation
- [ ] Team knowledge base
- [ ] Troubleshooting templates

### **v1.3 - Enterprise**
- [ ] SSO integration
- [ ] Advanced security features
- [ ] Compliance reporting
- [ ] Custom knowledge base integration

## 💡 **Why Choose This Extension?**

### **✅ Practical Benefits**
- **No more guessing** - Get specific steps to follow
- **Learn while troubleshooting** - Understand what you're doing
- **Save time** - Skip trial and error with guided solutions
- **Build skills** - Learn proper debugging techniques

### **✅ Technical Benefits**
- **Real-time monitoring** - Catch issues before they become problems
- **AI-powered insights** - Get intelligent analysis of your issues
- **Comprehensive coverage** - Handle all types of network problems
- **Extensible architecture** - Easy to customize and extend

---

**Made with ❤️ by the PeerCode AI team**

*Transform your network troubleshooting from frustrating guesswork to guided, practical problem-solving with AI-powered console navigation assistance.*
