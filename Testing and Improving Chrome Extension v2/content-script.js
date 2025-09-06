// Simple Tech Support Assistant - Content Script
console.log('Simple Tech Support Assistant loaded');

class SimpleTechSupport {
    constructor() {
        this.apiKey = null;
        this.bubble = null;
        this.isVisible = false;
        this.position = { x: 20, y: 20 };
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.createBubble();
        this.setupEventListeners();
        console.log('Simple Tech Support initialized');
    }
    
    createBubble() {
        // Remove existing bubble if any
        if (this.bubble) {
            this.bubble.remove();
        }
        
        // Create main container
        this.bubble = document.createElement('div');
        this.bubble.id = 'simple-tech-support';
        this.bubble.className = 'simple-tech-support';
        
        // Set initial position
        this.bubble.style.left = `${this.position.x}px`;
        this.bubble.style.top = `${this.position.y}px`;
        
        // Create bubble content
        this.bubble.innerHTML = `
            <div class="bubble-header" id="bubble-header">
                <span class="bubble-title">Tech Support</span>
                <div class="bubble-controls">
                    <button class="control-btn" id="close-btn" title="Close">×</button>
                </div>
            </div>
            <div class="bubble-content" id="bubble-content">
                <div class="chat-messages" id="chat-messages">
                    <div class="welcome-message">
                        <h3>👋 Tech Support Assistant</h3>
                        <p>Paste your OpenAI API key to get started!</p>
                    </div>
                </div>
                <div class="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Paste your API key or ask a question..." />
                    <button id="send-btn">Send</button>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Add to page
        document.body.appendChild(this.bubble);
        
        // Hide initially
        this.hide();
    }
    
    addStyles() {
        if (document.getElementById('simple-tech-support-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'simple-tech-support-styles';
        styles.textContent = `
            .simple-tech-support {
                position: fixed;
                width: 350px;
                max-height: 500px;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid #e5e7eb;
                display: none;
                overflow: hidden;
                min-width: 300px;
                min-height: 200px;
            }
            
            .simple-tech-support.visible {
                display: flex;
                flex-direction: column;
            }
            
            .bubble-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: move;
                user-select: none;
                border-radius: 12px 12px 0 0;
            }
            
            .bubble-title {
                font-weight: 600;
                font-size: 14px;
            }
            
            .bubble-controls {
                display: flex;
                gap: 4px;
            }
            
