// Simple Tech Support Assistant - Service Worker
console.log('Simple Tech Support Assistant service worker loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details.reason);
});

// Handle extension icon click (toggle bubble)
chrome.action.onClicked.addListener(async (tab) => {
    try {
        console.log('Extension icon clicked, toggling bubble');
        
        // Check if tab URL is accessible (not chrome:// or other restricted URLs)
        if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://'))) {
            console.log('Cannot inject content script on browser internal page:', tab.url);
            return;
        }
        
        // Send message to content script to toggle bubble
        chrome.tabs.sendMessage(tab.id, {
            type: 'TOGGLE_BUBBLE'
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('Content script not ready, injecting...');
                // If content script not ready, inject it
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content-script.js']
                });
            }
        });
    } catch (error) {
        console.error('Failed to handle extension click:', error);
    }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    
    switch (request.action) {
        case 'getStatus':
            sendResponse({ status: 'active', timestamp: Date.now() });
            break;
            
        default:
            sendResponse({ error: 'Unknown action' });
    }
});