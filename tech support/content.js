// content.js

console.log("Tech Support Extension Content Script Loaded");

// Example: Injecting a simple chat widget (this will be replaced by a more complex one)
const chatWidget = document.createElement("div");
chatWidget.id = "tech-support-chat-widget";
chatWidget.innerHTML = "<p>Tech Support Chat (placeholder)</p>";
document.body.appendChild(chatWidget);

// Network monitoring without webRequest permission
// Intercept fetch requests to detect network issues
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    const response = await originalFetch.apply(this, args);
    
    // Check for error status codes
    if (response.status >= 400 && response.status < 600) {
      const url = args[0] instanceof Request ? args[0].url : args[0];
      const method = args[0] instanceof Request ? args[0].method : (args[1]?.method || 'GET');
      
      console.log(`Tech Support Extension: Network issue detected - ${method} ${url} returned ${response.status}`);
      
      // Send issue to background script
      chrome.runtime.sendMessage({
        type: "networkIssue",
        url: url,
        method: method,
        statusCode: response.status
      });
    }
    
    return response;
  } catch (error) {
    // Handle network errors (timeouts, connection failures, etc.)
    const url = args[0] instanceof Request ? args[0].url : args[0];
    const method = args[0] instanceof Request ? args[0].method : (args[1]?.method || 'GET');
    
    console.log(`Tech Support Extension: Network error detected - ${method} ${url} failed:`, error.message);
    
    // Send error to background script
    chrome.runtime.sendMessage({
      type: "networkIssue",
      url: url,
      method: method,
      statusCode: 0, // 0 indicates network error
      error: error.message
    });
    
    throw error;
  }
};

// Intercept XMLHttpRequest for older code
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, ...args) {
  this._techSupportMethod = method;
  this._techSupportUrl = url;
  return originalXHROpen.apply(this, [method, url, ...args]);
};

XMLHttpRequest.prototype.send = function(...args) {
  const xhr = this;
  const originalOnReadyStateChange = xhr.onreadystatechange;
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 400 && xhr.status < 600) {
        console.log(`Tech Support Extension: XHR issue detected - ${xhr._techSupportMethod} ${xhr._techSupportUrl} returned ${xhr.status}`);
        
        chrome.runtime.sendMessage({
          type: "networkIssue",
          url: xhr._techSupportUrl,
          method: xhr._techSupportMethod,
          statusCode: xhr.status
        });
      }
    }
    
    if (originalOnReadyStateChange) {
      originalOnReadyStateChange.apply(xhr, args);
    }
  };
  
  return originalXHRSend.apply(this, args);
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "issueDetected") {
    console.log("Issue detected by background script:", request.details);
    // Here you would update the chat widget or display a notification
  }
  
  if (request.type === "solutionFound") {
    console.log("Solution found for issue:", request.solution);
    // Display solution to user
    const solutionDiv = document.createElement("div");
    solutionDiv.innerHTML = `<p><strong>Tech Support Solution:</strong> ${request.solution}</p>`;
    solutionDiv.style.cssText = "position: fixed; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 10px; border-radius: 5px; z-index: 10000; max-width: 300px;";
    document.body.appendChild(solutionDiv);
    
    // Remove after 10 seconds
    setTimeout(() => solutionDiv.remove(), 10000);
  }
});

// Manual network testing function for development
window.testNetworkIssue = function(url, expectedStatus) {
  console.log(`Tech Support Extension: Testing network issue for ${url}`);
  
  fetch(url)
    .then(response => {
      if (response.status === expectedStatus) {
        console.log(`Tech Support Extension: Expected status ${expectedStatus} received`);
      }
    })
    .catch(error => {
      console.log(`Tech Support Extension: Network error as expected:`, error.message);
    });
};


