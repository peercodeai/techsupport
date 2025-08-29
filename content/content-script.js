// Enhanced Tech Support Assistant - Content Script
console.log('Enhanced Tech Support Assistant content script loaded');

// Initialize content script
(function() {
  'use strict';
  
  // Check if extension is enabled
  chrome.storage.local.get(['enabled'], (result) => {
    if (result.enabled !== false) {
      initializeExtension();
    }
  });
  
  function initializeExtension() {
    console.log('Initializing Enhanced Tech Support Assistant');
    
    // Add extension indicator to the page
    addExtensionIndicator();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      handleMessage(request, sendResponse);
      return true;
    });
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Content script received message:', request);
        
        switch (request.action) {
            case 'toggleChatBubble':
                // Toggle chat bubble visibility
                if (window.enhancedTechSupport) {
                    window.enhancedTechSupport.toggleVisibility(request.visible);
                }
                sendResponse({ success: true });
                break;
                
            case 'setChatBubbleVisibility':
                // Set chat bubble visibility
                if (window.enhancedTechSupport) {
                    window.enhancedTechSupport.setVisibility(request.visible);
                }
                sendResponse({ success: true });
                break;
                
            default:
                sendResponse({ error: 'Unknown action' });
        }
        
        return true; // Keep message channel open for async response
    });
    
    // Monitor page for tech support related content
    observePageChanges();
  }
  
  function addExtensionIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'enhanced-tech-support-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      background: #4CAF50;
      border-radius: 50%;
      z-index: 10000;
      cursor: pointer;
      opacity: 0.7;
    `;
    
    indicator.title = 'Enhanced Tech Support Assistant Active';
    indicator.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    
    document.body.appendChild(indicator);
  }
  
  function handleMessage(request, sendResponse) {
    switch (request.action) {
      case 'scanPage':
        const pageInfo = analyzePage();
        sendResponse({ success: true, data: pageInfo });
        break;
        
      case 'getPageInfo':
        const info = getPageInfo();
        sendResponse({ success: true, data: info });
        break;
        
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }
  
  function analyzePage() {
    return {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname,
      timestamp: Date.now(),
      hasForms: document.forms.length > 0,
      hasErrors: document.querySelectorAll('.error, .alert, .warning').length > 0
    };
  }
  
  function getPageInfo() {
    return {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname,
      timestamp: Date.now()
    };
  }
  
  function observePageChanges() {
    // Monitor for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check for new tech support related content
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Could implement content analysis here
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