            .control-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            
            .control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .bubble-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                max-height: 300px;
            }
            
            .welcome-message {
                text-align: center;
                color: #6b7280;
                margin-bottom: 16px;
            }
            
            .welcome-message h3 {
                margin: 0 0 8px 0;
                font-size: 16px;
            }
            
            .welcome-message p {
                margin: 0;
                font-size: 14px;
            }
            
            .message {
                margin-bottom: 12px;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .message.user {
                background: #3b82f6;
                color: white;
                margin-left: 20px;
            }
            
            .message.assistant {
                background: #f3f4f6;
                color: #374151;
                margin-right: 20px;
            }
            
            .message.system {
                background: #fef3c7;
                color: #92400e;
                font-style: italic;
                text-align: center;
            }
            
            .chat-input-container {
                padding: 12px 16px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 8px;
            }
            
            #chat-input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                outline: none;
                color: #374151 !important;
                background: #ffffff !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            
            #chat-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            #chat-input::placeholder {
                color: #9ca3af !important;
            }
            
            #send-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            #send-btn:hover {
                background: #2563eb;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    setupEventListeners() {
        const header = this.bubble.querySelector('#bubble-header');
        const closeBtn = this.bubble.querySelector('#close-btn');
        const chatInput = this.bubble.querySelector('#chat-input');
        const sendBtn = this.bubble.querySelector('#send-btn');
        
        // Dragging functionality
        header.addEventListener('mousedown', (e) => this.startDragging(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDragging());
        
        // Controls
        closeBtn.addEventListener('click', () => this.hide());
        
        // Chat functionality
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Prevent bubble from closing when clicking inside
        this.bubble.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    startDragging(e) {
        this.isDragging = true;
        const rect = this.bubble.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        this.bubble.style.transition = 'none';
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const newX = e.clientX - this.dragOffset.x;
        const newY = e.clientY - this.dragOffset.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - this.bubble.offsetWidth;
        const maxY = window.innerHeight - this.bubble.offsetHeight;
        
        this.position.x = Math.max(0, Math.min(newX, maxX));
        this.position.y = Math.max(0, Math.min(newY, maxY));
        
        this.bubble.style.left = `${this.position.x}px`;
        this.bubble.style.top = `${this.position.y}px`;
    }
    
    stopDragging() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.bubble.style.transition = 'all 0.3s ease';
    }
    
    show() {
        this.isVisible = true;
        this.bubble.classList.add('visible');
    }
    
    hide() {
        this.isVisible = false;
        this.bubble.classList.remove('visible');
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    addMessage(type, content) {
        const messagesContainer = this.bubble.querySelector('#chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    async sendMessage() {
        const chatInput = this.bubble.querySelector('#chat-input');
        let message = chatInput.value.trim();
        
        if (!message) return;
        
        // Clear input
        chatInput.value = '';
        
        // Add user message
        this.addMessage('user', message);
        
        // Check if the message looks like an API key
        if (message.startsWith('sk-') && message.length > 20) {
            this.apiKey = message;
            this.addMessage('assistant', '🔑 API key saved! You can now ask me questions.');
            return;
        }
        
        // Check if API key is available
        if (!this.apiKey) {
            this.addMessage('assistant', '🤖 I need your OpenAI API key to help you! Please paste it here (starts with sk-).');
            return;
        }
        
        // Check if message contains URLs for documentation crawling
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.match(urlRegex);
        
        if (urls) {
            this.addMessage('assistant', '🔍 I see you\'ve provided URLs! Let me try to crawl the documentation to help you better...');
            
            try {
                const crawledContent = await this.crawlDocumentation(urls);
                message += `\n\nDocumentation content:\n${crawledContent}`;
            } catch (error) {
                this.addMessage('assistant', `⚠️ Couldn't crawl all URLs: ${error.message}\n\n💡 If crawling fails due to CORS restrictions, you can:\n1. Copy and paste the content directly\n2. Describe what you see on the page\n3. Ask specific questions about the documentation`);
            }
        }
        
        // Add current page context to the message
        const pageContext = this.getPageContext();
        if (pageContext) {
            message += `\n\nCurrent page context:\n${pageContext}`;
        }
        
        // Show typing indicator
        this.addMessage('assistant', '🤔 Thinking...');
        
        try {
            // Send to OpenAI
            const response = await this.callOpenAI(message);
            
            // Remove typing indicator and add response
            const messagesContainer = this.bubble.querySelector('#chat-messages');
            const lastMessage = messagesContainer.lastElementChild;
            if (lastMessage && lastMessage.textContent === '🤔 Thinking...') {
                lastMessage.remove();
            }
            
            this.addMessage('assistant', response);
            
        } catch (error) {
            // Remove typing indicator
            const messagesContainer = this.bubble.querySelector('#chat-messages');
            const lastMessage = messagesContainer.lastElementChild;
            if (lastMessage && lastMessage.textContent === '🤔 Thinking...') {
                lastMessage.remove();
            }
            
            this.addMessage('assistant', `❌ Error: ${error.message}`);
        }
    }
    
    async crawlDocumentation(urls) {
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        
        for (const url of urls) {
            try {
                // Check if URL is accessible (not chrome:// or other restricted URLs)
                if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('moz-extension://') || url.startsWith('file://')) {
                    results.push(`[SKIPPED] ${url} - Browser internal or local file URL`);
                    continue;
                }
                
                console.log('Crawling URL:', url);
                
                // Try multiple approaches for better success rate
                let response;
                let content;
                
                try {
                    // First try: Standard fetch with CORS
                    response = await fetch(url, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'DNT': '1',
                            'Connection': 'keep-alive',
                            'Upgrade-Insecure-Requests': '1'
                        }
                    });
                } catch (corsError) {
                    // Second try: No-cors mode (limited but sometimes works)
                    try {
                        response = await fetch(url, {
                            method: 'GET',
                            mode: 'no-cors'
                        });
                        
                        if (response.type === 'opaque') {
                            throw new Error('CORS policy prevents access - content not readable');
                        }
                    } catch (noCorsError) {
                        throw new Error(`CORS policy prevents access: ${corsError.message}`);
                    }
                }
                
                if (!response.ok) {
                    results.push(`[ERROR] ${url} - HTTP ${response.status}: ${response.statusText}`);
                    errorCount++;
                    continue;
                }
                
                const contentType = response.headers.get('content-type') || 'unknown';
                content = await response.text();
                
                // Clean and process content based on type
                if (contentType.includes('text/html')) {
                    content = this.cleanHTMLContent(content);
                } else if (contentType.includes('application/json')) {
                    try {
                        content = JSON.stringify(JSON.parse(content), null, 2);
                    } catch (jsonError) {
                        content = content.trim();
                    }
                } else if (contentType.includes('text/plain')) {
                    content = content.trim();
                }
                
                // Limit content length to avoid token limits
                if (content.length > 3000) {
                    content = content.substring(0, 3000) + '... [truncated]';
                }
                
                results.push(`[SUCCESS] ${url}:\n${content}`);
                successCount++;
                
            } catch (error) {
                console.error('URL crawling failed:', error);
                errorCount++;
                
                if (error.message.includes('chrome://')) {
                    results.push(`[SKIPPED] ${url} - Cannot access browser internal URL`);
                } else if (error.message.includes('CORS') || error.message.includes('cors')) {
                    results.push(`[CORS ERROR] ${url} - This website blocks direct access from extensions. Try copying the content manually or use a different approach.`);
                } else if (error.message.includes('Failed to fetch')) {
                    results.push(`[NETWORK ERROR] ${url} - Network error or server unavailable. Check your internet connection.`);
                } else {
                    results.push(`[ERROR] ${url} - ${error.message}`);
                }
            }
        }
        
        // Add summary
        const summary = `\n\n📊 Crawling Summary: ${successCount} successful, ${errorCount} failed`;
        results.push(summary);
        
        // Add helpful suggestions if all failed
        if (successCount === 0 && errorCount > 0) {
            results.push(`\n💡 Alternative approaches when crawling fails:\n1. Copy and paste the content directly into the chat\n2. Use the browser's "View Page Source" and copy relevant sections\n3. Try accessing the URL in a new tab and describe what you see\n4. Some documentation sites have API endpoints that might be more accessible\n5. Use the "What page am I on?" feature if you're already on the documentation page`);
        }
        
        return results.join('\n\n---\n\n');
    }
    
    cleanHTMLContent(html) {
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
    
    getPageContext() {
        try {
            const context = {
                url: window.location.href,
                title: document.title,
                domain: window.location.hostname,
                path: window.location.pathname,
                search: window.location.search,
                hash: window.location.hash
            };
            
            // Get page content
            const bodyText = document.body ? document.body.innerText : '';
            const headText = document.head ? document.head.innerText : '';
            
            // Get visible text content (limit to avoid token limits)
            let visibleText = bodyText.substring(0, 2000);
            if (visibleText.length === 2000) {
                visibleText += '... [truncated]';
            }
            
            // Get console errors if any
            const consoleErrors = this.getConsoleErrors();
            
            // Get form elements
            const forms = Array.from(document.querySelectorAll('form')).map(form => ({
                action: form.action,
                method: form.method,
                inputs: Array.from(form.querySelectorAll('input, select, textarea')).map(input => ({
                    type: input.type,
                    name: input.name,
                    id: input.id,
                    placeholder: input.placeholder,
                    value: input.value ? input.value.substring(0, 100) : ''
                }))
            }));
            
            // Get links
            const links = Array.from(document.querySelectorAll('a[href]')).slice(0, 10).map(link => ({
                text: link.textContent.trim().substring(0, 50),
                href: link.href
            }));
            
            // Get images
            const images = Array.from(document.querySelectorAll('img[src]')).slice(0, 5).map(img => ({
                src: img.src,
                alt: img.alt,
                width: img.width,
                height: img.height
            }));
            
            return `Page URL: ${context.url}
Page Title: ${context.title}
Domain: ${context.domain}
Path: ${context.path}
Visible Text: ${visibleText}
Console Errors: ${consoleErrors.length > 0 ? consoleErrors.join(', ') : 'None'}
Forms: ${forms.length > 0 ? JSON.stringify(forms, null, 2) : 'None'}
Links: ${links.length > 0 ? JSON.stringify(links, null, 2) : 'None'}
Images: ${images.length > 0 ? JSON.stringify(images, null, 2) : 'None'}`;
            
        } catch (error) {
            console.error('Error getting page context:', error);
            return `Page URL: ${window.location.href}\nPage Title: ${document.title}`;
        }
    }
    
    getConsoleErrors() {
        // This would need to be set up to capture console errors
        // For now, return empty array
        return [];
    }
    
    async callOpenAI(message) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful tech support assistant. Help users troubleshoot technical issues, explain errors, and provide solutions. You have access to the current page context, so you can see what page the user is on, what content is visible, any forms or links present, and any console errors. Use this context to provide specific, relevant help based on what the user is actually looking at.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simpleTechSupport = new SimpleTechSupport();
    });
} else {
    window.simpleTechSupport = new SimpleTechSupport();
}

// Listen for extension icon clicks
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOGGLE_BUBBLE' && window.simpleTechSupport) {
        window.simpleTechSupport.toggle();
        sendResponse({ success: true });
    }
});