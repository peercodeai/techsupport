// Simple Test Version - Enhanced Tech Support Assistant
console.log('🧪 TEST VERSION: Enhanced Tech Support Assistant content script loaded');

// Simple test chat bubble
function createSimpleTestBubble() {
  console.log('Creating simple test bubble...');
  
  // Check if we're on a restricted page
  if (window.location.href.startsWith('chrome://') || 
      window.location.href.startsWith('chrome-extension://')) {
    console.log('❌ Restricted page detected, skipping bubble creation');
    return;
  }
  
  // Create a simple visible chat bubble
  const testBubble = document.createElement('div');
  testBubble.id = 'test-tech-support-bubble';
  testBubble.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      height: 200px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: Arial, sans-serif;
      cursor: move;
      user-select: none;
    ">
      <div style="
        padding: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        font-weight: bold;
        font-size: 16px;
      ">
        🧪 TEST: Tech Support Assistant
      </div>
      <div style="padding: 15px; font-size: 14px;">
        <p>✅ Content script loaded successfully!</p>
        <p>✅ Chat bubble created!</p>
        <p>✅ Extension is working!</p>
        <br>
        <p><strong>Status:</strong> Ready for full version</p>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(testBubble);
  console.log('✅ Simple test bubble created and added to page');
  
  // Make it draggable
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  testBubble.addEventListener('mousedown', (e) => {
    if (e.target === testBubble || e.target.parentElement === testBubble) {
      isDragging = true;
      dragOffset.x = e.clientX - testBubble.offsetLeft;
      dragOffset.y = e.clientY - testBubble.offsetTop;
      console.log('🖱️ Started dragging test bubble');
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      testBubble.style.left = (e.clientX - dragOffset.x) + 'px';
      testBubble.style.top = (e.clientY - dragOffset.y) + 'px';
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      console.log('🖱️ Stopped dragging test bubble');
    }
  });
  
  // Add click to hide/show
  testBubble.addEventListener('click', () => {
    if (testBubble.style.display === 'none') {
      testBubble.style.display = 'block';
      console.log('👁️ Test bubble shown');
    } else {
      testBubble.style.display = 'none';
      console.log('👁️ Test bubble hidden');
    }
  });
  
  // Add double-click to remove
  testBubble.addEventListener('dblclick', () => {
    testBubble.remove();
    console.log('🗑️ Test bubble removed');
  });
  
  return testBubble;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, creating test bubble...');
    createSimpleTestBubble();
  });
} else {
  console.log('📄 DOM already ready, creating test bubble...');
  createSimpleTestBubble();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Test content script received message:', request);
  
  switch (request.action) {
    case 'testBubble':
      const bubble = createSimpleTestBubble();
      sendResponse({ success: true, bubbleCreated: !!bubble });
      break;
      
    case 'getStatus':
      sendResponse({ 
        status: 'active', 
        testMode: true,
        bubbleExists: !!document.getElementById('test-tech-support-bubble'),
        timestamp: Date.now() 
      });
      break;
      
    default:
      sendResponse({ error: 'Unknown action in test mode' });
  }
  
  return true;
});

console.log('🧪 Test content script setup complete');
