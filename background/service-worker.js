// Enhanced Tech Support Assistant - Service Worker
console.log('Enhanced Tech Support Assistant service worker loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details.reason);
    
    if (details.reason === 'install') {
        // Set default settings on first install
        chrome.storage.local.set({
            enabled: true,
            autoScan: false,
            notifications: true,
            chatBubbleVisible: true
        });
    }
});

// Handle extension icon click (toggle chat bubble)
chrome.action.onClicked.addListener(async (tab) => {
    try {
        console.log('Extension icon clicked, toggling chat bubble');
        
        // Toggle chat bubble visibility
        const result = await chrome.storage.local.get(['chatBubbleVisible']);
        const newState = !result.chatBubbleVisible;
        
        await chrome.storage.local.set({ chatBubbleVisible: newState });
        
        // Check if content script is ready before sending message
        try {
            // Send message to content script to toggle visibility
            await chrome.tabs.sendMessage(tab.id, {
                action: 'toggleChatBubble',
                visible: newState
            });
            
            console.log('Chat bubble toggled:', newState);
            
        } catch (messageError) {
            console.log('Content script not ready yet, will retry on next page load');
            // The content script will pick up the state when it loads
        }
        
    } catch (error) {
        console.error('Failed to toggle chat bubble:', error);
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    
    switch (request.action) {
        case 'getStatus':
            sendResponse({ status: 'active', timestamp: Date.now() });
            break;
            
        case 'scanPage':
            // Handle page scanning request
            sendResponse({ success: true, message: 'Page scan initiated' });
            break;
            
        case 'crawlURL':
            // Handle URL crawling request
            handleURLCrawling(request.url, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'testDocumentationAccess':
            // Handle documentation access testing
            testDocumentationAccess(request.url, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'toggleChatBubble':
            // Handle chat bubble toggle request
            handleChatBubbleToggle(request.visible, sender.tab.id, sendResponse);
            break;
            
        default:
            sendResponse({ error: 'Unknown action' });
    }
});

// Handle URL crawling
async function handleURLCrawling(url, sendResponse) {
    try {
        console.log('Crawling URL:', url);
        
        // Use fetch to get the URL content
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type') || 'unknown';
        let content = await response.text();
        
        // Clean and process content based on type
        if (contentType.includes('text/html')) {
            content = cleanHTMLContent(content);
        } else if (contentType.includes('application/json')) {
            content = JSON.stringify(JSON.parse(content), null, 2);
        } else if (contentType.includes('text/plain')) {
            content = content.trim();
        }
        
        sendResponse({
            success: true,
            content: content,
            contentType: contentType,
            timestamp: Date.now()
        });
        
    } catch (error) {
        console.error('URL crawling failed:', error);
        sendResponse({
            success: false,
            error: error.message,
            timestamp: Date.now()
        });
    }
}

// Clean HTML content to extract meaningful text
function cleanHTMLContent(html) {
    // Remove script and style tags
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove HTML tags but keep line breaks
    html = html.replace(/<br\s*\/?>/gi, '\n');
    html = html.replace(/<\/p>/gi, '\n');
    html = html.replace(/<\/div>/gi, '\n');
    html = html.replace(/<\/h[1-6]>/gi, '\n');
    
    // Remove remaining HTML tags
    html = html.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    html = html.replace(/&amp;/g, '&');
    html = html.replace(/&lt;/g, '<');
    html = html.replace(/&gt;/g, '>');
    html = html.replace(/&quot;/g, '"');
    html = html.replace(/&#39;/g, "'");
    
    // Clean up whitespace
    html = html.replace(/\n\s*\n/g, '\n');
    html = html.trim();
    
    return html;
}

// Test documentation access
async function testDocumentationAccess(url, sendResponse) {
    try {
        console.log('Testing documentation access:', url);
        
        // Use fetch to test if the URL is accessible
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Get a small sample of content to verify it's documentation
        const contentType = response.headers.get('content-type') || 'unknown';
        let content = await response.text();
        
        // For HTML content, extract a sample
        if (contentType.includes('text/html')) {
            content = cleanHTMLContent(content).substring(0, 1000); // First 1000 characters
        } else if (contentType.includes('application/json')) {
            content = content.substring(0, 1000); // First 1000 characters
        } else if (contentType.includes('text/plain')) {
            content = content.substring(0, 1000).trim(); // First 1000 characters
        }
        
        // Check if content looks like documentation
        const isDocumentation = checkIfDocumentation(content, url);
        
        sendResponse({
            success: true,
            accessible: true,
            isDocumentation: isDocumentation,
            contentType: contentType,
            sampleContent: content,
            timestamp: Date.now()
        });
        
    } catch (error) {
        console.error('Documentation access test failed:', error);
        sendResponse({
            success: false,
            accessible: false,
            error: error.message,
            timestamp: Date.now()
        });
    }
}

// Check if content looks like documentation
function checkIfDocumentation(content, url) {
    const lowerContent = content.toLowerCase();
    const lowerUrl = url.toLowerCase();
    
    // Check for documentation indicators in content
    const docKeywords = [
        'documentation', 'docs', 'api', 'reference', 'guide', 'tutorial',
        'getting started', 'examples', 'syntax', 'parameters', 'returns',
        'installation', 'configuration', 'usage', 'methods', 'properties'
    ];
    
    const hasDocKeywords = docKeywords.some(keyword => 
        lowerContent.includes(keyword)
    );
    
    // Check for documentation indicators in URL
    const urlDocPatterns = [
        '/docs/', '/documentation/', '/api/', '/reference/', '/guide/',
        '/tutorial/', '/examples/', '/help/', '/support/'
    ];
    
    const hasDocUrlPattern = urlDocPatterns.some(pattern => 
        lowerUrl.includes(pattern)
    );
    
    // Check for common documentation site domains
    const docDomains = [
        'docs.', 'documentation.', 'api.', 'developer.', 'help.',
        'support.', 'learn.', 'tutorial.'
    ];
    
    const hasDocDomain = docDomains.some(domain => 
        lowerUrl.includes(domain)
    );
    
    // Return true if any documentation indicators are found
    return hasDocKeywords || hasDocUrlPattern || hasDocDomain;
}

// Handle chat bubble toggle
async function handleChatBubbleToggle(visible, tabId, sendResponse) {
    try {
        console.log('Toggling chat bubble visibility:', visible);
        
        // Update storage
        await chrome.storage.local.set({ chatBubbleVisible: visible });
        
        // Send response
        sendResponse({ success: true, visible: visible });
        
    } catch (error) {
        console.error('Failed to toggle chat bubble:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Handle tab updates for monitoring
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('Tab updated:', tab.url);
        // Could implement page monitoring logic here
    }
});

// Handle tab activation to ensure chat bubble state is correct
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const result = await chrome.storage.local.get(['chatBubbleVisible']);
        const isVisible = result.chatBubbleVisible !== false; // Default to true
        
        // Send current state to the newly activated tab
        await chrome.tabs.sendMessage(activeInfo.tabId, {
            action: 'setChatBubbleVisibility',
            visible: isVisible
        });
        
    } catch (error) {
        console.error('Failed to sync chat bubble state:', error);
    }
});
