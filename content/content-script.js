// Enhanced Tech Support Assistant - Content Script
console.log('Enhanced Tech Support Assistant content script loaded');

// Initialize content script
(function() {
  'use strict';
  
  let chatBubbleAssistant = null;
  
  // Check if extension is enabled and initialize
  chrome.storage.local.get(['enabled', 'chatBubbleVisible'], (result) => {
    if (result.enabled !== false) {
      initializeExtension(result.chatBubbleVisible !== false);
    }
  });
  
  function initializeExtension(shouldShowChatBubble = true) {
    console.log('Initializing Enhanced Tech Support Assistant');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createChatBubble(shouldShowChatBubble);
      });
    } else {
      createChatBubble(shouldShowChatBubble);
    }
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Content script received message:', request);
      
      switch (request.action) {
        case 'toggleChatBubble':
          if (chatBubbleAssistant) {
            chatBubbleAssistant.toggleVisibility(request.visible);
          }
          sendResponse({ success: true });
          break;
          
        case 'setChatBubbleVisibility':
          if (chatBubbleAssistant) {
            chatBubbleAssistant.setVisibility(request.visible);
          }
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ error: 'Unknown action' });
      }
      
      return true; // Keep message channel open for async response
    });
  }
  
  async function createChatBubble(visible = true) {
    try {
      // Create the chat bubble container
      const chatBubble = document.createElement('div');
      chatBubble.id = 'enhanced-tech-support-bubble';
      chatBubble.className = 'enhanced-tech-support-bubble';
      chatBubble.style.display = visible ? 'block' : 'none';
      
      // Add the chat bubble to the page
      document.body.appendChild(chatBubble);
      
      // Initialize the ChatBubbleAssistant
      if (typeof ChatBubbleAssistant !== 'undefined') {
        chatBubbleAssistant = new ChatBubbleAssistant();
        console.log('ChatBubbleAssistant initialized successfully');
      } else {
        console.error('ChatBubbleAssistant class not found - popup scripts may not be loaded');
        // Fallback: create a simple chat bubble
        createFallbackChatBubble(chatBubble);
      }
      
    } catch (error) {
      console.error('Failed to create chat bubble:', error);
      // Fallback: create a simple chat bubble
      createFallbackChatBubble(document.createElement('div'));
    }
  }
  
  function createFallbackChatBubble(container) {
    // Create a simple fallback chat bubble if the main class fails
    container.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        height: 400px;
        background: white;
        border: 2px solid #007bff;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background: #007bff;
          color: white;
          padding: 10px;
          border-radius: 8px 8px 0 0;
          font-weight: bold;
          cursor: move;
        ">🤖 Tech Support Assistant</div>
        <div style="padding: 15px;">
          <p>Extension loaded but some components failed to initialize.</p>
          <p>Please check the console for errors and reload the extension.</p>
        </div>
      </div>
    `;
    
    // Make it draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    const header = container.querySelector('div');
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragOffset.x = e.clientX - container.offsetLeft;
      dragOffset.y = e.clientY - container.offsetTop;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        container.style.left = (e.clientX - dragOffset.x) + 'px';
        container.style.top = (e.clientY - dragOffset.y) + 'px';
      }
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
  
  // Monitor page for tech support related content
  function observePageChanges() {
    // This could be expanded to monitor for tech-related content
    // and automatically suggest help when issues are detected
  }
  
})();
